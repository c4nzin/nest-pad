import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Config, ENV } from '../../config';
import { UserService } from 'src/features/user/user.service';
import * as argon2 from 'argon2';
import { TokenResponse } from 'src/core/interfaces';
import { Types } from 'mongoose';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UserService,
    @Inject(ENV) private config: Config,
  ) {}

  public async updateRefreshToken(
    userId: string | Types.ObjectId,
    refreshToken: string,
  ): Promise<void> {
    const hashedRefreshToken = await this.hashData(refreshToken);
    await this.usersService.updateRefreshToken(userId, {
      refreshToken: hashedRefreshToken,
    });
  }

  public async generateAccessToken(
    userId: string | Types.ObjectId,
    username: string,
  ): Promise<string> {
    return this.jwtService.signAsync(
      { sub: userId, username },
      {
        secret: this.config.JWT_ACCESS_SECRET,
        expiresIn: this.config.EXPIRES_IN,
      },
    );
  }

  public async generateRefreshToken(
    userId: string | Types.ObjectId,
    username: string,
  ): Promise<string> {
    return this.jwtService.signAsync(
      { sub: userId, username },
      {
        secret: this.config.JWT_REFRESH_SECRET,
        expiresIn: this.config.REFRESH_TIME,
      },
    );
  }

  public async hashData(data: string): Promise<string> {
    return argon2.hash(data);
  }

  public async refreshToken(
    userId: string | Types.ObjectId,
    refreshToken: string,
  ): Promise<string> {
    const user = await this.usersService.findById(userId);

    if (!user) throw new BadRequestException('User not found');

    if (!user.refreshToken) {
      throw new ForbiddenException('Refresh token is not found');
    }

    const isRefreshTokenValid = await argon2.verify(
      user.refreshToken,
      refreshToken,
    );

    if (!isRefreshTokenValid) throw new ForbiddenException('Access Denied');

    const accessToken = await this.generateAccessToken(user._id, user.username);

    const newRefreshToken = await this.generateRefreshToken(
      user._id,
      user.username,
    );

    await this.updateRefreshToken(user._id, newRefreshToken);

    return accessToken;
  }

  public async generateAndSaveTokens(
    userId: string | Types.ObjectId,
    username: string,
  ): Promise<TokenResponse> {
    const accessToken = await this.generateAccessToken(userId, username);
    const refreshToken = await this.generateRefreshToken(userId, username);
    await this.updateRefreshToken(userId, refreshToken);

    return { accessToken, refreshToken };
  }
}

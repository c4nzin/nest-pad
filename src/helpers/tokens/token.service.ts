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

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(ENV) private config: Config,
    private readonly usersService: UserService,
  ) {}

  public async updateRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<void> {
    const hashedRefreshToken = await this.hashData(refreshToken);
    await this.usersService.update(userId, {
      refreshToken: hashedRefreshToken,
    });
  }

  public async generateAccessToken(
    userId: string,
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
    userId: string,
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
    userId: string,
    refreshToken: string,
  ): Promise<string> {
    const user = await this.usersService.findById(userId);

    if (!user) throw new BadRequestException('User not found');

    if (!user.refreshToken) {
      throw new ForbiddenException('Refresh token is not found');
    }

    const isRefreshTokenMatches = await argon2.verify(
      user.refreshToken,
      refreshToken,
    );

    if (!isRefreshTokenMatches) throw new ForbiddenException('Access Denied');

    const generateAccessToken = await this.generateAccessToken(
      user._id,
      user.username,
    );

    const generateRefreshToken = await this.generateRefreshToken(
      user._id,
      user.username,
    );

    await this.updateRefreshToken(user.id, generateRefreshToken);

    return generateAccessToken;
  }

  public async generateAndSaveTokens(
    userId: string,
    username: string,
  ): Promise<TokenResponse> {
    const accessToken = await this.generateAccessToken(userId, username);
    const refreshToken = await this.generateRefreshToken(userId, username);
    await this.updateRefreshToken(userId, username);

    return { accessToken, refreshToken };
  }
}

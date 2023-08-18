import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { RegisterDto } from './dto';
import { UserService } from '../user/user.service';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';

import { LoginDto } from './dto';
import { Config, ENV } from 'src/config';
import { UserDocument } from '../user/user.schema';
import { hashData, verifyData } from '../../utils/data-modify'; //will be used in the future
import { TokenResponse } from 'src/core/interfaces';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
    @Inject(ENV) private readonly config: Config,
  ) {}

  public async register(createUserDto: RegisterDto): Promise<TokenResponse> {
    const user = await this.usersService.findByUsername(createUserDto.username);

    if (user) throw new BadRequestException('User already exists');

    const hashedPassword = await this.hashData(createUserDto.password);
    const newUser = await this.usersService.create({
      ...createUserDto,
      password: hashedPassword,
    });

    const tokens = await this.getTokens(newUser._id, newUser.username);
    await this.updateRefreshToken(newUser._id, tokens.refreshToken);

    return tokens;
  }

  public async login(loginDto: LoginDto): TokenResponse {
    const user = await this.usersService.findByUsername(loginDto.username);
    if (!user) {
      throw new BadRequestException('User does not exist');
    }

    const isPasswordMatches = await argon2.verify(
      user.password,
      loginDto.password,
    );

    if (!isPasswordMatches) {
      throw new BadRequestException('Password is not correct');
    }

    const tokens = await this.getTokens(user._id, user.username);

    await this.updateRefreshToken(user._id, tokens.refreshToken);

    return tokens;
  }

  public async logout(userId: string): Promise<UserDocument> {
    return this.usersService.update(userId, { refreshToken: null });
  }

  //This field will be removed
  public async hashData(data: string): Promise<string> {
    return argon2.hash(data);
  }

  public async updateRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<void> {
    const hashedRefreshToken = await this.hashData(refreshToken);
    await this.usersService.update(userId, {
      refreshToken: hashedRefreshToken,
    });
  }

  public async getTokens(userId: string, username: string): TokenResponse {
    const [accessToken, refreshToken] = await Promise.all([
      //Generating access token
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
        },
        {
          secret: this.config.JWT_ACCESS_SECRET,
          expiresIn: this.config.EXPIRES_IN,
        },
      ),

      //Generating refresh jwt
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
        },
        {
          secret: this.config.JWT_REFRESH_SECRET,
          expiresIn: this.config.REFRESH_TIME,
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  public async refreshToken(
    userId: string,
    refreshToken: string,
  ): TokenResponse {
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

    const tokens = await this.getTokens(user.id, user.username);

    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }
}

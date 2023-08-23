import { Injectable, BadRequestException } from '@nestjs/common';
import * as argon2 from 'argon2';

import { UserDocument } from '../user/user.schema';
import { UserService } from '../user/user.service';
import { LoginDto, RegisterDto } from './dto';
import { TokenService } from 'src/features/auth/token.service';
import { LoginReturnType } from './auth.controller';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
  ) {}

  public async register(registerDto: RegisterDto): Promise<string> {
    const isUserAlreadyExists = await this.userService.findByUsernameAndEmail(
      registerDto.email,
      registerDto.username,
    );

    if (isUserAlreadyExists.email) {
      throw new BadRequestException('Email is already registered');
    }

    if (isUserAlreadyExists.username) {
      throw new BadRequestException('User already exists');
    }

    const hashedPassword = await this.tokenService.hashData(
      registerDto.password,
    );

    const createdUser = await this.userService.create({
      ...registerDto,
      password: hashedPassword,
    });

    const generateTokens = await this.tokenService.generateAndSaveTokens(
      createdUser._id,
      createdUser.username,
    );

    return generateTokens.accessToken;
  }

  public async login(loginDto: LoginDto): Promise<LoginReturnType> {
    const user = await this.userService.findByUsername(loginDto.username);

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

    const generateTokens = await this.tokenService.generateAndSaveTokens(
      user._id,
      user.username,
    );

    return {
      refreshToken: generateTokens.refreshToken,
      accessToken: generateTokens.accessToken,
    };
  }

  public async logout(userId: string): Promise<UserDocument> {
    return this.userService.updateRefreshToken(userId, { refreshToken: null });
  }
}

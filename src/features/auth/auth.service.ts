import { Injectable, BadRequestException } from '@nestjs/common';
import * as argon2 from 'argon2';

import { UserDocument } from '../user/user.schema';
import { UserService } from '../user/user.service';
import { LoginDto, RegisterDto } from './dto';
import { TokenService } from 'src/helpers/tokens/token.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly tokenService: TokenService,
  ) {}

  public async register(registerDto: RegisterDto): Promise<string> {
    const isUserAlreadyExists = await this.usersService.findByUsername(
      registerDto.username,
    );

    if (isUserAlreadyExists)
      throw new BadRequestException('User already exists');

    const existingUserEmail = await this.usersService.findByEmail(
      registerDto.email,
    );

    if (existingUserEmail)
      throw new BadRequestException('Email is already registered');

    const hashedPassword = await this.tokenService.hashData(
      registerDto.password,
    );

    const createdUser = await this.usersService.create({
      ...registerDto,
      password: hashedPassword,
    });

    const generateTokens = await this.tokenService.generateAndSaveTokens(
      createdUser._id,
      createdUser.username,
    );

    return generateTokens.accessToken;
  }

  public async login(loginDto: LoginDto): Promise<string> {
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

    const generateTokens = await this.tokenService.generateAndSaveTokens(
      user._id,
      user.username,
    );

    return generateTokens.accessToken;
  }

  public async logout(userId: string): Promise<UserDocument> {
    return this.usersService.update(userId, { refreshToken: null });
  }
}

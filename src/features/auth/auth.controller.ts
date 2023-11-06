import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { RegisterDto } from './dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dto';
import { Message, User } from 'src/core/decorators/';

import { AccessTokenGuard, RefreshTokenGuard } from 'src/core/guards/';
import { ApiTags } from '@nestjs/swagger';
import { TokenService } from 'src/features/auth/token.service';

export type LoginReturnType = {
  refreshToken: string;
  accessToken: string;
};

@Controller()
@ApiTags('Auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(
    private authService: AuthService,
    private tokenService: TokenService,
  ) {}

  @Message('Sucessfully registered')
  @Post('register')
  public register(@Body() registerDto: RegisterDto): Promise<string> {
    return this.authService.register(registerDto);
  }

  @Message('Sucessfully logged in')
  @Post('login')
  public login(@Body() loginDto: LoginDto): Promise<LoginReturnType> {
    return this.authService.login(loginDto);
  }

  @UseGuards(AccessTokenGuard)
  @Message('Sucessfully logged out')
  @Get('logout')
  public async logout(@User('sub') sub: string): Promise<void> {
    await this.authService.logout(sub);
  }

  @UseGuards(RefreshTokenGuard)
  @Message('Sucessfully refreshed the token')
  @Get('refresh')
  public refreshTokens(
    @User('sub') userId: string,
    @User('refreshToken') refreshToken: string,
  ): Promise<string> {
    return this.tokenService.refreshToken(userId, refreshToken);
  }
}

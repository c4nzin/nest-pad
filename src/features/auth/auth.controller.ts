import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { RegisterDto } from './dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dto';
import { Message } from 'src/core/decorators/';

import { AccessTokenGuard, RefreshTokenGuard } from 'src/core/guards/';
import { ApiTags } from '@nestjs/swagger';
import { TokenResponse } from 'src/core/interfaces';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Message('Sucessfully registered')
  @Post('register')
  public async register(@Body() createUserDto: RegisterDto): TokenResponse {
    return await this.authService.register(createUserDto);
  }

  @Message('Sucessfully logged in')
  @Post('login')
  public async login(@Body() data: LoginDto): TokenResponse {
    return await this.authService.login(data);
  }

  @UseGuards(AccessTokenGuard)
  @Message('Sucessfully logged out')
  @Get('logout')
  public async logout(@Req() req: Request): Promise<any> {
    await this.authService.logout(req.user['sub']);
  }

  @UseGuards(RefreshTokenGuard)
  @Message('Sucessfully refreshed the token')
  @Get('refresh')
  public refreshTokens(@Req() request: Request): TokenResponse {
    const userId = request.user['sub'];
    const refreshToken = request.user['refreshToken'];
    return this.authService.refreshToken(userId, refreshToken);
  }
}

import { Controller, Post, Body } from '@nestjs/common';
import { RegisterDto } from './dto';
import { AuthService } from './auth.service';
import { UserDocument } from '../user/user.schema';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  public async register(
    @Body() registerDto: RegisterDto,
  ): Promise<UserDocument> {
    return this.authService.register(registerDto);
  }
}

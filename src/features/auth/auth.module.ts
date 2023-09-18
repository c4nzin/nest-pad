import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { TokenService } from './token.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JwtConfigService } from 'src/modules/jwt/jwt-config.service';

@Module({
  imports: [UserModule, JwtModule.register({})],
  controllers: [AuthController],
  providers: [AuthService, TokenService, JwtService, JwtConfigService],
  exports: [AuthService],
})
export class AuthModule {}

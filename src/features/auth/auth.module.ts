import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { AccessTokenStrategy, RefreshTokenStrategy } from './strategies/';

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      verifyOptions: { ignoreExpiration: false },
      global: true,
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, AccessTokenStrategy, RefreshTokenStrategy],
  exports: [AuthService],
})
export class AuthModule {}

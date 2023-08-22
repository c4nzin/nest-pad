import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { JwtModule } from '@nestjs/jwt';
import {
  AccessTokenStrategy,
  RefreshTokenStrategy,
} from 'src/features/auth/strategies';
import { UserModule } from 'src/features/user/user.module';

@Module({
  imports: [
    JwtModule.register({
      verifyOptions: { ignoreExpiration: false },
      global: true,
    }),
    UserModule,
  ],
  controllers: [],
  providers: [TokenService, AccessTokenStrategy, RefreshTokenStrategy],
  exports: [TokenService],
})
export class TokenModule {}

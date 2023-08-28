import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { NoteModule } from './note/note.module';
import { JwtService } from '@nestjs/jwt';
import { AccessTokenStrategy, RefreshTokenStrategy } from './auth/strategies';

@Module({
  imports: [AuthModule, UserModule, NoteModule],
  controllers: [],
  providers: [JwtService, RefreshTokenStrategy, AccessTokenStrategy],
  exports: [],
})
export class FeatureModule {}

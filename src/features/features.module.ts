import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { NoteModule } from './note/note.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { JwtService } from '@nestjs/jwt';
import { AccessTokenStrategy, RefreshTokenStrategy } from './auth/strategies';
import { RouterModule } from '@nestjs/core';
import { routes } from './routes';

@Module({
  imports: [
    AuthModule,
    UserModule,
    NoteModule,
    RouterModule.register(routes),
    CloudinaryModule,
  ],
  controllers: [],
  providers: [JwtService, RefreshTokenStrategy, AccessTokenStrategy],
  exports: [],
})
export class FeatureModule {}

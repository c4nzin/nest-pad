import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { NoteModule } from './note/note.module';

@Module({
  imports: [AuthModule, UserModule, NoteModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class FeatureModule {}

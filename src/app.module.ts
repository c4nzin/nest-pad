import { Module } from '@nestjs/common';
import { EnvalidModule } from 'nestjs-envalid';
import { validators } from './config';
import { DatabaseModule } from './modules/database/database.module';
import { AuthModule } from './features/auth/auth.module';
import { LoggerModule } from './modules/logger/logger.module';
import { UserModule } from './features/user/user.module';
import { NoteModule } from './features/note/note.module';
import { RouterModule } from '@nestjs/core';

@Module({
  imports: [
    EnvalidModule.forRoot({
      isGlobal: true,
      validators,
      useDotenv: true,
    }),
    AuthModule,
    LoggerModule,
    DatabaseModule,
    UserModule,
    NoteModule,
    RouterModule.register([
      { path: '/auth', module: AuthModule },
      { path: '/notes', module: NoteModule },
      {
        path: '/users',
        module: UserModule,
      },
    ]),
  ],
})
export class AppModule {}

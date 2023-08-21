import { Module } from '@nestjs/common';
import { EnvalidModule } from 'nestjs-envalid';
import { Config, ENV, validators } from './config';
import { DatabaseModule } from './modules/database/database.module';
import { AuthModule } from './features/auth/auth.module';
import { LoggerModule } from './modules/logger/logger.module';
import { UserModule } from './features/user/user.module';
import { NoteModule } from './features/note/note.module';
import { RouterModule } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ThrottlerModule.forRootAsync({
      inject: [ENV],
      useFactory: (configService: Config) => ({
        ttl: configService.THROTTLE_TTL,
        limit: configService.THROTTLE_LIMIT,
      }),
    }),

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

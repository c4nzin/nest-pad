import { Module } from '@nestjs/common';
import { EnvalidModule } from 'nestjs-envalid';
import { Config, ENV, validators } from './config';
import { DatabaseModule } from './modules/database/database.module';
import { AuthModule } from './features/auth/auth.module';
import { LoggerModule } from './modules/logger/logger.module';
import { UserModule } from './features/user/user.module';
import { NoteModule } from './features/note/note.module';
import { APP_GUARD, RouterModule } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { FeatureModule } from './features/features.module';

@Module({
  imports: [
    EnvalidModule.forRoot({
      isGlobal: true,
      validators,
      useDotenv: true,
    }),
    LoggerModule,
    DatabaseModule,
    FeatureModule,
    RouterModule.register([
      { path: '/auth', module: AuthModule },
      { path: '/notes', module: NoteModule },
      {
        path: '/users',
        module: UserModule,
      },
    ]),
    ThrottlerModule.forRootAsync({
      inject: [ENV],
      useFactory: (configService: Config) => ({
        ttl: configService.THROTTLE_TTL,
        limit: configService.THROTTLE_LIMIT,
      }),
    }),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}

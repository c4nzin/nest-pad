import { Module } from '@nestjs/common';
import { EnvalidModule } from 'nestjs-envalid';
import { Config, ENV, validators } from './config';
import { DatabaseModule } from './modules/database/database.module';
import { LoggerModule } from './modules/logger/logger.module';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { FeatureModule } from './features/features.module';
import { JwtModule } from './modules/jwt/jwt.module';

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
    JwtModule,
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

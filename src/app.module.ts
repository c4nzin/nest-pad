import { Module } from '@nestjs/common';
import { EnvalidModule } from 'nestjs-envalid';
import { validators } from './config';
import { DatabaseModule } from './modules/database/database.module';
import { LoggerModule } from './modules/logger/logger.module';
import { FeatureModule } from './features/features.module';
import { JwtModule } from './modules/jwt/jwt.module';
import { ThrottlerModule } from './modules/throttler/throttler.module';
import { HealthModule } from './modules/health/health.module';

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
    ThrottlerModule,
    HealthModule,
  ],
})
export class AppModule {}

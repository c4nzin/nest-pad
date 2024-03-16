import { Module } from '@nestjs/common';
import { DatabaseModule } from './modules/database/database.module';
import { LoggerModule } from './modules/logger/logger.module';
import { FeatureModule } from './features/features.module';
import { JwtModule } from './modules/jwt/jwt.module';
import { ThrottlerModule } from './modules/throttler/throttler.module';
import { HealthModule } from './modules/health/health.module';
import { EnvalidModule } from './modules/envalid/envalid.module';

@Module({
  imports: [
    EnvalidModule,
    LoggerModule,
    DatabaseModule,
    FeatureModule,
    JwtModule,
    ThrottlerModule,
    HealthModule,
  ],
})
export class AppModule {}

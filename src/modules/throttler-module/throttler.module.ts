import { Module } from '@nestjs/common';
import {
  ThrottlerGuard,
  ThrottlerModule as ThrottlerModuleHost,
} from '@nestjs/throttler';
import { ThrottlerService } from './throttler.service';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    ThrottlerModuleHost.forRootAsync({
      useClass: ThrottlerService,
    }),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class ThrottlerModule {}

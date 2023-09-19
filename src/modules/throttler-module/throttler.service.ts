import { Injectable, Inject } from '@nestjs/common';
import { ENV, Config } from '../../config';
import {
  ThrottlerModuleOptions,
  ThrottlerOptionsFactory,
} from '@nestjs/throttler';

@Injectable()
export class ThrottlerService implements ThrottlerOptionsFactory {
  constructor(@Inject(ENV) private config: Config) {}
  public createThrottlerOptions(): ThrottlerModuleOptions {
    const limit = this.config.THROTTLE_LIMIT;
    const ttl = this.config.THROTTLE_TTL;

    return { limit, ttl };
  }
}

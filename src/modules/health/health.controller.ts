import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckResult,
  HealthCheckService,
  HealthIndicatorResult,
  HttpHealthIndicator,
} from '@nestjs/terminus';

@Controller()
export class HealthController {
  constructor(
    private healthCheckService: HealthCheckService,
    private httpHealthIndicator: HttpHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  public async getHealth(): Promise<HealthCheckResult> {
    return this.healthCheckService.check([
      async (): Promise<HealthIndicatorResult> =>
        this.httpHealthIndicator.pingCheck('api', 'http://localhost:3000/api'),
    ]);
  }
}

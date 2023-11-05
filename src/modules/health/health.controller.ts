import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
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
  public async getHealth() {
    return this.healthCheckService.check([
      async () =>
        this.httpHealthIndicator.pingCheck('api', 'http://localhost:3000/api'),
    ]);
  }
}

import { Controller, Get } from '@nestjs/common';
import { HealthService } from './health.service';

@Controller()
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get('/healthz')
  getLiveness() {
    return { status: 'alive' };
  }

  @Get('/ready')
  async getReadiness() {
    const dbConnected = await this.healthService.checkReadiness();
    return dbConnected ? { status: 'ready' } : { status: 'not ready' };
  }
}

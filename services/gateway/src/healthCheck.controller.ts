import { Controller, Get } from '@nestjs/common';

@Controller()
export class HealthCheckController {
  constructor() {}

  @Get('/healthz')
  getLiveness() {
    return { status: 'alive' };
  }

  @Get('/ready')
  getReadiness() {
    const dbConnected = true;
    return dbConnected ? { status: 'ready' } : { status: 'not ready' };
  }
}

import { Controller, Post, Body, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { MetricsService } from './metrics.service';

@Controller('/metrics')
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}
  @Get()
  async getMetrics(@Res() res: Response) {
    res.setHeader('Content-Type', this.metricsService.register.contentType);
    res.send(await this.metricsService.register.metrics());
  }
}

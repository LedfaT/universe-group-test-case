import { Controller, Post, Get, Res, Body } from '@nestjs/common';
import { Response } from 'express';
import { NatsService } from './nats/nats.service';
import { Event } from 'types/eventTypes';
import { MetricsService } from './metrics/metrics.service';

@Controller()
export class AppController {
  constructor(
    private readonly natsService: NatsService,
    private readonly metricsService: MetricsService,
  ) {}

  @Post('/events')
  eventHandler(@Body() body: Event[]) {
    body.forEach((event: Event) => {
      if (event.source === 'facebook') {
        this.natsService.publish('event.facebook', event);
      }

      if (event.source === 'tiktok') {
        this.natsService.publish('event.tiktok', event);
      }
    });
  }

  @Get()
  async getMetrics(@Res() res: Response) {
    res.setHeader('Content-Type', this.metricsService.register.contentType);
    res.send(await this.metricsService.register.metrics());
  }
}

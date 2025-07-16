import { Controller, Post, Body } from '@nestjs/common';
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
      this.metricsService.gatewayAccepted.inc();
      try {
        if (event.source === 'facebook') {
          this.natsService.publish('event.facebook', event);
        }

        if (event.source === 'tiktok') {
          this.natsService.publish('event.tiktok', event);
        }
        this.metricsService.gatewayProcessed.inc();
      } catch (e) {
        this.metricsService.gatewayFailed.inc();
      }
    });
  }
}

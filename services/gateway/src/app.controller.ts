import { Controller, Post, Body } from '@nestjs/common';
import { NatsService } from './nats/nats.service';
import { Event } from 'types/eventTypes';
import { MetricsService } from './metrics/metrics.service';
import { WinstonLogger } from './winston/winstom.service';
import { hostname } from 'os';

@Controller()
export class AppController {
  constructor(
    private readonly natsService: NatsService,
    private readonly metricsService: MetricsService,
    private readonly logger: WinstonLogger,
  ) {}

  @Post('/events')
  eventHandler(@Body() body: Event[]) {
    const instanceId = hostname();
    this.logger.log({
      level: 'info',
      message: `Request handled by gateway instance: ${instanceId}`,
    });

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
        this.logger.error({
          level: 'error',
          message: `Failed to publish event: ${event.eventId}`,
          error: e,
        });
      }
    });
  }
}

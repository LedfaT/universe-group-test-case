import { Controller, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { NatsService } from './nats/nats.service';
import { Event } from 'types/eventTypes';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly natsService: NatsService,
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
}

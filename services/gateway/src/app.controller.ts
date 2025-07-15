import { Controller, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { NatsService } from './nats/nats.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly natsService: NatsService,
  ) {}

  @Post('/events')
  eventHandle(@Body() body: any) {
    this.natsService.publish('event.facebook', body);
  }
}

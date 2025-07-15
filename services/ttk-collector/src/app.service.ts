import { Injectable, OnModuleInit } from '@nestjs/common';
import { NatsService } from './nats/nats.service';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(private readonly natsService: NatsService) {}

  async onModuleInit() {
    await this.natsService.connect();

    this.natsService.subscribe('event.tiktok', (data) => {
      console.log('[NATS message, tiktok]', data);
    });
  }
}

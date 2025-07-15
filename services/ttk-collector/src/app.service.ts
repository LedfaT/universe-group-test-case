import { Injectable, OnModuleInit } from '@nestjs/common';
import { NatsService } from './nats/nats.service';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(
    private readonly natsService: NatsService,
    private readonly prisma: PrismaService,
  ) {}

  async onModuleInit() {
    await this.natsService.connect();

    this.natsService.subscribe('event.tiktok', (data) => {
      // this.prisma.event;
    });
  }
}

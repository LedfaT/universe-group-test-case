import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { connect, NatsConnection, StringCodec } from 'nats';

@Injectable()
export class NatsService implements OnModuleInit, OnModuleDestroy {
  private nc: NatsConnection;
  private parser = StringCodec();

  async onModuleInit() {
    this.nc = await connect({ servers: 'nats://nats:4222' });
  }

  async onModuleDestroy() {
    if (this.nc) {
      await this.nc.close();
    }
  }

  publish(subject: string, message: string) {
    if (!this.nc) {
      throw new Error('NATS connection not initialized');
    }
    this.nc.publish(subject, this.parser.encode(message));
  }
}

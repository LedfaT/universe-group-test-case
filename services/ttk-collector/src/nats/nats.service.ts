import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { connect, NatsConnection, StringCodec } from 'nats';

@Injectable()
export class NatsService {
  private nc: NatsConnection;
  private parser = StringCodec();

  async connect() {
    this.nc = await connect({ servers: 'nats://nats:4222' });
    console.log('[NATS] Connected');
  }

  async close() {
    if (this.nc) {
      await this.nc.close();
    }
  }

  subscribe(subject: string, callback: (msg: any) => void) {
    if (!this.nc) {
      throw new Error('NATS connection not initialized');
    }
    const sub = this.nc.subscribe(subject);
    (async () => {
      for await (const msg of sub) {
        callback(this.parser.decode(msg.data));
      }
    })();
  }
}

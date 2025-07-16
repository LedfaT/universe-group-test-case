import { Injectable } from '@nestjs/common';
import {
  connect,
  NatsConnection,
  StringCodec,
  JetStreamClient,
  JetStreamManager,
  AckPolicy,
  DeliverPolicy,
} from 'nats';

@Injectable()
export class NatsService {
  private nc: NatsConnection;
  private js: JetStreamClient;
  private jsm: JetStreamManager;
  private parser = StringCodec();

  async connect() {
    this.nc = await connect({ servers: 'nats://nats:4222' });
    this.js = this.nc.jetstream();
    this.jsm = await this.nc.jetstreamManager();
    console.log('[NATS] Connected');
  }

  async close() {
    if (this.nc) {
      await this.nc.close();
    }
  }

  async subscribe(
    stream: string,
    durable: string,
    subject: string,
    callback: (data: any) => Promise<void> | void,
  ) {
    try {
      await this.jsm.consumers.info(stream, durable);
    } catch (err: any) {
      if (err.message.includes('consumer not found')) {
        await this.jsm.consumers.add(stream, {
          durable_name: durable,
          ack_policy: AckPolicy.Explicit,
          deliver_policy: DeliverPolicy.All,
          filter_subject: subject,
        });
        console.log(`[NATS] Created durable consumer: ${durable}`);
      } else {
        throw err;
      }
    }

    const consumer = await this.js.consumers.get(stream, durable);
    const messages = await consumer.consume();

    (async () => {
      for await (const msg of messages) {
        try {
          const decoded = this.parser.decode(msg.data);
          await callback(decoded);
          msg.ack();
        } catch (err) {
          console.error('[NATS] Error handling message:', err);
        }
      }
    })();
  }
}

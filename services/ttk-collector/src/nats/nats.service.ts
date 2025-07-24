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
import { WinstonLogger } from 'src/winston/winston.service';
import { v4 } from 'uuid';

@Injectable()
export class NatsService {
  private nc: NatsConnection;
  private js: JetStreamClient;
  private jsm: JetStreamManager;
  private parser = StringCodec();

  constructor(private readonly logger: WinstonLogger) {}

  async connect() {
    this.nc = await connect({ servers: 'nats://nats:4222' });
    this.js = this.nc.jetstream();
    this.jsm = await this.nc.jetstreamManager();
    this.logger.log({
      level: 'info',
      message: 'NATS Connected',
    });
  }

  isConnected(): boolean {
    return this.nc?.isClosed() === false;
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
    callback: (data: string, correlation: string) => Promise<void> | void,
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
          deliver_group: 'ttk-collectors-group',
          ack_wait: 15 * 1000 * 1000 * 1000, 
          max_ack_pending: 1000,
        });
        this.logger.log({
          level: 'info',
          message: `Created durable consumer: ${durable}`,
        });
      } else {
        throw err;
      }
    }

    const consumer = await this.js.consumers.get(stream, durable);
    const messages = await consumer.consume();

    (async () => {
      for await (const msg of messages) {
        const correlationId = v4();
        try {
          const decoded = this.parser.decode(msg.data);

          await callback(decoded, correlationId);
          msg.ack();
        } catch (err) {
          this.logger.error({
            level: 'error',
            correlationId: correlationId,
            message: `Error sending event for: ${durable}`,
            err,
          });
        }
      }
    })();
  }
}

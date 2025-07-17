import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import {
  connect,
  NatsConnection,
  StringCodec,
  StorageType,
  JetStreamManager,
  RetentionPolicy,
  JetStreamClient,
  headers,
} from 'nats';
import { WinstonLogger } from 'src/winston/winstom.service';
import { Event } from 'types/eventTypes';

@Injectable()
export class NatsService implements OnModuleInit, OnModuleDestroy {
  private nc: NatsConnection;
  private jsm: JetStreamManager;
  private js: JetStreamClient;
  private parser = StringCodec();

  constructor(private readonly logger: WinstonLogger) {}

  async onModuleInit() {
    this.nc = await connect({ servers: 'nats://nats:4222' });
    this.js = this.nc.jetstream();
    this.jsm = await this.nc.jetstreamManager();

    try {
      await this.jsm.streams.add({
        name: 'EVENTS',
        subjects: ['event.>'],
        retention: RetentionPolicy.Workqueue,
        storage: StorageType.File,
        max_msgs: Number.MAX_SAFE_INTEGER,
        max_bytes: 10737418240,
      });
      this.logger.log({
        level: 'info',
        message: 'JetStream stream EVENTS created successfully',
      });
    } catch (err: any) {
      if (err.message.includes('stream name already in use')) {
        this.logger.log({
          level: 'info',
          message: 'JetStream stream EVENTS already exists, skipping creation',
        });
      } else {
        this.logger.error({
          level: 'error',
          message: `Error creating JetStream stream EVENTS: ${err.message}`,
        });
        throw err;
      }
    }
  }

  async onModuleDestroy() {
    if (this.nc) {
      await this.nc.close();
    }
  }

  publish(subject: string, message: Event) {
    if (!this.nc) {
      throw new Error('NATS connection not initialized');
    }

    this.js.publish(subject, this.parser.encode(JSON.stringify(message)));
  }
}

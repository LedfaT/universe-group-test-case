import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import {
  connect,
  NatsConnection,
  StringCodec,
  StorageType,
  JetStreamManager,
  RetentionPolicy,
} from 'nats';
import { Event } from 'types/eventTypes';

@Injectable()
export class NatsService implements OnModuleInit, OnModuleDestroy {
  private nc: NatsConnection;
  private jsm: JetStreamManager;
  private parser = StringCodec();

  async onModuleInit() {
    this.nc = await connect({ servers: 'nats://nats:4222' });
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
      console.log('JetStream stream EVENTS created');
    } catch (err: any) {
      if (err.message.includes('stream name already in use')) {
        console.log('Stream EVENTS already exists, skipping creation');
      } else {
        console.error('Error creating JetStream stream:', err);
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
    this.nc.publish(subject, this.parser.encode(JSON.stringify(message)));
  }
}

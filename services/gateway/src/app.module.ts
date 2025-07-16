import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NatsService } from './nats/nats.service';
import { MetricsService } from './metrics/metrics.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, NatsService, MetricsService],
})
export class AppModule {}

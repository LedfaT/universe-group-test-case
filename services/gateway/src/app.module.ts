import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NatsService } from './nats/nats.service';
import { MetricsModule } from './metrics/metrics.module';

@Module({
  imports: [MetricsModule],
  controllers: [AppController],
  providers: [AppService, NatsService],
})
export class AppModule {}

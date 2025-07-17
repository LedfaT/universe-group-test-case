import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NatsService } from './nats/nats.service';
import { MetricsModule } from './metrics/metrics.module';
import { HealthModule } from './health/health.module';
import { LoggerModule } from './winston/winston.module';

@Module({
  imports: [MetricsModule, HealthModule, LoggerModule],
  controllers: [AppController],
  providers: [AppService, NatsService],
})
export class AppModule {}

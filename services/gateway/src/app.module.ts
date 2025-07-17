import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NatsService } from './nats/nats.service';
import { MetricsModule } from './metrics/metrics.module';
import { WinstonLogger } from './winston/winstom.service';
import { HealthModule } from './health/health.module';

@Module({
  imports: [MetricsModule, HealthModule],
  controllers: [AppController],
  providers: [AppService, NatsService, WinstonLogger],
})
export class AppModule {}

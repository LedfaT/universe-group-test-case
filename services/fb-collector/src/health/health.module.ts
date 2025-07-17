import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';
import { NatsService } from 'src/nats/nats.service';

@Module({
  imports: [],
  controllers: [HealthController],
  providers: [HealthService, NatsService],
  exports: [HealthService],
})
export class HealthModule {}

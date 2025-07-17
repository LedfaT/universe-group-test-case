// src/health/health.service.ts
import { Injectable } from '@nestjs/common';
import { NatsService } from 'src/nats/nats.service';

@Injectable()
export class HealthService {
  constructor(private readonly natsService: NatsService) {}

  async checkReadiness(): Promise<boolean> {
    try {
      return this.natsService.isConnected();
    } catch {
      return false;
    }
  }
}

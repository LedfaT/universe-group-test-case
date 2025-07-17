// src/health/health.service.ts
import { Injectable } from '@nestjs/common';
import { NatsService } from '../nats/nats.service'; // Подключим твой NATS

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

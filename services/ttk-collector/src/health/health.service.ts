import { Injectable } from '@nestjs/common';
import { NatsService } from '../nats/nats.service';

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

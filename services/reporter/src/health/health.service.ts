// src/health/health.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class HealthService {
  constructor(private readonly prisma: PrismaService) {}

  async checkReadiness(): Promise<boolean> {
    try {
      return this.prisma.$queryRaw`SELECT 1` !== null;
    } catch {
      return false;
    }
  }
}

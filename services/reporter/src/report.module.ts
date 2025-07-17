import { Module } from '@nestjs/common';
import { ReportController } from './report.controller';
import { ReportService } from './report.service';
import { PrismaService } from './prisma/prisma.service';
import { MetricsModule } from './metrics/metrics.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [MetricsModule, HealthModule],
  controllers: [ReportController],
  providers: [ReportService, PrismaService],
})
export class ReportModule {}

import { Injectable, OnModuleInit } from '@nestjs/common';
import { Registry, collectDefaultMetrics, Histogram } from 'prom-client';

@Injectable()
export class MetricsService implements OnModuleInit {
  public readonly register = new Registry();

  public readonly reportLatency = new Histogram({
    name: 'report_latency_seconds',
    help: 'Report latency in seconds by category',
    labelNames: ['category'],
  });

  onModuleInit() {
    collectDefaultMetrics({ register: this.register });
    this.register.registerMetric(this.reportLatency);
  }
}

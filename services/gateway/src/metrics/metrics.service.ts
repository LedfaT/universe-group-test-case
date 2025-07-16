// metrics/metrics.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import {
  Registry,
  collectDefaultMetrics,
  Counter,
  Histogram,
} from 'prom-client';

@Injectable()
export class MetricsService implements OnModuleInit {
  public readonly register = new Registry();

  public readonly gatewayAccepted = new Counter({
    name: 'gateway_events_accepted_total',
    help: 'Total accepted events',
  });

  public readonly gatewayProcessed = new Counter({
    name: 'gateway_events_processed_total',
    help: 'Total processed events',
  });

  public readonly gatewayFailed = new Counter({
    name: 'gateway_events_failed_total',
    help: 'Total failed events',
  });

  public readonly reportLatency = new Histogram({
    name: 'report_latency_seconds',
    help: 'Report latency in seconds by category',
    labelNames: ['category'],
  });

  onModuleInit() {
    collectDefaultMetrics({ register: this.register });

    this.register.registerMetric(this.gatewayAccepted);
    this.register.registerMetric(this.gatewayProcessed);
    this.register.registerMetric(this.gatewayFailed);
    this.register.registerMetric(this.reportLatency);
  }
}

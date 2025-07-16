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

  public readonly collectorEventsReceived = new Counter({
    name: 'collector_events_received_total',
    help: 'Total events received by collector',
    labelNames: ['service'],
  });

  public readonly collectorEventsProcessed = new Counter({
    name: 'collector_events_processed_total',
    help: 'Total events processed by collector',
    labelNames: ['service'],
  });

  public readonly collectorEventsFailed = new Counter({
    name: 'collector_events_failed_total',
    help: 'Total events failed by collector',
    labelNames: ['service'],
  });

  public readonly reportLatency = new Histogram({
    name: 'report_latency_seconds',
    help: 'Report latency in seconds by category',
    labelNames: ['category'],
  });

  onModuleInit() {
    collectDefaultMetrics({ register: this.register });

    this.register.registerMetric(this.collectorEventsReceived);
    this.register.registerMetric(this.collectorEventsProcessed);
    this.register.registerMetric(this.collectorEventsFailed);
    this.register.registerMetric(this.reportLatency);
  }
}

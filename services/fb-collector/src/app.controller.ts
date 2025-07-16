import { Controller } from '@nestjs/common';
import { MetricsService } from './metrics/metrics.service';

@Controller()
export class AppController {
  constructor(private readonly metricsService: MetricsService) {}
}

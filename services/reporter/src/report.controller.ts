// src/reports/reports.controller.ts
import { Controller, Get, Query } from '@nestjs/common';
import { ReportService } from './report.service';

@Controller('reports')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Get('/events')
  async getEvents(
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('source') source?: 'facebook' | 'tiktok',
    @Query('funnelStage') funnelStage?: 'top' | 'bottom',
    @Query('eventType') eventType?: string,
  ) {
    return this.reportService.getFilteredEvents({
      from,
      to,
      source,
      funnelStage,
      eventType,
    });
  }

  @Get('/revenue')
  async getRevenue(
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('source') source?: 'facebook' | 'tiktok',
    @Query('campaignId') campaignId?: string,
  ) {
    return this.reportService.getRevenue({ from, to, source, campaignId });
  }

  @Get('/demographics')
  async getDemographics(
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('source') source?: 'facebook' | 'tiktok',
  ) {
    if (!source) {
      throw new Error('Source parameter is required');
    }

    return this.reportService.getDemographics({ from, to, source });
  }
}

// src/reports/reports.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { MetricsService } from './metrics/metrics.service';
import { windowWhen } from 'rxjs';

@Injectable()
export class ReportService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly metricsService: MetricsService,
  ) {}

  async getFilteredEvents(filters: {
    from?: string;
    to?: string;
    source?: 'facebook' | 'tiktok';
    funnelStage?: 'top' | 'bottom';
    eventType?: string;
  }) {
    const end = this.metricsService.reportLatency.startTimer({
      category: 'filtered-events',
    });

    try {
      const { from, to, source, funnelStage, eventType } = filters;

      const timestamp = {
        ...(from && { gte: new Date(from).toISOString() }),
        ...(to && { lte: new Date(to).toISOString() }),
      };

      const where: string[] = [];

      if (source) {
        where.push(`"source" = '${source}'::"Source"`);
      }

      if (from) {
        where.push(`timestamp >= '${timestamp.gte}'`);
      }

      if (to) {
        where.push(`timestamp <= '${timestamp.lte}'`);
      }

      if (funnelStage) {
        where.push(`"funnelStage" = '${funnelStage}'::"FunnelStage"`);
      }

      if (eventType) {
        where.push(`"eventType" = '${eventType}'`);
      }

      const whereQuery: string = where.length
        ? `WHERE ${where.join(' AND ')}`
        : '';

      return await this.prisma.$queryRawUnsafe(`
      SELECT json_build_object(
        'total', (SELECT COUNT(*) 
            FROM "Event" 
            ${whereQuery}
            ),
        'byEventType', (
          SELECT json_object_agg("eventType", count)
          FROM (
            SELECT "eventTyeventTypepe", COUNT(*) AS count
            FROM "Event"
            ${whereQuery}
            GROUP BY "eventType"
          ) AS event_counts
        ),
        'byFunnelStage', (
          SELECT json_object_agg("funnelStage", count)
          FROM (
            SELECT "funnelStage", COUNT(*) AS count
            FROM "Event"
            ${whereQuery}
            GROUP BY "funnelStage"
          ) AS funnel_counts
        )
      ) AS report;
      `);
    } finally {
      end();
    }
  }

  async getRevenue(filters: {
    from?: string;
    to?: string;
    source?: 'facebook' | 'tiktok';
    campaignId?: string;
  }) {
    const end = this.metricsService.reportLatency.startTimer({
      category: 'revenue',
    });

    if (!filters.source) {
      throw new Error('Source is required');
    }
    try {
      const { from, to, source, campaignId } = filters;

      const timestamp = {
        ...(from && { gte: new Date(from) }),
        ...(to && { lte: new Date(to) }),
      };
      const where: any = {
        source: source,
        eventType: source === 'facebook' ? 'checkout.complete' : 'purchase',
        timestamp,
      };

      if (campaignId && source === 'facebook') {
        where.fbEngagementBottom = { campaignId: campaignId };
      }

      const events = await this.prisma.event.findMany({
        where,
        include: {
          fbEngagementBottom: true,
          ttEngagementBottom: true,
        },
      });

      const totalRevenue = events.reduce((sum, ev) => {
        let amount = 0;
        if (ev.fbEngagementBottom?.purchaseAmount) {
          amount += parseFloat(ev.fbEngagementBottom.purchaseAmount);
        }
        if (ev.ttEngagementBottom?.purchaseAmount) {
          amount += parseFloat(ev.ttEngagementBottom.purchaseAmount);
        }
        return sum + amount;
      }, 0);

      return { totalRevenue };
    } finally {
      end();
    }
  }

  async getDemographics(filters: {
    from?: string;
    to?: string;
    source: 'facebook' | 'tiktok';
  }) {
    const end = this.metricsService.reportLatency.startTimer({
      category: 'demographics',
    });

    try {
      const { from, to, source } = filters;

      const timestamp = {
        ...(from && { gte: new Date(from) }),
        ...(to && { lte: new Date(to) }),
      };

      if (source === 'facebook') {
        const users = await this.prisma.facebookUser.findMany({
          where: {
            events: {
              some: {
                timestamp,
                source: 'facebook',
              },
            },
          },
          select: {
            age: true,
            gender: true,
            country: true,
            city: true,
          },
        });

        const summary = {
          count: users.length,
          averageAge:
            users.reduce((sum, u) => sum + u.age, 0) / (users.length || 1),
          genderCounts: users.reduce(
            (acc, u) => {
              acc[u.gender] = (acc[u.gender] || 0) + 1;
              return acc;
            },
            {} as Record<string, number>,
          ),
          locations: users.reduce(
            (acc, u) => {
              const locKey = `${u.country} - ${u.city}`;
              acc[locKey] = (acc[locKey] || 0) + 1;
              return acc;
            },
            {} as Record<string, number>,
          ),
        };

        return summary;
      } else if (source === 'tiktok') {
        const users = await this.prisma.tiktokUser.findMany({
          where: {
            events: {
              some: {
                timestamp,
                source: 'tiktok',
              },
            },
          },
          select: {
            followers: true,
          },
        });

        const summary = {
          count: users.length,
          averageFollowers:
            users.reduce((sum, u) => sum + u.followers, 0) /
            (users.length || 1),
          totalFollowers: users.reduce((sum, u) => sum + u.followers, 0),
        };

        return summary;
      }

      throw new Error('Unsupported source');
    } finally {
      end();
    }
  }
}

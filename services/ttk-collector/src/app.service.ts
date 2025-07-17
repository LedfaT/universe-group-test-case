import { Injectable, OnModuleInit } from '@nestjs/common';
import { NatsService } from './nats/nats.service';
import { PrismaService } from './prisma/prisma.service';
import { TiktokEvent } from 'types/eventTypes';
import { MetricsService } from './metrics/metrics.service';
@Injectable()
export class AppService implements OnModuleInit {
  constructor(
    private readonly natsService: NatsService,
    private readonly prisma: PrismaService,
    private readonly metricsService: MetricsService,
  ) {}

  async onModuleInit() {
    await this.natsService.connect();

    this.natsService.subscribe(
      'EVENTS',
      'ttk-consumer',
      'event.tiktok',
      async (msg: string) => {
        this.metricsService.collectorEventsReceived.inc({ service: 'ttk' });

        try {
          const eventData: TiktokEvent = JSON.parse(msg);

          const { user, engagement } = eventData.data;

          const createdUser = await this.prisma.tiktokUser.create({
            data: {
              ...user,
            },
          });

          let engagementTopId: string | null = null;
          let engagementBottomId: string | null = null;

          if ('watchTime' in engagement) {
            const createdEngagement =
              await this.prisma.tiktokEngagementTop.create({
                data: {
                  ...engagement,
                },
              });
            engagementTopId = createdEngagement.id;
          }

          if ('actionTime' in engagement) {
            const createdEngagement =
              await this.prisma.tiktokEngagementBottom.create({
                data: {
                  ...engagement,
                },
              });
            engagementBottomId = createdEngagement.id;
          }

          await this.prisma.event.create({
            data: {
              eventId: eventData.eventId,
              timestamp: eventData.timestamp,
              source: 'tiktok',
              funnelStage: eventData.funnelStage,
              eventType: eventData.eventType,

              tiktokUserId: createdUser.id,
              ttEngagementTopId: engagementTopId,
              ttEngagementBottomId: engagementBottomId,
            },
          });
          this.metricsService.collectorEventsProcessed.inc({ service: 'ttk' });
        } catch (e) {
          this.metricsService.collectorEventsFailed.inc({ service: 'ttk' });
        }
      },
    );
  }
}

import { Injectable, OnModuleInit } from '@nestjs/common';
import { NatsService } from './nats/nats.service';
import { PrismaService } from './prisma/prisma.service';
import { Event, TiktokEvent, TiktokUser } from 'types/eventTypes';
@Injectable()
export class AppService implements OnModuleInit {
  constructor(
    private readonly natsService: NatsService,
    private readonly prisma: PrismaService,
  ) {}

  async onModuleInit() {
    await this.natsService.connect();

    this.natsService.subscribe('event.tiktok', async (msg: string) => {
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
        const createdEngagement = await this.prisma.tiktokEngagementTop.create({
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
    });
  }
}

import { Injectable, OnModuleInit } from '@nestjs/common';
import { NatsService } from './nats/nats.service';
import { PrismaService } from './prisma/prisma.service';
import { FacebookEvent } from 'types/eventTypes';
import { MetricsService } from './metrics/metrics.service';
import { WinstonLogger } from './winston/winstom.service';
import { EventSchema } from 'validation/eventSchema';
@Injectable()
export class AppService implements OnModuleInit {
  constructor(
    private readonly natsService: NatsService,
    private readonly prisma: PrismaService,
    private readonly metricsService: MetricsService,
    private readonly logger: WinstonLogger,
  ) {}

  async onModuleInit() {
    await this.natsService.connect();

    this.natsService.subscribe(
      'EVENTS',
      'fb-consumer',
      'event.facebook',
      async (msg: string, correlation: string) => {
        this.metricsService.collectorEventsReceived.inc({ service: 'fb' });

        try {
          const eventData: FacebookEvent = JSON.parse(msg);

          const parsed = EventSchema.safeParse(eventData);
          if (!parsed.success) {
            this.metricsService.collectorEventsFailed.inc({ service: 'fb' });
            this.logger.error({
              level: 'error',
              correlationId: correlation,
              message: `Invalid event data received for Tiktok event: ${eventData.eventId}`,
              error: parsed.error,
            });
            return;
          }

          const { user, engagement } = eventData.data;

          let parsedGender: 'male' | 'female' | 'non_binary';

          switch (user.gender) {
            case 'male':
            case 'female':
              parsedGender = user.gender;
              break;
            case 'non-binary':
              parsedGender = 'non_binary';
              break;
            default:
              throw new Error(`Invalid gender value: ${user.gender}`);
          }

          const createdUser = await this.prisma.facebookUser.create({
            data: {
              userId: user.userId,
              name: user.name,
              age: user.age,
              gender: parsedGender,
              country: user.location.country,
              city: user.location.city,
            },
          });

          let engagementTopId: string | null = null;
          let engagementBottomId: string | null = null;

          if ('actionTime' in engagement) {
            const createdEngagement =
              await this.prisma.facebookEngagementTop.create({
                data: {
                  ...engagement,
                },
              });
            engagementTopId = createdEngagement.id;
          }

          if ('campaignId' in engagement) {
            const createdEngagement =
              await this.prisma.facebookEngagementBottom.create({
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
              source: 'facebook',
              funnelStage: eventData.funnelStage,
              eventType: eventData.eventType,

              facebookUserId: createdUser.id,
              fbEngagementTopId: engagementTopId,
              fbEngagementBottomId: engagementBottomId,
            },
          });

          this.metricsService.collectorEventsProcessed.inc({ service: 'fb' });
          this.logger.log({
            level: 'info',
            correlationId: correlation,
            message: `Processed Facebook event: ${eventData.eventId}`,
          });
        } catch (e) {
          this.metricsService.collectorEventsFailed.inc({ service: 'fb' });
          this.logger.error({
            level: 'error',
            correlationId: correlation,
            message: `Failed to process Facebook event: ${e.message}`,
            error: e,
          });
        }
      },
    );
  }
}

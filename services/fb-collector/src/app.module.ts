import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NatsService } from './nats/nats.service';
import { PrismaService } from './prisma/prisma.service';
import { MetricsModule } from './metrics/metrics.module';
import { WinstonLogger } from './winston/winstom.service';

@Module({
  imports: [MetricsModule],
  controllers: [AppController],
  providers: [AppService, NatsService, PrismaService, WinstonLogger],
})
export class AppModule {}

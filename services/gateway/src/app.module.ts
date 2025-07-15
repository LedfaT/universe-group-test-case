import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NatsService } from './nats/nats.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, NatsService],
})
export class AppModule {}

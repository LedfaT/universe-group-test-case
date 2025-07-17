import { Module, Global } from '@nestjs/common';
import { WinstonLogger } from './winston.service';

@Global()
@Module({
  providers: [WinstonLogger],
  exports: [WinstonLogger],
})
export class LoggerModule {}

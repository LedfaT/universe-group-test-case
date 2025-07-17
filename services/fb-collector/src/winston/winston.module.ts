import { Module, Global } from '@nestjs/common';
import { WinstonLogger } from './winstom.service';

@Global()
@Module({
  providers: [WinstonLogger],
  exports: [WinstonLogger],
})
export class LoggerModule {}

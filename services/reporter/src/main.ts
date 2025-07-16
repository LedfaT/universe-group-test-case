import { NestFactory } from '@nestjs/core';
import { ReportModule } from './report.module';

async function bootstrap() {
  const app = await NestFactory.create(ReportModule);
  await app.listen(process.env.PORT ?? 3003);
  console.log('reporter started at 3003');
}
bootstrap();

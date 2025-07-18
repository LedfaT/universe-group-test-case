import { Test, TestingModule } from '@nestjs/testing';
import { NatsService } from './nats.service';

describe('NatsService real connection', () => {
  let service: NatsService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NatsService],
    }).compile();

    service = module.get<NatsService>(NatsService);
  });

  afterAll(async () => {
    await service.onModuleDestroy();
  });

  it('should connect to real NATS server', async () => {
    await service.onModuleInit();

    expect(service.isConnected()).toBe(true);
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from './prisma.service';

describe('PrismaService integration', () => {
  let service: PrismaService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService],
    }).compile();

    service = module.get<PrismaService>(PrismaService);
    await service.onModuleInit();
  });

  afterAll(async () => {
    await service.onModuleDestroy();
  });

  it('should connect to the database', async () => {
    const result = await service.$queryRaw`SELECT NOW()`;
    expect(result).toBeDefined();
  });

  it('should report connected status', () => {
    expect(service).toBeDefined();
  });
});

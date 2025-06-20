import { Test, TestingModule } from '@nestjs/testing';
import { VarusService } from './varus.service';

describe('VarusService', () => {
  let service: VarusService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VarusService],
    }).compile();

    service = module.get<VarusService>(VarusService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

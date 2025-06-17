import { Test, TestingModule } from '@nestjs/testing';
import { SilpoService } from './silpo.service';

describe('SilpoService', () => {
  let service: SilpoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SilpoService],
    }).compile();

    service = module.get<SilpoService>(SilpoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

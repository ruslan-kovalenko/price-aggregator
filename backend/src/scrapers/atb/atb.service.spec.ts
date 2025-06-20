import { Test, TestingModule } from '@nestjs/testing';
import { AtbService } from './atb.service';

describe('AtbService', () => {
  let service: AtbService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AtbService],
    }).compile();

    service = module.get<AtbService>(AtbService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { MaudauService } from './maudau.service';

describe('MaudauService', () => {
  let service: MaudauService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MaudauService],
    }).compile();

    service = module.get<MaudauService>(MaudauService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { ReplaceService } from './replace.service';

describe('ReplaceService', () => {
  let service: ReplaceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReplaceService],
    }).compile();

    service = module.get<ReplaceService>(ReplaceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

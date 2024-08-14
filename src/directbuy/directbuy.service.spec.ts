import { Test, TestingModule } from '@nestjs/testing';
import { DirectbuyService } from './directbuy.service';

describe('DirectbuyService', () => {
  let service: DirectbuyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DirectbuyService],
    }).compile();

    service = module.get<DirectbuyService>(DirectbuyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

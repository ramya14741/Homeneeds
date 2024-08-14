import { Test, TestingModule } from '@nestjs/testing';
import { ProductFeedbackService } from './product-feedback.service';

describe('ProductFeedbackService', () => {
  let service: ProductFeedbackService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductFeedbackService],
    }).compile();

    service = module.get<ProductFeedbackService>(ProductFeedbackService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

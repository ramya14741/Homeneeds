import { Test, TestingModule } from '@nestjs/testing';
import { ProductFeedbackController } from './product-feedback.controller';

describe('ProductFeedbackController', () => {
  let controller: ProductFeedbackController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductFeedbackController],
    }).compile();

    controller = module.get<ProductFeedbackController>(ProductFeedbackController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { DirectbuyController } from './directbuy.controller';

describe('DirectbuyController', () => {
  let controller: DirectbuyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DirectbuyController],
    }).compile();

    controller = module.get<DirectbuyController>(DirectbuyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

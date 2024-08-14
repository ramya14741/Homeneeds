import { Test, TestingModule } from '@nestjs/testing';
import { ProductProvider } from './product.provider';

describe('ProductProvider', () => {
  let provider: ProductProvider;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductProvider],
    }).compile();

    provider = module.get<ProductProvider>(ProductProvider);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});

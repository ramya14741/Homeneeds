import { Injectable } from '@nestjs/common';
import { Product } from './product.entity';


export const productProvider = [{
    provide:'PRODUCT_REPOSITORY',
    useValue :Product
}
]

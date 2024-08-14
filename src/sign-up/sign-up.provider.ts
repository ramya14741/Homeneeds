import { Injectable } from '@nestjs/common';
import {Customer} from './sign-up.entity'


export const customerProvider = [
    {
        provide : 'CUSTOMER_REPOSITORY',
        useValue: Customer,
    },
]

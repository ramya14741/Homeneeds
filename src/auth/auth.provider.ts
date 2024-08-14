import {rzpClient} from './auth.entity'

export const razorPayProvider =[{
    provide: 'RAZORPAY',
    useValue: rzpClient
}]
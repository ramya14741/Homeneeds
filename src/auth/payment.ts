import { Inject, Injectable } from '@nestjs/common';
import { InjectRazorpay, RazorpayModule } from 'nestjs-razorpay';
const rpay = require('razorpay');
const crypto = require('crypto');
//import * as dotenv from 'dotenv'
import {rzpClient} from'./auth.entity'
const path = require('path')
import * as dotenv from 'dotenv';
dotenv.config();
//dotenv.config();

@Injectable()
export class PaymentService {
  public constructor(
    @Inject('RAZORPAY') private razorpayClient: typeof rzpClient
  ){}

  async createOrder(OrderData): Promise<any> {
    try {
      const order = await this.razorpayClient.orders.create(OrderData);
      return order
    }

    catch (e) {
      return e;
    }
  }

  async createInvoice(invoiceReq): Promise<any> {
    try {
      const order = await this.razorpayClient.invoices.create(invoiceReq);

return order;
    }

    catch (e) {
      return e;
    }
  }

  async getInvoice(invoice):Promise<any>{
    try{
      return await this.razorpayClient.invoices.fetch(invoice);
    }
    catch(e){
      throw e;
    }
  }

  async getAllInvoices():Promise<any>{
    try{
      const invoices = await this.razorpayClient.invoices.all();
      return invoices;
    }
    catch(e){
      throw e;
    }
    }
  

  

  async getRevenue(fromDate,toDate):Promise<any>{
    const fDate = new Date(fromDate);
    const tDate = new Date(toDate);
    const fromTimeStamp = fDate.getTime();
    const toTimeStamp = tDate.getTime();
    const fromUnixTimeStamp = Math.floor(fDate.getTime()/1000);
    const toUnixTimeStamp = Math.floor(tDate.getTime()/1000);
    try{
      //let options:{}
      let options ={
        from:fromUnixTimeStamp,
        to:toUnixTimeStamp
      }
     // const settlement = await this.razorpayClient.settlements.all(options);
     const settlement = await this.razorpayClient.settlements.all(options);
      return settlement;
    }
    catch(e){
      throw e;
    }
  }

 

  async refundPayment(orderId,amount):Promise<any>{
    try{
      const orderedData = await this.razorpayClient.orders.fetchPayments(orderId);
      const refund = await this.razorpayClient.payments.refund(orderedData.items[0].id,{
        "amount":amount*100,
        "speed":"normal",
        "notes":{
        "notes_key_1":''
        }
      })
     // const getRefund = await this.razorpayClient.payments.fetchMultipleRefund(orderedData.items[0].id);
      return refund;
    }
    catch(e){
      throw e;
    }
  }

  async verifyPayment(orderReq):Promise<any>{
    try{
      const fetchInvoice = await this.razorpayClient.invoices.fetch(orderReq.razorpayInvoiceId);
      // const generatedSign = crypto.createHmac('SHA256', process.env.rpaysecretid);
      // generatedSign.update(orderReq.razorpayInvoiceId +'|'+ fetchInvoice.payment_id)
      // const gsign = generatedSign.digest('hex');
      // const reqsign = orderReq.razorpaySignature;
      // console.log(generatedSign.digest('hex'));
      // console.log(orderReq.razorpaySignature);
      // //const gsigndigest = generatedSign.digest('hex').tostring();
      //if(gsign === reqsign){
        const fetchOrder = await this.razorpayClient.orders.fetch(fetchInvoice.order_id);
        if(fetchOrder.status == 'paid'){
        //const fetchPayment = await this.razorpayClient.payments.fetch(orderReq.razorpayPaymentId);
        //const fetchOrderPayment = await this.razorpayClient.orders.fetchPayments(orderReq.razorpayOrderId);

        return fetchOrder;
      }
      else{
        throw  'payment verification failed';
      }
    }
    catch(e)
    {
      throw e;
    }
  }
}
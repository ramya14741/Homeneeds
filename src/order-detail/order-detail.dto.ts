
export class orderDetailDTO{
    productData:ProductDTO[];
    mobileNumber?:String;
    email?:String;
    shippingAddressId:String;
    billingAddressId:String;
}

export class orderDetailPOSDTO{
    productData:ProductDTO[];
    mobileNumber?:String;
    email?:String;
    amount:String;
    amount_paid:String;
    currency:String;
    receipt?:String;
    orderType?:String;
}
export class ProductDTO{
    productId:Number;
    stock_Sku:String;
    Quantity:Number;
    productName?:String;
}
export class postOrderDetailDTO{
    uniqueId?:Number;
    id:String;
    entity:String;
    amount:Number;
    shippingAddressId:Number;
    amount_paid:Number;
    Customer_mobileNumber?:String;
    Customer_email?:String;
    billingAddressId:Number;
    ProductJson:{};
    //ShippingDetails_idShippingDetails?:Number;
    //deliveryType?:String;
    //deliveryStatus?:String;
    orderTrackingId: String;
    amount_due:Number;
    currency:String;
    receipt:String;
    offer_id:String;
    status:String;
    attempts:Number;
    invoiceId:String;
    invoiceUrl:String;
    notes?:{};
    orderType?:String;
}

export class verifyOrderDTO{
    orderCreationId:String;
    razorpayPayamentId:String;
    razorpayOrderId:String;
    razorpaySignature:String;
}

export class OrderUpateDTO{
    amount_paid:Number;
    amount_due:Number;
    status:String;
    attempts:Number;
}


export class OrderDetailDeliveryDTO{
    id:String;
    productJSON:ProductDTO[];
}
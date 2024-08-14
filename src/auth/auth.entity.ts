const Razorpay = require("razorpay");
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env')})

export const rzpClient = new Razorpay({
    key_id:"rzp_test_Gm6gmfJJDUAZbR",
    key_secret:"5EhnkyPWN5cpIBY1tlwLrDjM",
});
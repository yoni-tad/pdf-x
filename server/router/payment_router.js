const express = require("express");
const {
  InitPayment,
  PaymentCallback,
  PaymentReturn,
} = require("../controller/payment.controller");
const paymentRoute = express.Router();

paymentRoute.post("/init-payment", InitPayment);
paymentRoute.get("/payment-callback", PaymentCallback);
paymentRoute.get("/payment-return", PaymentReturn);

module.exports = paymentRoute;

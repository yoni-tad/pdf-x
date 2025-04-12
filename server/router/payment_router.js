const express = require("express");
const {
  InitPayment,
  PaymentCallback,
} = require("../controller/payment.controller");
const paymentRoute = express.Router();

paymentRoute.post("/init-payment", InitPayment);
paymentRoute.get("/payment-callback", PaymentCallback);

module.exports = paymentRoute;

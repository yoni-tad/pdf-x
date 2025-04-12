const axios = require("axios");
const paymentModel = require("../model/payment.model");
const mongoose = require("mongoose");
const userModel = require("../model/user.model");
require("dotenv").config();

exports.InitPayment = async (req, res) => {
  console.log(req.body);
  const telegramId = req.body.telegramId;
  const transactionId = new mongoose.Types.ObjectId().toString();
  try {
    if (!telegramId)
      return res.status(404).json({ message: "Telegram id required" });

    const user = await userModel.findOne({ telegramId });
    if (!user) return res.status(404).json({ message: "User not found" });
    const userId = user._id;

    const response = await axios.post(
      "https://api.chapa.co/v1/transaction/initialize",
      {
        amount: 1,
        currency: "ETB",
        email: "yoni@gmail.com",
        tx_ref: transactionId,
        callback_url:
          "https://e133-196-189-145-9.ngrok-free.app/api/payment-callback",
        return_url:
          "https://e133-196-189-145-9.ngrok-free.app/api/payment-return",
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
        },
      }
    );

    const newPayment = paymentModel.create({
      transactionId,
      amount: 1,
      userId,
    });

    res.status(201).json({ paymentUrl: response.data.data.checkout_url });
  } catch (e) {
    console.log(e.message);
    res.status(500).json({ message: "Server error, please try again!" });
  }
};

exports.PaymentCallback = async (req, res) => {
  const { trx_ref, status } = req.body;

  try {
    const updatePayment = await paymentModel.findOneAndUpdate(
      { transactionId: trx_ref },
      { status: status }
    );

    if (!updatePayment)
      return res.status(404).json({ message: "Payment not found" });
    const userId = updatePayment.userId;

    const updateUser = await userModel.findOneAndUpdate(
      { _id: userId },
      { type: "premium" }
    );

    res.status(200).json({ message: "Payment updated successfully" });
  } catch (e) {
    console.log(e.message);
    res.status(500).json({ message: "Server error, please try again!" });
  }
};

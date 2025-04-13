const axios = require("axios");
const paymentModel = require("../model/payment.model");
const mongoose = require("mongoose");
const userModel = require("../model/user.model");
require("dotenv").config();
const endpoint = process.env.SERVER_URL

exports.InitPayment = async (req, res) => {
  const telegramId = req.body.telegramId;
  const transactionId = new mongoose.Types.ObjectId().toString();
  try {
    if (!telegramId)
      return res.status(404).json({ message: "Telegram id required" });

    const user = await userModel.findOne({ telegramId });
    if (!user) return res.status(404).json({ message: "User not found" });
    const userId = user._id;

    if (user.type == "premium")
      return res
        .status(401)
        .json({ message: "Already purchased the premium plan" });

    const response = await axios.post(
      "https://api.chapa.co/v1/transaction/initialize",
      {
        amount: 1,
        currency: "ETB",
        email: "yoni@gmail.com",
        tx_ref: transactionId,
        callback_url:
          `${endpoint}/api/payment-callback`,
        return_url: `${endpoint}/api/payment-return?telegramId=${telegramId}`,
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

exports.PaymentReturn = async (req, res) => {
  const token = process.env.BOT_TOKEN;
  const telegramId = req.query.telegramId;

  if (!telegramId)
    return res.status(404).json({ message: "Telegram id required" });

  const url = `https://api.telegram.org/bot${token}/sendMessage`;
  const message = `
🎉 *Congratulations, You're Now a Premium User!*

You’ve just unlocked all the cool features with *1 Birr* 🙌  
Here’s what you can now enjoy:  
- 📤 Upload *up to 5MB* files  
- 📄 Send *up to 3 PDFs*  

Time to upload and chat away like a pro! 😎🚀
`;
  const params = { chat_id: telegramId, text: message, parse_mode: "Markdown" };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });

    const data = await response.json();
    if (!data.ok) throw new Error(data.description);

    res.send(`
      <html>
        <head>
          <title>Payment Complete</title>
        </head>
        <body style="text-align:center; font-family:sans-serif; margin-top: 50px;">
          <h2>✅ Payment Successful!</h2>
          <p>Thanks for upgrading. You can now close this window.</p>
          <script>
            setTimeout(() => {
              window.close();
            }, 2000); 
          </script>
        </body>
      </html>
    `);
  } catch (e) {
    console.error("Failed to send message:", error);
  }
};

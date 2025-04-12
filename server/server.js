const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const userRouter = require("./router/user_router");
const fileRoute = require("./router/file_router");
const paymentRoute = require("./router/payment_router");
require("dotenv").config();

app.use(cors());
app.use(express.json());
app.use("/api", userRouter);
app.use("/api", fileRoute);
app.use("/api", paymentRoute);

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB);
    console.log("🔥 Mongo db successfully connected");

    app.listen(3000, () =>
      console.log("✅ Sever start listening at http://localhost:3000")
    );
  } catch (e) {
    console.error("❌ Server error:", e.message);
  }
})();

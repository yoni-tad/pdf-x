const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    telegramId: {
      type: String,
      require: true,
      unique: true,
    },
    username: {
      type: String,
    },
    pdfId: { type: String },
    type: {
      type: String,
      enum: ["free", "premium"],
      default: "free",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("user", UserSchema);

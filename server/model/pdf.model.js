const mongoose = require("mongoose");

const PdfSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    fileName: { type: String, require: true },
    sourceUrl: { type: String, require: true },
  },
  { timestamps: true }
);


module.exports = mongoose.model('pdf', PdfSchema);
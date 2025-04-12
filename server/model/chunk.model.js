const mongoose = require("mongoose");

const chunkSchema = new mongoose.Schema({
  pdfId: { type: mongoose.Schema.Types.ObjectId, ref: "pdf" },
  chunkText: { type: String, require: true },
});

module.exports = mongoose.model("chunk", chunkSchema);

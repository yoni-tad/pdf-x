const { GoogleGenerativeAI } = require("@google/generative-ai");
const { parsePdfFromURL } = require("../utils/pdfParse");
const { ChunkText, FindRelevantChunks } = require("../utils/chunkText");
const pdfModel = require("../model/pdf.model");
const chunkModel = require("../model/chunk.model");
const userModel = require("../model/user.model");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_ApI_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

exports.UploadPdf = async (req, res) => {
  const { telegramId, fileName, fileSize, fileUrl } = req.body;

  try {
    if (!fileName || !fileUrl || !telegramId)
      return res
        .status(404)
        .json({ message: "Please fill all required fields!" });

    const user = await userModel.findOne({ telegramId });
    if (!user) return res.status(404).json({ message: "User not found" });
    const userId = user._id;
    const fileSizeLimit = user.type == "premium" ? 5 * 1048576 : 1 * 1048576;

    if (fileSize > fileSizeLimit) {
      return res
        .status(400)
        .json({
          message:
            "⚠️ max file size limit: " +
            fileSizeLimit / 1048576 +
            "MB" +
            " for " +
            user.type +
            " user.",
        });
    }

    const savePdf = await pdfModel.create({
      userId,
      fileName,
      sourceUrl: fileUrl,
    });

    if (!savePdf) return res.status(500).json({ message: "Failed save pdf!" });
    const savePdfToUser = await userModel.findByIdAndUpdate(userId, {
      pdfId: savePdf._id,
    });
    const pdfText = await parsePdfFromURL(fileUrl);
    if (!pdfText) return res.status(500).json({ message: "Failed parse pdf!" });
    const savedChunks = ChunkText(pdfText, 500, 50);

    for (const chunkText of savedChunks) {
      await chunkModel.create({
        pdfId: savePdf._id,
        chunkText,
      });
    }

    res.status(200).json({ message: "PDF and chunks saved" });
  } catch (e) {
    console.log(e.message);
    res.status(500).json({ message: "Server error, please try again!" });
  }
};

exports.Ask = async (req, res) => {
  const { telegramId, question } = req.body;

  try {
    if ((!telegramId, !question))
      return res
        .status(404)
        .json({ message: "Please fill all required fields!" });

    const user = await userModel.findOne({ telegramId });
    if (!user) return res.status(404).json({ message: "User not found" });
    const pdfId = user.pdfId;
    const maxToken = user.type == "premium" ? 2048 : 512;

    if (!pdfId)
      return res.status(500).json({ message: "To ask pdf required!" });

    const chunks = await chunkModel.find({ pdfId });
    let savedChunks = [];
    for (const chunk of chunks) {
      savedChunks.push(chunk.chunkText);
    }

    if (!savedChunks.length)
      return res.status(404).json({ message: "PDF not found" });

    const relevantChunks = FindRelevantChunks(question, savedChunks, 3);
    const prompt = `You are an assistant answering based on a PDF document.

    Context: ${relevantChunks.join("\n\n")}

    Question: ${question}

    `;
    // ask AI
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        maxOutputTokens: maxToken,
        temperature: 0.7,
        topP: 1,
      },
    });
    const response = result.response.text();
    res.status(200).json({ message: response });
  } catch (e) {
    console.log(e.message);
    res.status(500).json({ message: "Server error" });
  }
};

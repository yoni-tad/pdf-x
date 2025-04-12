const axios = require("axios");
const PdfParse = require("pdf-parse");

exports.parsePdfFromURL = async function parsePdfFromURL(url) {
  const response = await axios.get(url, {
    responseType: "arraybuffer",
  });

  const dataBuffer = Buffer.from(response.data);
  const pdfData = await PdfParse(dataBuffer);

  return pdfData.text;
};

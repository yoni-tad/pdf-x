const userModel = require("../model/user.model");

exports.SignUp = async (req, res) => {
  const { telegramId, username } = req.body;

  try {
    if (!telegramId)
      return res.status(404).json({ message: "Telegram id required" });

    const checkTelegramID = await userModel.findOne({ telegramId: telegramId });
    if (checkTelegramID) {
      return res
        .status(400)
        .json({ message: "Already telegram id registered" });
    }

    const user = await userModel.create({
      telegramId,
      username,
      pdfId: "",
    });

    res.status(201).json({ message: "Registration successfully" });
  } catch (e) {
    console.log(e.message);
    res.status(500).json({ message: "Server error" });
  }
};

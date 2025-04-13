# 📄 PDF X — Chat with Your PDFs in Telegram

**PDF X** is a lightweight Telegram bot that lets users upload PDF files and chat with them using AI. It's a personal project built just for fun (and usefulness!) — with a sprinkle of weird and premium ideas. 💬✨

---

## 🚀 Features

- 🧠 AI-powered chat with PDF files
- 📥 Upload and process PDF documents
- ⚡ Telegram Bot Integration
- 🔐 Premium Plan (1 Birr) with:
  - Increased file upload limit (from 1MB to 5MB)
  - Up to 3 PDFs instead of 1

---

## 🛠 Tech Stack

- **Node.js** + **Express** – REST API
- **MongoDB** + **Mongoose** – Database
- **PHP** – Handles Telegram bot webhook
- **pdf-parse** – Extracts text from PDFs
- **Custom Chunking** – Splits and stores text for retrieval
- **Gemini AI** – For AI answers from chunks

---
## 🗄 Folder Structure

```
└── 📁pdf-x
    └── 📁bot
        └── ai.php
        └── file-upload.php
        └── index.php
    └── 📁server
        └── .env
        └── .gitignore
        └── 📁controller
            └── file.controller.js
            └── payment.controller.js
            └── user.controller.js
        └── 📁model
            └── chunk.model.js
            └── payment.model.js
            └── pdf.model.js
            └── user.model.js
        └── package-lock.json
        └── package.json
        └── 📁router
            └── file_router.js
            └── payment_router.js
            └── user_router.js
        └── server.js
        └── 📁utils
            └── chunkText.js
            └── pdfParse.js
    └── .gitignore
```

---

## 💡 Project Flow

1. User uploads PDF via Telegram bot.
2. Bot sends file to backend API.
3. PDF is parsed and chunked.
4. Chunks are saved to MongoDB and linked to the user.
5. User chats with the bot — questions are answered by matching chunk + AI.
6. Premium users get extra limits and features.

---

## 💸 Premium Plan

This is just a tiny plan (1 birr) to test fun features and support the project.

| Feature              | Free Plan | Premium Plan |
|----------------------|-----------|---------------|
| Max file size        | 1 MB      | 5 MB         |
| PDF upload limit     | 1 PDF     | 3 PDFs        |

---

## ⚠️ Note

- Project hosted on free services — performance may vary.
- AI responses are limited in size due to Telegram restrictions.
- Markdown formatting is supported (up to 4096 characters per message).

---

## 📬 Contact

> Created by [yonitad2404@gmail.com](mailto:yonitad2404@gmail.com)  
Feel free to message for questions or ideas.

---

## 🧪 For Testing

You can try the bot using Telegram at:  
[👉 t.me/pdf_x_bot](https://t.me/pdf_x_bot)


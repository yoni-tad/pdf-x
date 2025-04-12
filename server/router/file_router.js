const express = require('express');
const { Ask, UploadPdf } = require('../controller/file.controller');
const fileRoute = express.Router();

fileRoute.post('/upload-pdf', UploadPdf)
fileRoute.post('/ask', Ask)

module.exports = fileRoute;
const express = require('express');
const { SignUp } = require('../controller/user.controller');
const userRouter = express.Router();

userRouter.post('/signup', SignUp);

module.exports = userRouter;
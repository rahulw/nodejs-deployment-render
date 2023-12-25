const express = require('express');
const userRouter = new express.Router();
const signupController = require('./sign-controller');

userRouter.post("/createuser", signupController.addUser);

module.exports = userRouter;
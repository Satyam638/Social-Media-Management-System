const express = require('express');
const route = express.Router();
const authController = require('../controller/auth.controllers');
const validation = require('../middleware/validation.middleware');
const upload = require('../config/upload');
route.post('/auth/register',
    upload.single('profileImage'),
    validation.isValidField,
    authController.registerUser);
route.post('/auth/verify-otp', authController.verifyOtp);
route.post('/auth/login', authController.loginUser);

module.exports = route;
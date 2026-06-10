const express = require('express');
const route = express.Router();
const authController = require('../controller/auth.controllers');
const validation = require('../middleware/validation.middleware');
const upload = require('../config/upload');
const {sanitizeAll} = require('../middleware/sanitize.middleware');
const inputValidation = require('../middleware/inputValidation.middleware')
const rateLimiter = require('../middleware/rateLimiter.middleware');
/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User authentication APIs
 */

// run for all routes
route.use(sanitizeAll);

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *
 *     requestBody:
 *       required: true
 *
 *       content:
 *         multipart/form-data:
 *
 *           schema:
 *             type: object
 *
 *             required:
 *               - fullName
 *               - email
 *               - password
 *
 *             properties:
 *
 *               fullName:
 *                 type: string
 *                 example: Satyam Gupta
 *
 *               email:
 *                 type: string
 *                 example: satyam@gmail.com
 *
 *               password:
 *                 type: string
 *                 example: satyam@123
 *
 *               profileImage:
 *                 type: string
 *                 format: binary
 *
 *     responses:
 *       201:
 *         description: User registered successfully
 *
 *       400:
 *         description: Validation error
 */
route.post(
    '/auth/register',
    rateLimiter.regLimiter,
    upload.single('profilePic'),
    inputValidation.validateRegister,
    authController.registerUser
);


/**
 * @swagger
 * /api/auth/verify-otp:
 *   post:
 *     summary: Verify OTP for user account
 *     tags: [Authentication]
 *
 *     requestBody:
 *       required: true
 *
 *       content:
 *         application/json:
 *
 *           schema:
 *             type: object
 *
 *             required:
 *               - email
 *               - otp
 *
 *             properties:
 *
 *               email:
 *                 type: string
 *                 example: satyam@gmail.com
 *
 *               otp:
 *                 type: string
 *                 example: 123456
 *
 *     responses:
 *       200:
 *         description: OTP verified successfully
 *
 *       400:
 *         description: Invalid OTP
 */
route.post(
    '/auth/verify-otp',
    inputValidation.validateOTP,
    authController.verifyOtp
);


/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Authentication]
 *
 *     requestBody:
 *       required: true
 *
 *       content:
 *         application/json:
 *
 *           schema:
 *             type: object
 *
 *             required:
 *               - email
 *               - password
 *
 *             properties:
 *
 *               email:
 *                 type: string
 *                 example: satyam@gmail.com
 *
 *               password:
 *                 type: string
 *                 example: satyam@123
 *
 *     responses:
 *       200:
 *         description: Login successful
 *
 *       401:
 *         description: Invalid credentials
 */
route.post(
    '/auth/login',
    rateLimiter.authLimiter,
    inputValidation.validateLogin,
    authController.loginUser
);
route.post('/auth/forgot-password',
    rateLimiter.authLimiter,
    inputValidation.validateForgotPassword,
    authController.forgotPassword);
route.get('/auth/me', validation.isValidUser, authController.getMe);
module.exports = route;
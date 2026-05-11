const express = require('express');
const route = express.Router();
const postController = require('../controller/post.controllers');
const isValidUser = require('../middleware/validation.middleware');
const upload = require('../config/upload');

/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: Manage scheduled social media posts
 */

/**
 * @swagger
 * /api/posts:
 *   post:
 *     summary: Create a new post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *               - platform
 *               - scheduledAt
 *             properties:
 *               content:
 *                 type: string
 *               platform:
 *                 type: string
 *                 enum: [instagram, twitter, linkedin]
 *               scheduledAt:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Post created successfully
 *       400:
 *         description: Validation error
 */

route.post('/create-post',
    isValidUser.isValidUser, // tocheck is user logged in or not
    upload.single('image'),
    postController.createPost
);


module.exports = route;
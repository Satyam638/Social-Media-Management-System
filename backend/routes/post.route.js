const express = require('express');
const route = express.Router();
const postController = require('../controller/post.controllers');
const isValidUser = require('../middleware/validation.middleware');
const upload = require('../config/upload');

/**
 * @swagger
 * /api/posts/create-post:
 *   post:
 *     summary: Create and publish social media post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
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
 *             properties:
 *
 *               image:
 *                 type: string
 *                 format: binary
 *
 *               platforms:
 *                 type: string
 *                 example: >
 *                   {
 *                     "linkedin": {
 *                       "enabled": true,
 *                       "content": "Hello LinkedIn 🚀"
 *                     },
 *                     "facebook": {
 *                       "enabled": true,
 *                       "content": "Hello Facebook 🚀"
 *                     }
 *                   }
 *
 *     responses:
 *       201:
 *         description: Post published successfully
 *
 *       400:
 *         description: Validation error
 *
 *       401:
 *         description: Unauthorized
 */
route.post('/create-post',
    isValidUser.isValidUser, // tocheck is user logged in or not
    upload.single('image'),
    postController.createPost
);
/**
 * @swagger
 * /api/posts/schedule-post:
 *   post:
 *     summary: Schedule social media post
 *     tags: [Posts]
 *
 *     security:
 *       - bearerAuth: []
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
 *             properties:
 *
 *               scheduledAt:
 *                 type: string
 *                 format: date-time
 *
 *               platforms:
 *                 type: object
 *
 *     responses:
 *       201:
 *         description: Post scheduled successfully
 */
route.post('/schedule-post',isValidUser.isValidUser,postController.schedulePost);
/**
 * @swagger
 * /api/posts/cancel/schedule/{id}:
 *   delete:
 *     summary: Cancel a scheduled post
 *     tags: [Posts]
 *
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Scheduled post ID
 *
 *     responses:
 *       200:
 *         description: Scheduled post cancelled successfully
 *
 *       404:
 *         description: Post not found
 *
 *       401:
 *         description: Unauthorized
 */
route.delete(
    '/cancel/schedule/:id',
    isValidUser.isValidUser,
    postController.cancelScheduledPost
);

/**
 * @swagger
 * /api/posts/my-post:
 *   get:
 *     summary: Get all posts created by logged-in user
 *     tags: [Posts]
 *
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *       200:
 *         description: User posts fetched successfully
 *
 *       401:
 *         description: Unauthorized
 */
route.get(
    '/my-post',
    isValidUser.isValidUser,
    postController.getUserPosts
);


/**
 * @swagger
 * /api/posts/scheduled-post:
 *   get:
 *     summary: Get all scheduled draft posts
 *     tags: [Posts]
 *
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *       200:
 *         description: Scheduled posts fetched successfully
 *
 *       401:
 *         description: Unauthorized
 */
route.get(
    '/scheduled-post',
    isValidUser.isValidUser,
    postController.getScheduledPosts
);

/**
 * @swagger
 * /api/posts/schedule/{status}:
 *   get:
 *     summary: Get posts by status
 *     tags: [Posts]
 *
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: status
 *         required: true
 *         schema:
 *           type: string
 *           enum:
 *             - published
 *             - failed
 *             - partial
 *             - draft
 *         description: Post status
 *
 *     responses:
 *       200:
 *         description: Posts fetched successfully
 *
 *       400:
 *         description: Invalid status
 *
 *       401:
 *         description: Unauthorized
 */
route.get(
    '/schedule/:status',
    isValidUser.isValidUser,
    postController.getPostsByStatus
);
module.exports = route;
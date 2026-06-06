const express = require('express');
const router = express.Router();
const linkedInController = require('../linkedin/linkedinController');
const authenticate = require('../../middleware/validation.middleware');
// const authenticate = require('../../middleware/validation.middleware')
// ROUTE 1 - Redirect user from SMMS software to LinkedIn login
/**
 * @swagger
 * tags:
 *   name: LinkedIn
 *   description: LinkedIn OAuth and posting APIs
 */


/**
 * @swagger
 * /api/linkedin/auth:
 *   get:
 *     summary: Redirect user to LinkedIn OAuth login
 *     tags: [LinkedIn]
 *
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *       302:
 *         description: Redirect to LinkedIn login page
 *
 *       401:
 *         description: Unauthorized
 */
router.get(
    '/auth',
    authenticate.isValidUser,
    linkedInController.linkedinLogin
);


/**
 * @swagger
 * /api/linkedin/callback:
 *   get:
 *     summary: LinkedIn OAuth callback endpoint
 *     tags: [LinkedIn]
 *
 *     parameters:
 *       - in: query
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *         description: Authorization code from LinkedIn
 *
 *       - in: query
 *         name: state
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID sent during OAuth
 *
 *     responses:
 *       302:
 *         description: Redirect back to frontend dashboard
 *
 *       500:
 *         description: LinkedIn OAuth failed
 */
router.get(
    '/callback',
    linkedInController.LinkedInRedirectWithCode
);


/**
 * @swagger
 * /api/linkedin/post:
 *   post:
 *     summary: Publish a post directly to LinkedIn
 *     tags: [LinkedIn]
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
 *               content:
 *                 type: string
 *                 example: Hello LinkedIn 🚀
 *
 *     responses:
 *       200:
 *         description: Post published successfully
 *
 *       400:
 *         description: Validation error
 *
 *       401:
 *         description: Unauthorized
 */
router.post(
    '/post',
    linkedInController.postLinkedIn
);


/**
 * @swagger
 * /api/linkedin/status:
 *   get:
 *     summary: Check LinkedIn connection status
 *     tags: [LinkedIn]
 *
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *       200:
 *         description: LinkedIn connection status fetched successfully
 *
 *       401:
 *         description: Unauthorized
 */
router.get(
    '/status',
    authenticate.isValidUser,
    linkedInController.checkPostStatus
);

router.patch('/disconnect',authenticate.isValidUser,linkedInController.disconnectLinkedin)

module.exports = router;
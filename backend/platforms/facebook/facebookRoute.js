const fbController = require('../facebook/facebookController');
const authMiddleware = require('../../middleware/validation.middleware');
const express = require('express');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Facebook
 *   description: Facebook OAuth and page posting APIs
 */


/**
 * @swagger
 * /api/facebook/auth:
 *   get:
 *     summary: Redirect user to Facebook OAuth login
 *     tags: [Facebook]
 *
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *       302:
 *         description: Redirect to Facebook login page
 *
 *       401:
 *         description: Unauthorized
 */
router.get(
    '/auth',
    authMiddleware.isValidUser,
    fbController.connectFacebook
);

/**
 * @swagger
 * /api/facebook/callback:
 *   get:
 *     summary: Facebook OAuth callback endpoint
 *     tags: [Facebook]
 *
 *     parameters:
 *       - in: query
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *         description: Authorization code from Facebook
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
 *         description: Facebook OAuth failed
 */
router.get(
    '/callback',
    fbController.facebookCallback
);


/**
 * @swagger
 * /api/facebook/disconnect:
 *   get:
 *     summary: Disconnect Facebook account
 *     tags: [Facebook]
 *
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *       200:
 *         description: Facebook disconnected successfully
 *
 *       401:
 *         description: Unauthorized
 */
router.get(
    '/disconnect',
    authMiddleware.isValidUser,
    fbController.disconnectFacebook
);


/**
 * @swagger
 * /api/facebook/status:
 *   get:
 *     summary: Check Facebook connection status
 *     tags: [Facebook]
 *
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *       200:
 *         description: Facebook connection status fetched successfully
 *
 *       401:
 *         description: Unauthorized
 */
router.get(
    '/status',
    authMiddleware.isValidUser,
    fbController.facebookStatus
);


module.exports = router;
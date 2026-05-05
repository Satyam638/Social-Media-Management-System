const express = require('express');
const router = express.Router();
const linkedInController = require('../linkedin/linkedinController');
const authenticate = require('../../middleware/validation.middleware');
// ROUTE 1 - Redirect user to LinkedIn login
router.get('/auth',authenticate.isValidUser,linkedInController.linkedinLogin);

// ROUTE 2 - LinkedIn redirects back here with a code
router.get('/callback',linkedInController.LinkedInRedirectWithCode);

// ROUTE 3 - Post to LinkedIn
router.post('/post',linkedInController.postLinkedIn);

// ROUTE 4 - Check if connected
router.get('/status',linkedInController.checkPostStatus);

module.exports = router;
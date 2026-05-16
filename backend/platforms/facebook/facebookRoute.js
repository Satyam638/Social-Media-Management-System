const fbController = require('../facebook/facebookController');
const authMiddleware = require('../../middleware/validation.middleware');
const express = require('express');
const router = express.Router();

router.get('/auth', authMiddleware.isValidUser, fbController.connectFacebook);
router.get('/callback', fbController.facebookCallback);
router.get('/disconnect', authMiddleware.isValidUser, fbController.disconnectFacebook);
router.get('/status', authMiddleware.isValidUser, fbController.facebookStatus);


module.exports = router;
const express  = require('express');
const router   = express.Router();
const upload   = require('../config/upload');
// ↑ import your multer config

const { uploadImage, uploadProfilePicture } = require('../controller/upload.controllers');
const { isValidUser } = require('../middleware/auth.middleware');

// upload post image
router.post('/image',
    isValidUser,
    upload.single('image'),
    uploadImage
);

// upload profile picture
router.post('/profile-picture',
    isValidUser,
    upload.single('image'),
    uploadProfilePicture
);

module.exports = router;
// ↑ NOT { router } — just router
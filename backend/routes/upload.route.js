const express  = require('express');
const router   = express.Router();
const upload   = require('../config/upload');
// ↑ import your multer config

const uploadController = require('../controller/upload.controllers');
const auth = require('../middleware/validation.middleware');


console.log('isValidUser:', typeof auth.isValidUser);
console.log('upload:', typeof upload);
console.log('uploadImage:', typeof uploadController.uploadImage);

// upload post image
router.post('/image',
    auth.isValidUser,
    upload.single('image'),
    uploadController.uploadImage
);

// upload profile picture
router.post('/profile-picture',
    auth.isValidUser,
    upload.single('image'),
    uploadController.uploadProfilePicture
);

module.exports = router;
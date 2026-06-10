// controller/upload.controllers.js
const imagekit   = require('../config/imagekit');
const userModel  = require('../model/user.model');

// ── Upload post image ──────────────────────────────────────
const uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                error: 'No image file provided'
            });
        }

        const result = await imagekit.upload({
            file:     req.file.buffer,
            fileName: `post_${Date.now()}_${req.file.originalname}`,
            folder:   `/smms/posts/${req.user.id}`,
        });

        return res.status(200).json({
            success: true,
            url:     result.url,
            fileId:  result.fileId
        });

    } catch (err) {
        console.error('Image upload error:', err.message);
        return res.status(500).json({
            success: false,
            error: 'Image upload failed'
        });
    }
};

// ── Upload profile picture ─────────────────────────────────
const uploadProfilePicture = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                error: 'No image file provided'
            });
        }

        const result = await imagekit.upload({
            file:     req.file.buffer,
            fileName: `profile_${req.user.id}_${Date.now()}`,
            folder:   `/smms/profiles`,
        });

        // save to MongoDB
        await userModel.findByIdAndUpdate(req.user.id, {
            profilePic: result.url
        });

        return res.status(200).json({
            success: true,
            url:     result.url,
            message: 'Profile picture updated ✅'
        });

    } catch (err) {
        console.error('Profile upload error:', err.message);
        return res.status(500).json({
            success: false,
            error: 'Profile picture upload failed'
        });
    }
};

module.exports = { uploadImage, uploadProfilePicture };
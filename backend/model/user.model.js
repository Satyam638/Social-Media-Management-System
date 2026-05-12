const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['Admin', 'Superadmin'],
        required: true
    },
    profilePic: {
        type: String,
    },
    verificationOTP: {
        type: Number
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    otpExpiry: {
        type: Number
    },
    // ── Connected Platforms ────────────────────────────────
    platforms: {
        linkedin: {
            accessToken: { type: String, default: null },
            personUrn: { type: String, default: null },
            isConnected: { type: Boolean, default: false },
            connectedAt: { type: Date, default: null }
        },
        twitter: {
            accessToken: { type: String, default: null },
            isConnected: { type: Boolean, default: false },
            connectedAt: { type: Date, default: null }
        },
        instagram: {
            accessToken: { type: String, default: null },
            isConnected: { type: Boolean, default: false },
            connectedAt: { type: Date, default: null }
        },
        facebook: {
            accessToken: { type: String, default: null },
            pageToken: { type: String, default: null },
            pageId: { type: String, default: null },
            isConnected: { type: Boolean, default: false },
            pageName: { type: String, default: null },
            connectedAt: { type: Date, default: null }
        }
    }
}, {
    timestamps: true
});

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;
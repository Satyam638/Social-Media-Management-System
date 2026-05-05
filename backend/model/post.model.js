const mongoose = require('mongoose');

const postSchema = mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },

    content: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String,
        default:''
    },
        // ── Which platforms user selected (simple boolean) ──
    platforms: {
        linkedin:  { type: Boolean, default: false },
        twitter:   { type: Boolean, default: false },
        instagram: { type: Boolean, default: false },
        facebook:  { type: Boolean, default: false }
    },
    // results from each platform after posting
    results: {
        linkedin:  { success: Boolean, postId: String, error: String },
        twitter:   { success: Boolean, postId: String, error: String },
        instagram: { success: Boolean, postId: String, error: String },
        facebook:  { success: Boolean, postId: String, error: String }
    },
    postStatus:{
        type:String,
        enum:['pending','reject','published','failed','partial'],
        default:'pending'
    },
    postId: String
    // ───────────────────────────────────────────────────────
},{
    timestamps:true
})

const postModel = mongoose.model('post',postSchema);
module.exports = postModel;
const mongoose = require('mongoose');


// ── Reusable sub-schema for each platform ──────────────────
// Instead of repeating these fields 4 times,
// define once and spread into each platform
//
// Before:  linkedin: { type: Boolean, default: false }
// After:   linkedin: { enabled, content, status, postId, error, postedAt }

const platformSchema = {
    enabled: {
        type: Boolean,
        default: false
        // did user select this platform? (replaces old Boolean)
    },
    content: {
        type: String,
        default: ''
        // platform-specific content
        // LinkedIn gets professional text
        // Instagram gets casual + hashtags
        // Twitter gets short punchy text
    },
    status: {
        type: String,
        enum: ['idle', 'published', 'failed'],
        default: 'idle'
        // idle      = not attempted yet
        // published = posted successfully
        // failed    = something went wrong
        // (replaces results.linkedin.success Boolean)
    },
    postId: {
        type: String,
        default: null
        // ID returned by platform after posting
        // LinkedIn → "urn:li:ugcPost:123456"
        // Instagram → "17846368219941196"
        // moved from top-level postId to per-platform
    },
    error: {
        type: String,
        default: null
        // error message if posting failed
        // moved from results.linkedin.error
    },
    postedAt: {
        type: Date,
        default: null
        // exact timestamp when post went live
        // useful for analytics later
    },
    imageUrl:{
        type:String,
        default:''
    }
};

const postSchema = mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    imageUrl: {
        type: String,
        default:''
    },
        // ── Which platforms user selected (simple boolean) ──
    platforms: {
        linkedin:  { ...platformSchema },
        instagram: { ...platformSchema },
        twitter:   { ...platformSchema },
        facebook:  { ...platformSchema }
    },
    overallStatus: {
        type: String,
        enum: ['pending', 'published', 'partial', 'failed', 'draft'],
        default: 'pending'
        // pending   = just created
        // published = all selected platforms succeeded
        // partial   = some succeeded some failed
        // failed    = all selected platforms failed
        // draft     = saved, not posted yet
    },
    // future scheduling feature
    // null = post immediately
    scheduledAt: {
        type: Date,
        default: null
    }
    // ───────────────────────────────────────────────────────
},{
    timestamps:true
});
// index to improve the query performance
postSchema.index({userId:1});
postSchema.index({userId:1,overallStatus:1});
postSchema.index({userId:1,createdAt:-1});
postSchema.index({overallStatus:1,scheduledAt:1});

const postModel = mongoose.model('post',postSchema);
module.exports = postModel;
const linkedInAuth = require('../linkedin/linkedinAuth');
const { postToLinkedIn } = require('../linkedin/linkedinService');
const User = require('../../model/user.model');

// Step 2 LinkedIn redirects back here with a code
const LinkedInRedirectWithCode = async (req, res) => {

    const { code, state: userId } = req.query;
    console.log("=== LinkedIn Callback Hit ===");
    console.log("Code:", code);
    console.log("UserId from state:", userId);

    try {
        // Exchange code for access token
        const accessToken = await linkedInAuth.getAccessToken(code);
        console.log("Access Token received:", accessToken);

        // Get user profile
        const profile = await linkedInAuth.getProfile(accessToken);
        console.log("Profile received:", profile);

        // save token to the user DB
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                'platforms.linkedin.accessToken': accessToken,
                'platforms.linkedin.personUrn': profile.sub,
                'platforms.linkedin.isConnected': true,
                'platforms.linkedin.connectedAt': new Date()
            },
            { new: true } // ← returns updated document
        );
        if (!updatedUser) {
            console.log("User NOT found in DB with ID:", userId);
            return res.status(404).json({ error: 'User not found' });
        }
        console.log("✅ Token saved successfully!");
        res.json({
            message: `Connected as ${profile.name}`,
            personUrn: profile.sub,
            isConnected: updatedUser.platforms.linkedin.isConnected
        });

    } catch (err) {
        console.error('OAuth error:', err.message);
        console.error('Full error:', err); // ← add this line
        res.status(500).json({ error: err.message }); // ← send actual error not "OAuth failed"
    }
};

// Step 1 Redirect user to LinkedIn login Page
const linkedinLogin = (req, res) => {
    console.log("req.user:",req.user)
    const userId = '69f4d08754b55ccde5a10b01';
    const url = linkedInAuth.getAuthUrl(userId);
    res.redirect(url);
};

// Post to LinkedIn
const postLinkedIn = async (req, res) => {
    const { text } = req.body;
    const { accessToken, personUrn } = req.session;

    if (!accessToken) {
        return res.status(401).json({ error: 'Not authenticated. Visit /linkedin/auth first' });
    }

    if (!text) {
        return res.status(400).json({ error: 'Post text is required' });
    }

    try {
        const result = await postToLinkedIn(accessToken, personUrn, text);
        res.status(200).json({ success: true, post: result });
    } catch (err) {
        console.error('Post error:', err.message);
        res.status(500).json({ error: 'Failed to post' });
    }
};

// Check if connected
const checkPostStatus = async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        res.json({
            isConnected: user.platforms.linkedin.isConnected,
            connectedAt: user.platforms.linkedin.connectedAt
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    linkedinLogin, LinkedInRedirectWithCode, postLinkedIn, checkPostStatus
}
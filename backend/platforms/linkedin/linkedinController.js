const linkedInAuth = require('../linkedin/linkedinAuth');
const { postToLinkedIn } = require('../linkedin/linkedinService');
const User = require('../../model/user.model');

// Step 2 LinkedIn redirects back here with a code
const LinkedInRedirectWithCode = async (req, res) => {

    const { code, state: userId } = req.query;
    console.log("=== LinkedIn Callback Hit ===");
    // get temporary code
    console.log("Code:", code);
    // show SMMS user's id which actually help to store access token into user document 
    console.log("UserId from state:", userId);

    try {
        // Exchange temporary code with  access token
        const accessToken = await linkedInAuth.getAccessToken(code);
        // get accesstoken -> very important
        console.log("Access Token received:", accessToken);
        // Get user profile using access Token
        const profile = await linkedInAuth.getProfile(accessToken);
        console.log("Profile received:", profile);

        // now we will save access token to the user DB for future call
        // because without token we can't access Linkedin user info and post things 
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                'platforms.linkedin.accessToken': accessToken,
                'platforms.linkedin.personUrn': profile.sub, //define which user post to linkedin
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
        const userName = profile.name;

        //after coonected we will navigate to the dashboard for creating post 
         res.redirect(
            `${process.env.FRONTEND_URL}/dashboard?linkedin=connected&name=${encodeURIComponent(profile.name)}`
        );

    } catch (err) {
        console.error('OAuth error:', err.message);
        console.error('Full error:', err); // ← add this line
        res.status(500).json({ error: err.message }); // ← send actual error not "OAuth failed"
    }
};

// Step 1 Redirect user to LinkedIn login Page
const linkedinLogin = (req, res) => {
    console.log("req.user:", req.user)
    const userId = req.user.id;
    const url = linkedInAuth.getAuthUrl(userId);
    res.redirect(url);
};

// Post to LinkedIn
const postLinkedIn = async (accessToken, personUrn, text) => {

    if (!accessToken) {
        return res.status(401).json({ error: 'LinkedIn Access Token Missing. Visit /linkedin/auth first' });
    }

    if (!text) {
        return res.status(400).json({ error: 'Post text is required' });
    }

    try {
        const result = await postToLinkedIn(accessToken, personUrn, text);
        return result;

    } catch (err) {
        console.error('LinkedIn Post Error:', err.message);

        throw new Error(err.message);
    }
};

// Check if connected
const checkPostStatus = async (req, res) => {
    try {
        console.log('Req User', req.user);
        console.log('Req User', req.cookies);
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({
            isConnected: user.platforms.linkedin.isConnected,
            name:user.platforms.linkedin.name,
            connectedAt: user.platforms.linkedin.connectedAt
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const disconnectLinkedin = async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.user.id, {
            'platforms.linkedin.accessToken': null,
            'platforms.linkedin.pageToken': null,
            'platforms.linkedin.pageId': null,
            'platforms.linkedin.pageName': null,
            'platforms.linkedin.isConnected': false,
            'platforms.linkedin.connectedAt': null
        });
        return res.json(
            { 
                success: true, 
                message: 'Linkedin disconnected' 
            }
        );
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    linkedinLogin, LinkedInRedirectWithCode, postLinkedIn, checkPostStatus, disconnectLinkedin
}
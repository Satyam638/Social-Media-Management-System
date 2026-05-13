const postToFB = require('../facebook/facebookService');
const fbAuth = require('../facebook/facebookAuth');
const userModel = require('../../model/user.model');


// lets connect to facebook
const connectFacebook = async (req, res) => {
    const userId = req.user.id;
    const url = fbAuth.getFbAuthUrl(userId);
    console.log('URL:', JSON.stringify(url));
// JSON.stringify will reveal any hidden spaces or newlines
    res.redirect(url);
}

// facebook callbck where it send code and permisiions for further
const facebookCallback = async (req, res) => {

    const { code, state: userId } = req.query;


    try {
        // lets exchange code to get short lived code(1 hr)
        const shortToken = await fbAuth.getShortLivedToken(code)

        // now lets get actual tolem by exchanging short lived token
        const longToken = await fbAuth.getLongLivedToken(shortToken);

        // get list of pages users have to get page token
        const pageToken = await fbAuth.getUserPages(longToken);

        // lets change either atlest 1 page is created or not
        if (!pageToken || pageToken.length === 0) {
            return res.redirect(
                `${process.env.FRONTEND_URL}/dashboard?facebook=no_pages`
            );
        };

        // use first page by default
        const page = pageToken[0];


        // now save information to DB

        await userModel.save(userId, {
            'platforms.facebook.accessToken': longToken,
            'platforms.facebook.pageToken': page.access_token,
            'platforms.facebook.pageName': page.name,
            'platforms.facebook.isConnected': true,
            'platforms.facebook.connectedAt': new Date()
        });

        res.redirect(
            `${process.env.FRONTEND_URL}/dashboard?facebook=connected`
        );
    }
    catch (err) {
        console.error('Facebook callback error:', err.message);
        res.redirect(
            `${process.env.FRONTEND_URL}/dashboard?facebook=failed`
        );
    }
}

// ── Disconnect Facebook ────────────────────────────────────
const disconnectFacebook = async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.user.id, {
            'platforms.facebook.accessToken': null,
            'platforms.facebook.pageToken': null,
            'platforms.facebook.pageId': null,
            'platforms.facebook.pageName': null,
            'platforms.facebook.isConnected': false,
            'platforms.facebook.connectedAt': null
        });
        res.json({ success: true, message: 'Facebook disconnected' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


// ── Check connection status ────────────────────────────────
const facebookStatus = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.json({
            isConnected: user.platforms.facebook.isConnected,
            pageName: user.platforms.facebook.pageName,
            pageId: user.platforms.facebook.pageId,
            connectedAt: user.platforms.facebook.connectedAt
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


module.exports = {
    connectFacebook,
    facebookCallback,
    disconnectFacebook,
    facebookStatus
};
const postToFB = require('../facebook/facebookService');
const fbAuth = require('../facebook/facebookAuth');
const userModel = require('../../model/user.model');
const axios = require('axios');
const instagramAuth = require('../instagram/instagramAuth');

// lets connect to facebook
const connectFacebook = async (req, res) => {
    console.log('req.user:', req.user);
    const userId = req.user.id;
    const url = fbAuth.getFbAuthUrl(userId);
    console.log('URL:', JSON.stringify(url));
    // JSON.stringify will reveal any hidden spaces or newlines
    res.redirect(url);
}

// facebook callback where it send code and permisiions for further
const facebookCallback = async (req, res) => {

    const { code, state: userId } = req.query;

    console.log('CODE:', code);
    console.log('USER ID:', userId);

    try {
        // lets exchange code to get short lived code(1 hr)
        const shortToken = await fbAuth.getShortLivedToken(code)

        // now lets get actual tolen by exchanging short lived token
        const longToken = await fbAuth.getLongLivedToken(shortToken);

        // Check which Facebook account logged in
        const me = await axios.get(
            'https://graph.facebook.com/me',
            {
                params: {
                    fields: 'id,name',
                    access_token: longToken
                }
            }
        );

        console.log('FACEBOOK USER:', me.data);

        // Check granted permissions
        const perms = await axios.get(
            'https://graph.facebook.com/me/permissions',
            {
                params: {
                    access_token: longToken
                }
            }
        );

        console.log(
            'PERMISSIONS:',
            JSON.stringify(perms.data, null, 2)
        );

        // ================= DEBUG END =================

        // get list of pages users have to get page token
        const pages = await fbAuth.getUserPages(longToken);

        // lets change either atlest 1 page is created or not
        if (!pages || pages.length === 0) {
            return res.redirect(
                `${process.env.FRONTEND_URL}/dashboard?facebook=no_pages`
            );
        };

        // use first page by default
        const page = pages[0];

        console.log('Page', page);
        console.log('Page id', page.id);

        // ── Get Instagram account linked to this page ──────
        let instagramAccountId = null;
        let instagramUsername = null;

        try {
            instagramAccountId = await instagramAuth.getInstagramAccountId(page.id, page.access_token);
            // now based on the id find insta profile data like username, image and more....
            if (instagramAccountId) {
                const igProfile = await instagramAuth.getInstagramProfile(instagramAccountId, page.access_token);
                instagramUsername = igProfile.username;
                console.log(`✅ Instagram found: @${instagramUsername}`)
            }
        }
        catch (err) {
            // Instagram not linked — that's okay
            // Facebook will still connect
            console.log('No Instagram account linked to this page');
        }

        // now update user information to DB
        await userModel.findByIdAndUpdate(userId, {
            // facebook
            'platforms.facebook.accessToken': longToken,
            'platforms.facebook.pageToken': page.access_token,
            'platforms.facebook.pageName': page.name,
            'platforms.facebook.pageId': page.id,
            'platforms.facebook.isConnected': true,
            'platforms.facebook.connectedAt': new Date(),


            // instagram
            'platforms.instagram.accessToken': page.access_token,
            'platforms.instagram.instagramAccountId': instagramAccountId,
            'platforms.instagram.instagramUsername': instagramUsername,
            'platforms.instagram.isConnected': !!instagramAccountId,
            'platforms.instagram.connectedAt': instagramAccountId ? new Date() : null
        });
        console.log('Connected to Facebook Successfully !!')
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
        await userModel.findByIdAndUpdate(req.user.id, {
            'platforms.facebook.accessToken': null,
            'platforms.facebook.pageToken': null,
            'platforms.facebook.pageId': null,
            'platforms.facebook.pageName': null,
            'platforms.facebook.isConnected': false,
            'platforms.facebook.connectedAt': null,


            'platforms.instagram.instagramAccountId':null,
            'platforms.instagram.instagramUsername':null,
            'platforms.instagram.isConnected':null,
            'platforms.instagram.connectedAt':null,

        });
        res.json({ success: true, message: 'Facebook and Instagram Disconnected' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


// ── Check connection status ────────────────────────────────
const facebookStatus = async (req, res) => {
    try {
        const user = await userModel.findById(req.user.id);
        res.json({
            isConnected: user.platforms.facebook.isConnected,
            pageName: user.platforms.facebook.pageName,
            pageId: user.platforms.facebook.pageId,
            connectedAt: user.platforms.facebook.connectedAt,
            instagramAccountId: user.platforms.instagram.instagramAccountId,
            instagramUsername: user.platforms.instagram.instagramUsername,
            instagramIsConnected: user.platforms.instagram.isConnected
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
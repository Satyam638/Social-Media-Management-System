const axios = require('axios');
require('dotenv').config();
const GRAPH_API = 'https://graph.facebook.com/v19.0';

// step 1 create facebook oauth url
const getFbAuthUrl =(userId)=>{

    const scopes = [
        'pages_show_list',  //to shee all pages
        'pages_read_engagement', // to read page data
        'pages_manage_posts', // to publish post on this page
        'public_profile', // find user info
        'instagram_content_publish', //to publish content on instagram
        'instagram_basic', //to find user info from instagram
    ].join(',');

    console.log('APP ID:', process.env.FACEBOOK_APP_ID);
    console.log('REDIRECT:', process.env.FACEBOOK_REDIRECT_URI);

    return `https://www.facebook.com/v19.0/dialog/oauth?` + 
    `client_id=${process.env.FACEBOOK_APP_ID}`+
    `&redirect_uri=${encodeURIComponent(process.env.FACEBOOK_REDIRECT_URI)}` +
    `&scope=${scopes}`+ //permissions required from facebook user ACCOUNT 
    `&state=${userId}`;  //software user id from mongoDB  
}

// step 2 -> gget temporary token to get actual access token
const getShortLivedToken = async(code)=>{
    const response = await axios.get(`${GRAPH_API}/oauth/access_token`,{
        params:{
            client_id: process.env.FACEBOOK_APP_ID,
            client_secret: process.env.FACEBOOK_APP_SECRET,
            redirect_uri: process.env.FACEBOOK_REDIRECT_URI,
            code
        }
    });

    return response.data.access_token;
}
// step 3 -> to get actual token of user account to manage things
const getLongLivedToken = async (shortLivedToken) => {
    const response = await axios.get(`${GRAPH_API}/oauth/access_token`, {
        params: {
            grant_type:        'fb_exchange_token',
            client_id:         process.env.FACEBOOK_APP_ID,
            client_secret:     process.env.FACEBOOK_APP_SECRET,
            fb_exchange_token: shortLivedToken
        }
    });
    return response.data.access_token;
    // valid for ~60 days
};
// step 4 -> get all page of user have then post on page with the waccess token which comes with page info
const getUserPages = async (longLivedToken) => {
    const response = await axios.get(`${GRAPH_API}/me/accounts`, {
        params: {
            access_token: longLivedToken,
            fields: 'id,name,access_token,category'
            //              ↑
            //        page-specific token returned here
            //        this is what we use to post!
        }
    });
    return response.data.data;
    // returns array of pages:
    // [{ id: "123", name: "My Page", access_token: "PAGE_TOKEN" }]
};

module.exports = {
    getFbAuthUrl,getShortLivedToken, getLongLivedToken,getUserPages
};
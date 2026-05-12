const axios = require('axios');
require('dotenv').config();




const GRAPH_API = 'https://graph.facebook.com/v19.0';

// step 1 create facebook oauth url

const getFbAuthUrl =(userId)=>{

    const scopes = [
        'pages_show_list',  //to shee all pages
        'pages_read_engagement', // to read page data
        'pages_manage_posts', // to publish post on this page
        'public_profile' // find user info
    ].join(',');


    return ` https://www.facebook.com/v19.0/dialog/oauth` + 
    `?client_id = ${process.env.FACEBOOK_APP_ID}`+
    `&redirect_uri-${encodeURIComponent(process.env.FACEBOOK_REDIRECT_URI)}` +
    // `&scope =${scopes}`+ permissions required from facebook user ACCOUNT 
    `&state=${userId}`;  //software user id from mongoDB  
}


const getShortLivedToken = async(code)=>{

}


module.exports = {
    getFbAuthUrl,getShortLivedToken
};
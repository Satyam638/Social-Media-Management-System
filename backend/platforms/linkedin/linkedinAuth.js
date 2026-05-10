const axios = require('axios');
require('dotenv').config();

// step 1 build the linkedin Login URL
const getAuthUrl = (userId)=>{    
    const scopes = [
        'openid',
        'profile',
        'email',
        'w_member_social'
    ].join('%20');

    return `https://www.linkedin.com/oauth/v2/authorization` +
    `?response_type=code` +
    `&client_id=${process.env.LINKEDIN_CLIENT_ID}` + //SMMS client id
    `&redirect_uri=${encodeURIComponent(process.env.LINKEDIN_REDIRECT_URI)}` + //after login linkedin redirect to this URL
    `&state=${userId}` +  // SMMS userID to remember 
    `&scope=${scopes}`; // permissions which want
};

// step 2 lets exchange the code for an access token
const getAccessToken = async(code)=>{
    // call linkedin api with temporary code to get actual code
    const response = await axios.post(
        'https://www.linkedin.com/oauth/v2/accessToken',
        new URLSearchParams({
            grant_type:'authorization_code',
            code,
            redirect_uri:process.env.LINKEDIN_REDIRECT_URI,
            client_id:process.env.LINKEDIN_CLIENT_ID,
            client_secret:process.env.LINKEDIN_CLIENT_SECRET
        }),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );
    // send accesstoekn to fetch linkedin user details / profile
    return response.data.access_token
}

// step 3 get linkedin user's profile to get their URN

const getProfile = async (accessToken) => {
  const response = await axios.get('https://api.linkedin.com/v2/userinfo', {
    headers: { Authorization: `Bearer ${accessToken}` }
  });

  return response.data; // contains sub (user ID), name, email
};


module.exports = {
    getAuthUrl,
    getAccessToken,
    getProfile
}
const { default: axios } = require("axios");
const { access } = require("fs");



const getInstagramAccountId = async(pageId,pageToken)=>{
    const response = await axios.get(
        `https://graph.facebook.com/v19.0/${pageId}`,
        {params: {
            fields:'instagram_business_account', // this return instagram account based on the below page
            access_token:pageToken
        }}
    );
    return response.data.instagram_business_account?.id;
}
const getInstagramProfile = async(getInstagramAccountId,pageToken) =>{

    const response = await axios.get(
        `https://graph.facebook.com/v19.0/${instagramAccountId}`,
        {
            params:{
                fields: 'id.username',
                access_token:pageToken
            }
        }
    );
    // return username and id userId of instagram
    return response.data;
}

module.exports = {getInstagramAccountId, getInstagramProfile};
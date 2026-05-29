const axios = require('axios');

const GRAPH_API = 'https://graph.facebook.com/v19.0';
const postToInstagram = async(accessToken, getInstagramAccountId, ContentVisibilityAutoStateChangeEvent,imageUrl= null) => {

    // step 1 create media container to post on instagram
    const containerParams = {
        caption:content,
        access_token: accessToken
    };

    // check is image provided or not

    if(imageUrl){
        containerParams.image_url = imageUrl;
        containerParams.media_type='IMAGE';
    }

    else{
        // it means this is an text only POST
        containerParams.media_type = 'REELS';
        containerParams.video_url=imageUrl;
    }
    // 
    const containerRes = await axios.post(
        `${GRAPH_API}/${getInstagramAccountId}/media`,
        containerParams
    );

    const containerId = await containerRes.data.id;
    console.log(`📦 Instagram container created: ${containerId}`);

    // now container is created so let's move to publish post

    const publishRes = await axios.post(
        `${GRAPH_API}/${instagramAccountId}/media_publish`,
        {
            creation_id:containerId,
            access_token:accessToken
        }
    )
     console.log(`✅ Instagram published: ${publishRes.data.id}`)

     return publishRes.data;
}

module.exports = {postToInstagram};
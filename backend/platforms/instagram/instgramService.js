const axios = require('axios');

const GRAPH_API = 'https://graph.facebook.com/v19.0';
// instagramService.js
const postToInstagram = async (accessToken, instagramAccountId, content, imageUrl) => {

    // at this point imageUrl is guaranteed to exist
    // because validation already checked it
    // but add safety check anyway
    if (!imageUrl) {
        throw new Error('Instagram requires an image URL');
    }

    // STEP 1: Create media container
    const containerRes = await axios.post(
        `${GRAPH_API}/${instagramAccountId}/media`,
        {
            caption:      content,
            image_url:    imageUrl,
            media_type:   'IMAGE',
            access_token: accessToken
        }
    );

    const containerId = containerRes.data.id;
    console.log(`📦 Instagram container: ${containerId}`);

    // STEP 2: Publish
    const publishRes = await axios.post(
        `${GRAPH_API}/${instagramAccountId}/media_publish`,
        {
            creation_id:  containerId,
            access_token: accessToken
        }
    );

    return publishRes.data;
};

module.exports = {postToInstagram};
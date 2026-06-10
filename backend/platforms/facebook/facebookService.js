const axios = require('axios');
const { access } = require('fs');

const GRAPH_API = 'https://graph.facebook.com/v19.0';


// let post on facebooks user's page with access token

const postToFacebook = async (pageToken, pageId, content, imageUrl=null) => {

    let response = ''

    if (imageUrl) {
        response = await axios.post(
            `${GRAPH_API}/${pageId}/photos`,
            {
                url: imageUrl,
                caption: content,
                access_token: pageToken
            }
        );
    }
    else {
        response = await axios.post(`${GRAPH_API}/${pageId}/feed`,
            {
                message: content,
                access_token: pageToken
            }
        );
    }
    return response.data;

}
module.exports = { postToFacebook };
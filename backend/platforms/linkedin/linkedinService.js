const axios  = require('axios');
const fs = require('fs');
// Post a text update to LinkedIn
const postToLinkedIn = async (accessToken, personUrn, text) => {

  try {
    console.log("PERSON URN:", personUrn);
    const body = {
      author: `urn:li:person:${personUrn}`,
      lifecycleState: 'PUBLISHED',
      specificContent: {
        'com.linkedin.ugc.ShareContent': {
          shareCommentary: {
            text: text
          },
          shareMediaCategory: 'NONE'
        }
      },
      visibility: {
        'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC'
      }
    };

    const response = await axios.post(
      'https://api.linkedin.com/v2/ugcPosts',
      body,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'X-Restli-Protocol-Version': '2.0.0'
        }
      }
    );

    return response.data;

  } catch (err) {

    console.log("========== LINKEDIN ERROR ==========");

    console.log("STATUS:", err.response?.status);

    console.log(
      "DATA:",
      JSON.stringify(err.response?.data, null, 2)
    );

    throw err;
  }
};

// ── STEP 1 - Register image with LinkedIn ──────────────
const registerImage = async (accessToken, personUrn) => {
    const body = {
        registerUploadRequest: {
            recipes: ['urn:li:digitalmediaRecipe:feedshare-image'],
            owner: `urn:li:person:${personUrn}`,
            serviceRelationships: [{
                relationshipType: 'OWNER',
                identifier: 'urn:li:userGeneratedContent'
            }]
        }
    };

    const response = await axios.post(
        'https://api.linkedin.com/v2/assets?action=registerUpload',
        body,
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            }
        }
    );

    const uploadUrl = response.data.value.uploadMechanism['com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest'].uploadUrl;
    const assetId = response.data.value.asset;

    return { uploadUrl, assetId };
};

// ── STEP 2 - Upload image to LinkedIn ─────────────────
const uploadImage = async (uploadUrl, accessToken, imagePath) => {
    const imageBuffer = fs.readFileSync(imagePath);

    await axios.put(uploadUrl, imageBuffer, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/octet-stream',
        }
    });
};

// ── STEP 3 - Create post with image ───────────────────
const postToLinkedInWithImage = async (accessToken, personUrn, content, imagePath) => {
    try {
        // Step 1 - Register image
        console.log("=== Step 1: Registering image ===");
        const { uploadUrl, assetId } = await registerImage(accessToken, personUrn);
        console.log("uploadUrl:", uploadUrl);
        console.log("assetId:", assetId);

        // Step 2 - Upload image
        console.log("=== Step 2: Uploading image ===");
        console.log("imagePath:", imagePath);
        await uploadImage(uploadUrl, accessToken, imagePath);
        console.log("Image uploaded ✅");

        // Step 3 - Create post
        console.log("=== Step 3: Creating post with image ===");
        const body = {
            author: `urn:li:person:${personUrn}`,
            lifecycleState: 'PUBLISHED',
            specificContent: {
                'com.linkedin.ugc.ShareContent': {
                    shareCommentary: { text: content },
                    shareMediaCategory: 'IMAGE',
                    media: [{
                        status: 'READY',
                        description: { text: content },
                        media: assetId,
                        title: { text: 'Image Post' }
                    }]
                }
            },
            visibility: {
                'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC'
            }
        };

        console.log("Post body:", JSON.stringify(body, null, 2));

        const response = await axios.post(
            'https://api.linkedin.com/v2/ugcPosts',
            body,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                    'X-Restli-Protocol-Version': '2.0.0'
                }
            }
        );

        console.log("Post created ✅:", response.data);

        // Cleanup temp file
        fs.unlinkSync(imagePath);
        console.log("Temp file deleted ✅");

        return response.data;

    } catch (err) {
        console.error("postToLinkedInWithImage error:", err.response?.data || err.message);
        throw err;
    }
};

module.exports = {postToLinkedIn,postToLinkedInWithImage};
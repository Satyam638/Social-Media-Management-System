const postModel = require('../model/post.model');
const userModel = require('../model/user.model');
const { postLinkedIn } = require('../platforms/linkedin/linkedinController');
const linkedinServices = require('../platforms/linkedin/linkedinService');

const createPost = async (req, res) => {

    try {
        const { content } = req.body;
        console.log(req.body);
        console.log(typeof req.body.platforms);
        console.log(req.body.platforms);
        const userId = req.user.id;
        console.log(req.body);
        console.log(typeof req.body.platforms);
        console.log(req.body.platforms);
        // to debug purpose 
        console.log("REQ.USER:", req.user);
        console.log("USER ID:", req.user?.id);
        const imagePath = req.file ? req.file.path : null;
        console.log("req.file:", req.file);       // ← add this
        console.log("imagePath:", imagePath);
        const platforms = {
            linkedin: req.body.platforms?.linkedin === true || req.body.platforms?.linkedin === 'true',
            twitter: req.body.platforms?.twitter === true || req.body.platforms?.twitter === 'true',
            instagram: req.body.platforms?.instagram === true || req.body.platforms?.instagram === 'true',
            facebook: req.body.platforms?.facebook === true || req.body.platforms?.facebook === 'true',
        };

        // create entry into database
        const newPost = await postModel.create({
            userId: userId,
            content: content,
            platforms,
            imageURL: imagePath || '',
        });
        console.log("Post and Data saved into DB");
        // lets fetch user from Users Model
        const user = await userModel.findById(userId);
        const results = {};
        // check linkedin connected or not
        if (platforms?.linkedin) {
            // if not connected then show message
            if (!user.platforms?.linkedin?.isConnected) {
                results.linkedin = {
                    success: false,
                    error: 'LinkedIn not Connected'
                };
            }
            // else lets procced to create post
            else {
                try {

                    let linkedInRes;
                    if (imagePath) {
                        console.log('Posting With Media');
                        linkedinRes = await linkedinServices.postToLinkedInWithImage(
                            user.platforms.linkedin.accessToken,
                            user.platforms.linkedin.personUrn,
                            content,
                            imagePath
                        );
                    }
                    else {
                        console.log('Posting Without Media');
                        linkedinRes = await linkedinServices.postToLinkedIn(
                            user.platforms.linkedin.accessToken,
                            user.platforms.linkedin.personUrn,
                            content
                        );
                    }

                    results.linkedin = {
                        success: true,
                        postId: linkedinRes.id
                    }
                }
                catch (err) {
                    results.linkedin = {
                        success: false,
                        error: err.message
                    };
                }
            }
        }

        //lets update status
        const statuses = Object.values(results);
        const allSuccess = statuses.length > 0 && statuses.every(r => r.success);
        const allFailed = statuses.length > 0 && statuses.every(r => !r.success);

        newPost.results = results
        newPost.postStatus = allSuccess ? 'published' : allFailed ? 'failed' : 'partial';
        await newPost.save();

        console.log("Publish Post");
        res.status(201).json({
            success: allSuccess,
            message: allSuccess ? "Post Published 🎉" : allFailed ? "Failed to post" : 'Partially published',
            error: results.error,
            results,
            data: newPost
        })
    }
    catch (error) {
        console.error('createPost error:', error);
        console.log(error.response?.data);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const allPublishedPost = async (req, res) => {
}

const allPendingPost = async (req, res) => {

}
module.exports = { createPost, allPublishedPost, allPendingPost };
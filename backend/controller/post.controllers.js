const postModel = require('../model/post.model');
const userModel = require('../model/user.model');
const { postLinkedIn } = require('../platforms/linkedin/linkedinController');
// const {  } = require('../platforms/facebook/facebookController');
const linkedinServices = require('../platforms/linkedin/linkedinService');
const { postToFacebook } = require('../platforms/facebook/facebookService');
const { postToInstagram } = require('../platforms/instagram/instgramService');
const postValidation = require('../middleware/validation.middleware');
const { default: axios } = require('axios');

// const createPost = async (req, res) => {

//     try {
//         const { content } = req.body;
//         console.log(req.body);
//         console.log(typeof req.body.platforms);
//         console.log(req.body.platforms);
//         // find user from database who raise request for creating post on behalf of platform user 
//         const userId = req.user.id;
//         // to debug purpose 
//         console.log("REQ.USER:", req.user);
//         console.log("USER ID:", req.user?.id);
//         // check is the image path is provided or not 
//         const imagePath = req.file ? req.file.path : null;

//         console.log("req.file:", req.file);       // ← add this
//         console.log("imagePath:", imagePath);
//         // Parse platforms safely
//         let parsedPlatforms = {};
//         try {
//             parsedPlatforms = typeof req.body.platforms === 'string'
//                 ? JSON.parse(req.body.platforms)   // ← parse if string (from FormData)
//                 : req.body.platforms;              // ← use directly if already object (from JSON body)
//         } catch (e) {
//             parsedPlatforms = {};
//         }

//         const platforms = {
//             linkedin: parsedPlatforms.linkedin === true || parsedPlatforms.linkedin === 'true',
//             twitter: parsedPlatforms.twitter === true || parsedPlatforms.twitter === 'true',
//             instagram: parsedPlatforms.instagram === true || parsedPlatforms.instagram === 'true',
//             facebook: parsedPlatforms.facebook === true || parsedPlatforms.facebook === 'true',
//         };

//         // create entry into database
//         const newPost = await postModel.create({
//             userId: userId,
//             content: content,
//             platforms,
//             imageURL: imagePath || '',
//         });
//         console.log("Post and Data saved into DB");
//         // lets fetch user from Users Model
//         const user = await userModel.findById(userId);
//         const results = {};
//         // check linkedin connected or not
//         if (platforms?.linkedin) {
//             // if not connected then show message
//             if (!user.platforms?.linkedin?.isConnected) {
//                 results.linkedin = {
//                     success: false,
//                     error: 'LinkedIn not Connected'
//                 };
//             }
//             // else lets procced to create post
//             else {
//                 try {

//                     let linkedInRes;
//                     if (imagePath) {
//                         console.log('Posting With Media');
//                         linkedinRes = await linkedinServices.postToLinkedInWithImage(
//                             user.platforms.linkedin.accessToken,
//                             user.platforms.linkedin.personUrn,
//                             content,
//                             imagePath
//                         );
//                     }
//                     else {
//                         console.log('Posting Without Media');
//                         linkedinRes = await linkedinServices.postToLinkedIn(
//                             user.platforms.linkedin.accessToken,
//                             user.platforms.linkedin.personUrn,
//                             content
//                         );
//                     }

//                     results.linkedin = {
//                         success: true,
//                         postId: linkedinRes.id
//                     }
//                 }
//                 catch (err) {
//                     results.linkedin = {
//                         success: false,
//                         error: err.message
//                     };
//                 }
//             }
//         }

//         //lets update status
//         const statuses = Object.values(results);
//         const allSuccess = statuses.length > 0 && statuses.every(r => r.success);
//         const allFailed = statuses.length > 0 && statuses.every(r => !r.success);

//         newPost.results = results
//         newPost.postStatus = allSuccess ? 'published' : allFailed ? 'failed' : 'partial';
//         await newPost.save();

//         console.log("Publish Post");
//         res.status(201).json({
//             success: allSuccess,
//             message: allSuccess ? "Post Published 🎉" : allFailed ? "Failed to post" : 'Partially published',
//             error: results.error,
//             results,
//             data: newPost
//         })
//     }
//     catch (err) {
//     console.error("❌ LinkedIn error message:", err.message);
//     console.error("❌ LinkedIn API response:", err.response?.data); // ← LinkedIn's exact error
//     results.linkedin = {
//         success: false,
//         error: err.response?.data || err.message  // ← send full error back
//     };
// }
// }

const schedulePost = async (req, res) => {

    try {
        const { platforms, scheduledAt,imageUrl } = req.body;

        const userId = req.user.id;

        // validate platforms
        if (!scheduledAt) {
            return res.status(400).json({
                success: false,
                error: "Schedule Timing Must Required"
            });
        };
        // timing must be in future
        if (new Date(scheduledAt) <= new Date()) {
            return res.status(400).json({
                success: false,
                error: "scheduledAt must be a future date and time"
            });
        };
        // validate platforms
        const validation = postValidation.validatePlatforms(platforms,imageUrl);
        if (!validation) {
            return res.status(400).json({
                success: false,
                error: validation.error,
                errors: validation.errors
            });
        };

        // let's create drafted post into db 
        //  because is server or node-cron crashes still we have post which we try post again
        const draftPost = await postModel.create({
            userId,
            platforms,
            overallStatus: 'draft',
            scheduledAt: new Date(scheduledAt)
        });
        console.log(`📅 Post scheduled: ${scheduledAt}`);
        console.log(`   Post ID: ${draftPost._id}`);

        return res.status(201).json({
            sucess: true,
            message: `Post scheduled for ${new Date(scheduledAt).toLocaleString()} 📅`,
            overallStatus: "draft",
            scheduledAt: draftPost.scheduledAt,
            postId: draftPost._id
        })
    }
    catch (error) {
        console.error('schedulePost error:', error.message);
        return res.status(500).json({
            success: false,
            error: 'Internal Server Error'
        });
    }
}
const publishToPlatforms = async (post, user) => {

    const platforms = post.platforms;

    // posting to linkedin
    if (platforms.linkedin?.enabled) {
        console.log('📤 Attempting LinkedIn post...');

        if (!user.platforms?.linkedin?.isConnected) {
            post.platforms.linkedin.status = 'failed',
                post.platforms.linkedin.error = 'LinkedIn not connected. ' + 'Visit /api/linkedin/auth first';

            console.log('❌ LinkedIn not connected');
        }

        // it means platform is connected now call postTolinkedIn API
        else {
            try {
                const result = await postLinkedIn(
                    user.platforms.linkedin.accessToken,
                    user.platforms.linkedin.personUrn,
                    platforms.linkedin.content
                );

                // update status after post
                post.platforms.linkedin.status = 'published';
                post.platforms.linkedin.postId = result.id;
                post.platforms.linkedin.postedAt = new Date();
                post.platforms.linkedin.error = null;

                console.log(`✅ LinkedIn posted: ${result.id}`)
            }
            catch (err) {
                // ❌ LinkedIn API call failed
                post.platforms.linkedin.status = 'failed';
                post.platforms.linkedin.error = err.message;
                console.error(`❌ LinkedIn failed: ${err.message}`);
            }
        }
    }

    // posting on Fcebook
    if (platforms.facebook?.enabled) {

        console.log('Attempting Facebook Post');

        if (!user.platforms?.facebook?.isConnected) {
            post.platforms.facebook.status = 'failed';
            post.platforms.facebook.err = 'Facebook Not Connected Visit /api/facebook/auth first';
            console.log('Facebook Not Connected');
        }

        else {
            try {
                console.log('PAGE TOKEN:', user.platforms.facebook.pageToken);
                console.log('PAGE ID:', user.platforms.facebook.pageId);
                console.log('CONTENT:', platforms.facebook.content);
                const result = await postToFacebook(
                    user.platforms.facebook.pageToken,
                    user.platforms.facebook.pageId,
                    platforms.facebook.content
                );
                post.platforms.facebook.status = 'published',
                    post.platforms.facebook.postId = result.id,
                    post.platforms.facebook.postedAt = new Date(),
                    post.platforms.facebook.error = null;

                console.log(`✅ Facebook posted: ${result.id}`);
            }
            catch (err) {

                post.platforms.facebook.status = 'failed';
                post.platforms.facebook.error =
                    err.response?.data?.error?.message || err.message;
                console.error('❌ Facebook API Error:');
                console.error(err.response?.data || err.message);
            }
        }
    }
    // posting on instagram
    if (platforms.instagram?.enabled) {
        console.log('📤 Attempting Instagram post...')

        if (!user.platforms?.instagram?.isConnected) {
            post.platforms.instagram.status = 'failed',
            post.platforms.instagram.err = 'Instagram is not Connected, Connected Facebook First then Instagram'
            console.log('❌ Instagram not connected');
        }

        // it meanse connected so let's move to publish post
        else {
            try {

                console.log('ISTAGRAM PAGE TOKEN Same as Facebook Token:', user.platforms.instagram.accessToken);
                console.log('Insta Account ID:', user.platforms.instagram.instagramAccountId);
                console.log('Instagram Username:', platforms.instagram.instagramUsername);
                console.log('Instagram CONTENT:', platforms.instagram.content);

                const result = await postToInstagram(
                    user.platforms.instagram.accessToken,
                    user.platforms.instagram.instagramAccountId,
                    post.platforms.instagram.content
                );
                post.platforms.instagram.status = 'published',
                post.platforms.instagram.postId = result.id;
                post.platforms.instagram.postedAt = new Date();
                post.platforms.instagram.error = null;
                console.log(`✅ Instagram posted: ${result.id}`);
            }
            catch (err) {
                post.platforms.instagram.status = 'failed';
                post.platforms.instagram.error =
                    err.response?.data?.error?.message || err.message;
                console.error('❌ Instagram failed:', err.response?.data || err.message);
            }
        }
    }

    // posting on reddit

    // update all post status
    post.overallStatus = postValidation.deterMineOverallStatus(post.platforms);

    // save post into database 
    await post.save();
    console.log(`💾 Post saved with status: ${post.overallStatus}`);
    // return post response
    return post;
}

const createPost = async (req, res) => {

    try {
        // get request 

        const { platforms, scheduledAt,imageUrl } = req.body
        const userId = req.user.id;

        // check input is valid or not
        if (!platforms || typeof platforms !== 'object') {
            return res.status(400).json({
                success: false,
                error: "Platform object is required"
            });
        }

        // check any one platform is enabled or not 
        // we use some() fn which is true whn any one value is true 
        const hasEnabled = Object.values(platforms).some(p => p.enabled);

        if (!hasEnabled) {
            return res.status(400).json({
                success: false,
                error: "Atleast Enable one Platform"
            });
        }

        // now validate content as we define validation function in vlidation middleware, lets's check

        const validationErrors = postValidation.validatePlatforms(platforms,imageUrl)

        // if any error have then we will return error
        if (validationErrors.length > 0) {
            return res.status(400).json({
                success: false,
                errors: validationErrors
                // returns ALL errors at once
                // so user can fix everything in one go
            });
        }

        // now lets fetch access token from user's model

        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        // lets save post into DB because if server crashes even we have records of post so we can again try to publish post
        const newPost = await postModel.create({
            userId,
            platforms,
            overallStatus: 'pending',
            scheduledAt: scheduledAt || null
        });
        console.log(`📝 Post created in DB: ${newPost._id}`);

        // now let's call platforms apis to publish a post 

        // // posting on LINKEDIN
        // if (platforms.linkedin?.enabled) {
        //     console.log('📤 Attempting LinkedIn post...');

        //     if (!user.platforms?.linkedin.isConnected) {
        //         newPost.platforms.linkedin.status = 'failed',
        //             newPost.platforms.linkedin.error = 'LinkedIn not connected. ' + 'Visit /api/linkedin/auth first';

        //         console.log('❌ LinkedIn not connected');
        //     }

        //     // it means platform is connected now call postTolinkedIn API
        //     else {
        //         try {
        //             const result = await postLinkedIn(
        //                 user.platforms.linkedin.accessToken,
        //                 user.platforms.linkedin.personUrn,
        //                 platforms.linkedin.content
        //             );

        //             // update status after post
        //             newPost.platforms.linkedin.status = 'published';
        //             newPost.platforms.linkedin.postId = result.id;
        //             newPost.platforms.linkedin.postedAt = new Date();
        //             newPost.platforms.linkedin.error = null;

        //             console.log(`✅ LinkedIn posted: ${result.id}`)
        //         }
        //         catch (err) {
        //             // ❌ LinkedIn API call failed
        //             newPost.platforms.linkedin.status = 'failed';
        //             newPost.platforms.linkedin.error = err.message;

        //             console.error(`❌ LinkedIn failed: ${err.message}`);
        //         }
        //     }
        // }

        // // posting on Fcebook
        // if (platforms.facebook?.enabled) {

        //     console.log('Attempting Facebook Post');

        //     if (!user.platforms?.facebook.isConnected) {
        //         newPost.platforms.facebook.status = 'failed';
        //         newPost.platforms.facebook.err = 'Facebook Not Connected Visit /api/facebook/auth first';
        //         console.log('Facebook Not Connected');
        //     }

        //     else {
        //         try {
        //             console.log('PAGE TOKEN:', user.platforms.facebook.pageToken);
        //             console.log('PAGE ID:', user.platforms.facebook.pageId);
        //             console.log('CONTENT:', platforms.facebook.content);
        //             const result = await postToFacebook(
        //                 user.platforms.facebook.pageToken,
        //                 user.platforms.facebook.pageId,
        //                 platforms.facebook.content
        //             );
        //             newPost.platforms.facebook.status = 'published',
        //                 newPost.platforms.facebook.postId = result.id,
        //                 newPost.platforms.facebook.postedAt = new Date(),
        //                 newPost.platforms.facebook.error = null;

        //             console.log(`✅ Facebook posted: ${result.id}`);
        //         }
        //         catch (err) {

        //             newPost.platforms.facebook.status = 'failed';

        //             newPost.platforms.facebook.error =
        //                 err.response?.data?.error?.message || err.message;

        //             console.error('❌ Facebook API Error:');
        //             console.error(err.response?.data || err.message);
        //         }
        //     }
        // }

        const result = await publishToPlatforms(newPost, user);

        // return response message
        const message = {
            published: 'Posted to all Platforms  🎉',
            failed: 'Failed to Post on Platforms  ❌',
            partial: 'Post on Some Platforms ⚠️'
        }
        // sending response
        return res.status(201).json({
            success: result.overallStatus !== 'failed',
            overallStatus: result.overallStatus,
            message: message[result.overallStatus],
            postId: result._id,
            platforms: {
                linkedin: {
                    status: result.platforms.linkedin.status,
                    postId: result.platforms.linkedin.postId,
                    error: result.platforms.linkedin.error,
                    postedAt: result.platforms.linkedin.postedAt
                },
                facebook: {
                    status: result.platforms.facebook.status,
                    postId: result.platforms.facebook.postId,
                    error: result.platforms.facebook.error,
                    postedAt: result.platforms.facebook.postedAt
                }
            }

        })
    } catch (error) {
        console.error('createPost error:', error);
        return res.status(500).json({
            success: false,
            error: 'Internal Server Error'
        });
    }
}

// get all posts by logged in user
const getUserPosts = async (req, res) => {
    try {
        const posts = await postModel
            .find({ userId: req.user.id })
            .sort({ createdAt: -1 }); // newest first

        res.status(200).json({
            success: true,
            count: posts.length,
            posts
        });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// get posts by overall status
const getPostsByStatus = async (req, res) => {
    try {
        const { status } = req.params;
        const validStatuses = ['pending', 'published', 'partial', 'failed', 'draft'];

        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                error: `Invalid status. Must be: ${validStatuses.join(', ')}`
            });
        }

        const posts = await postModel
            .find({ userId: req.user.id, overallStatus: status })
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, count: posts.length, posts });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// get all scheduled (future draft) posts
const getScheduledPosts = async (req, res) => {
    try {
        const posts = await postModel
            .find({
                userId: req.user.id,
                overallStatus: 'draft',
                scheduledAt: { $gt: new Date() }
                //               ↑ only future posts
            })
            .sort({ scheduledAt: 1 }); // earliest first

        res.status(200).json({ success: true, count: posts.length || 'No Scheduled Post', posts });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// cancel a scheduled post
const cancelScheduledPost = async (req, res) => {
    try {
        const post = await postModel.findOne({
            _id: req.params.id,
            userId: req.user.id,
            // only allow cancelling draft posts
            overallStatus: 'draft'
        });

        if (!post) {
            return res.status(404).json({
                success: false,
                error: 'Scheduled post not found or already published'
            });
        }

        await postModel.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Scheduled post cancelled ✅'
        });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
module.exports = {
    createPost,
    getUserPosts,
    getPostsByStatus,
    getScheduledPosts,
    cancelScheduledPost,
    publishToPlatforms,
    schedulePost
};
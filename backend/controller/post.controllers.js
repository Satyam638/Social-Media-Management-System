const postModel = require('../model/post.model');
const userModel = require('../model/user.model');
const { postLinkedIn } = require('../platforms/linkedin/linkedinController');
const linkedinServices = require('../platforms/linkedin/linkedinService');
const postValidation = require('../middleware/validation.middleware');

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
const createPost = async(req,res)=>{

    try{
        // get request 

        const {platforms, scheduledAt} = req.body
        const userId = req.user.id;

        // check input is valid or not
        if(!platforms || typeof platforms !== 'object'){
            return res.status(400).json({
                success:false,
                error:"Platform object is required"
            });
        }

        // check any one platform is enabled or not 
        // we use some() fn which is true whn any one value is true 
        const hasEnabled = Object.values(platforms).some(p=>p.enabled);

        if(!hasEnabled){
            return res.status(400).json({
                success:false,
                error:"Atleast Enable one Platform"
            });
        }

        // now validate content as we define validation function in vlidation middleware, lets's check

        const validationErrors = postValidation.validatePlatforms(platforms)

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

        if(!user){
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        // lets save post into DB because if server crashes even we have records of post so we can again try to publish post
        const newPost = await postModel.create({
            userId,
            platforms,
            overallStatus:'pending',
            scheduledAt: scheduledAt || null
        });
        console.log(`📝 Post created in DB: ${newPost._id}`);

        // now let's call platforms apis to publish a post 

        // for linkedin

        if(platforms.linkedin?.enabled){
            console.log('📤 Attempting LinkedIn post...');

            if(!user.platforms?.linkedin.isConnected){
                newPost.platforms.linkedin.status='failed',
                newPost.platforms.linkedin.error= 'LinkedIn not connected. ' + 'Visit /api/linkedin/auth first';

                console.log('❌ LinkedIn not connected');
            }

            // it means platform is connected now call postTolinkedIn API
            else{
                try{
                    const result = await postLinkedIn(
                        user.platforms.linkedin.accessToken,
                        user.platforms.linkedin.personUrn,
                        platforms.linkedin.content
                    );

                    // update status after post
                    newPost.platforms.linkedin.status   = 'published';
                    newPost.platforms.linkedin.postId   = result.id;
                    newPost.platforms.linkedin.postedAt = new Date();
                    newPost.platforms.linkedin.error    = null;

                    console.log(`✅ LinkedIn posted: ${result.id}`)
                }
                catch (err) {
                    // ❌ LinkedIn API call failed
                    newPost.platforms.linkedin.status = 'failed';
                    newPost.platforms.linkedin.error  = err.message;

                    console.error(`❌ LinkedIn failed: ${err.message}`);
                }
            }
        }
        // lets calculate overallstatus
        newPost.overallStatus = postValidation.deterMineOverallStatus(newPost.platforms)

        // now save post into database 
        await newPost.save();
        console.log(`💾 Post saved with status: ${newPost.overallStatus}`);    
        
        // return response message
        const message = {
            published:'Posted to LinkedIn  🎉',
            failed:'Failed to Post on LinkedIn  ❌',
            partial:'Post on Some Platform ⚠️'
        }

        return res.status(201).json({
            success:newPost.overallStatus !=='failed',
            overallStatus:newPost.overallStatus,
            message:message[newPost.overallStatus],
            postId:newPost._id,
            platforms:{
                linkedin:{
                    status:newPost.platforms.linkedin.status,
                    postId:newPost.platforms.linkedin.postId,
                    error:newPost.platforms.linkedin.error,
                    postedAt:newPost.platforms.linkedin.postedAt
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

const allPublishedPost = async (req, res) => {
}

const allPendingPost = async (req, res) => {

}
module.exports = { createPost, allPublishedPost, allPendingPost };
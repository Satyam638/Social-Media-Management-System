const { schedule } = require('node-cron');
const postModel = require('../model/post.model');
const userModel = require('../model/user.model');
const mongoose = require('mongoose');


const systemAnalyticsDashboard = async (req, res) => {

    try {
        const userId = req.user.id;
        const objId = new mongoose.Types.ObjectId(userId);

        const [
            overviewResult,
            platformResult,
            timelineResult,
            successResult,
            recentResult,
            userResult

            // calling all database queries concurrent to save server's time and fatser response
        ] = await Promise.all([

            // Query 1 -> overview Result
            postModel.aggregate([
                {
                    // only want document of current loggedin user
                    $match: {userId: objId}
                },
                {
                    // now group all document of logged in user
                    $group: {
                        _id: null,
                        // count each docuement
                        total: { $sum: 1 },
                        // from the grouped document count all the published post
                        published: {
                            $sum: {
                                $cond: [
                                    { $eq: ['$overallStatus', 'published'] },
                                    1,
                                    0
                                ]
                            }
                        },
                        // from the grouped document count all the failed post
                        failed: {
                            $sum: {
                                $cond: [
                                    { $eq: ['$overallStatus', 'failed'] },
                                    1,
                                    0
                                ]
                            }
                        },
                        // from the grouped document count all the partial post
                        partial: {
                            $sum: {
                                $cond: [
                                    { $eq: ['$overallStatus', 'partial'] },
                                    1,
                                    0
                                ]
                            }
                        },
                        // from the grouped document count all the draft post
                        draft: {
                            $sum: {
                                $cond: [
                                    { $eq: ['$overallStatus', 'draft'] },
                                    1,
                                    0
                                ]
                            }
                        }
                    }
                }
            ]),

            // Query 2 find platforms wise ditribution data
            postModel.aggregate([
                {
                    $match: {
                        userId: objId
                    }
                },
                {
                    // group all post data of logged in user
                    $group: {
                        _id: null,
                        // count total published post on linkedin
                        Linkedin: {
                            $sum: {
                                $cond: [
                                    { $eq: ['$platforms.linkedin.enabled', true] },
                                    1,
                                    0
                                ]
                            }
                        },
                        // count total published post on facebook
                        Facebook: {
                            $sum: {
                                $cond: [
                                    { $eq: ['$platforms.facebook.enabled', true] },
                                    1,
                                    0
                                ]
                            }
                        },
                        // count total published post on instagram
                        Instagram: {
                            $sum: {
                                $cond: [
                                    { $eq: ['$platforms.instagram.enabled', true] },
                                    1,
                                    0
                                ]
                            }
                        }
                    }
                }
            ]),

            // Query 3 find last 30 days post data
            postModel.aggregate([
                {
                    $match: {
                        userId: objId,
                        // set date into 30 days ago to find last 30 days data
                        createdAt: {
                            $gte: new Date(
                                new Date().setDate(
                                    new Date().getDate() - 30
                                )
                            )
                        }
                    }
                },
                {
                    $group: {
                        _id: {
                            $dateToString: {
                                format: '%Y-%m-%d',
                                // group all post data of logged in user based on last 30 days posting data
                                date: '$createdAt' 
                            }
                        },
                        count: {
                            $sum: 1
                        }
                    }
                },
                // sort all post data from ascending order
                {
                    $sort: {
                        _id: 1
                    }
                }
            ]),

            // Query 4 find platform based success rate
            postModel.aggregate([
                {
                    $match: {
                        userId: objId
                    }
                },
                {
                    $group: {
                        _id: null,
                        // find total linkedin post created
                        linkedInTotal: {
                            $sum: {
                                $cond: [
                                    { $eq: ['$platforms.linkedin.enabled', true] },
                                    1,
                                    0
                                ]
                            }
                        },
                        //find only publish data of linkedin
                        linkedInPublished: {
                            $sum: {
                                $cond: [
                                    { $eq: ['$platforms.linkedin.status', 'published'] },
                                    1,
                                    0
                                ]
                            }
                        },
                        // find total facebook post created
                        facebookTotal: {
                            $sum: {
                                $cond: [
                                    { $eq: ['$platforms.facebook.enabled', true] },
                                    1,
                                    0
                                ]
                            }
                        },
                        //find only publish data of facebook
                        facebookPublished: {
                            $sum: {
                                $cond: [
                                    { $eq: ['$platforms.facebook.status', 'published'] },
                                    1,
                                    0
                                ]
                            }
                        },
                        // find total instagram post created
                        instagramTotal: {
                            $sum: {
                                $cond: [
                                    { $eq: ['$platforms.instagram.enabled', true] },
                                    1,
                                    0
                                ]
                            }
                        },
                        //find only publish data of instagram
                        instagramPublished: {
                            $sum: {
                                $cond: [
                                    { $eq: ['$platforms.instagram.status', 'published'] },
                                    1,
                                    0
                                ]
                            }
                        }
                    }
                }
            ]),

            // Query 5 find recent 10 posts
            await postModel
            .find({userId})
            .sort({createdAt:-1})
            .limit(10)
            .select('overallStatus platforms postedAt createdAt scheduledAt imageUrl'),

            // Query 6: user Data
            await userModel
            .findById(userId)
            .select('name email platforms')

        ]);

        // Query 1 result -->if query return then fetch data from overviewResult array 0s index else store everything 0 to show proper reponse to user UX
        const overview = overviewResult[0] || {
            total:0,
            published:0,
            failed:0,
            partial:0,
            draft:0,
            scheduled:0
        }
        // also remove id as mongodb always returnn data with id so we remove it because we do't need in frontend
        delete overview._id

        // Query 4 result --> calculate success rate we simply used percentage formula dn give its round percentage with 0 decimal value
        overview.successRate = overview.total > 0 ? Math.round((overview.published/overview.total)*100):0;

        // Query 2 --> platformResult
        const platforms = platformResult[0]  || {
            linkedin:0,
            facebook:0,
            instagram:0
        };
        // remove id
        delete platforms._id;

        // Query 3 --> 30 days ago data
        const timeline = timelineResult.map(item=>({
            date:item.id,
            count:item.count
        }));

        //Query 4 --> calculate platform based success rate  
        const sr = successResult[0] || {};

        const successRates = {

            linkedin :{
                total: sr.linkedInTotal || 0,
                published : sr.linkedInPublished || 0,
                rate: sr.linkedInTotal > 0 ? Math.round((sr.linkedInPublished/sr.linkedInTotal)*100):0
            },
            facebook :{
                total: sr.facebookTotal || 0,
                published : sr.facebookPublished || 0,
                rate: sr.facebookTotal > 0 ? Math.round((sr.facebookPublished/sr.facebookTotal)*100):0
            },
            linkedin :{
                total: sr.instagramTotal || 0,
                published : sr.instagramPublished || 0,
                rate: sr.instagramTotal > 0 ? Math.round((sr.instagramPublished/sr.instagramTotal)*100):0
            }
        }

        const connectedPlatforms = {
            linkedin: userResult?.platforms?.linkedin?.isConnected || false,
            facebook: userResult?.platforms?.facebook?.isConnected || false,
            instagram: userResult?.platforms?.instagram?.isConnected || false,
        }
        return res.status(200).json({
            success:true,
            data:{
                overview,
                platforms,
                timeline,
                successRates,
                recentPosts: recentResult,
                connectedPlatforms,
                generatedAt: new Date()
            }
        });
    }
    catch (error) {
        console.error('Analytics error:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to fetch analytics'
        });
    }
}

module.exports = { systemAnalyticsDashboard };
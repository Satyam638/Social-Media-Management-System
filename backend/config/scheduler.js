const cron = require('node-cron');
const postController = require('../controller/post.controllers');
const userModel = require('../model/user.model');
const postModel = require('../model/post.model');


const startScheduler = () => {

    // run every minute
    cron.schedule('* * * * *', async () => {

        console.log(
            `[${new Date().toISOString()}] Cron checking...`
        );

        try {

            const now = new Date();
            // find all scheduled posts due
            const duePosts = await postModel.find({
                overallStatus: 'draft',
                scheduledAt: { $lte: now }
            });

            if (duePosts.length === 0) {
                console.log('No Post Pending');
                return;
            }
            console.log(
                `📬 ${duePosts.length} post(s) due`
            );

            // publish all due posts
            await Promise.allSettled(

                duePosts.map(async (post) => {
                    const user = await userModel.findById(
                        post.userId
                    );

                    if (!user) {
                        post.overallStatus = 'failed';
                        await post.save();
                        return;
                    }
                    // publish to platforms
                    await postController.publishToPlatforms(
                        post,
                        user
                    );
                })
            );

        } catch (err) {

            console.error(
                `❌ Cron error: ${err.message}`
            );
        }

    });

    console.log(
        '✅ Scheduler started — checking every minute'
    );
};

module.exports = { startScheduler };
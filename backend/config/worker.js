const {Worker} = require('bullmq');
const postModel = require('../model/post.model');
const {publishToPlatforms} = require('../controller/post.controllers');
const userModel = require('../model/user.model');
const redisConnection = require('./redis');


// this processor function will run for every job worker will pick up
// and job.data have everything we saved when adding the job 
const processSchedulesPost = async(job) => 
{
    console.log(`\n Processing job ${job.id}`);
    console.log(`POST ID: ${job.data.postId}`);
    console.log(`USER ID: ${job.data.userId}`);
    console.log(`Attempt : ${job.attemptsMade + 1}`);

    const {postId, userId} = job.data;


    // now kets fetch post from the mongodb document

    const post = await postModel.findById(postId);

    if(!post){
        console.log(`Post not Found with ${postId}`);
        throw Error(`Post not Found with ${postId}`);
    }

    // check post is published or not 
    if(post.overallStatus !== 'draft'){
        console.log(`⚠️ Post already processed: ${post.overallStatus}`);
        return { skipped: true, status: post.overallStatus };
    }
    // not is post in draft mode then find token from user's document to post on their respective platforms

    const user = await userModel.findById(userId);

    if(!user) {
        throw Error(`User not Found with ${userId}`);
    }
    // lets call publishToPlatforms function which call platform specific api to publish
    await publishToPlatforms(post,user);
    console.log(`Job Complete: ${post.overallStatus}`);

    return {
        postId:post._id,
        overallStatus: post.overallStatus
    };
};

// create worker
const createWorker = () =>{
    const worker = new Worker(
        'post-scheduler', // the worker will fetch job from this queues
        processSchedulesPost, // then worker worker will perform job on this function for each function
        {
            connection:redisConnection,
            concurrency:5 // perform 5 job simuntaneouly which prevent overloading platform APIs
        }
    );

    // worker event listeners
    worker.on('completed', (job, result) =>{
        console.log(`Job ${job.id} completed:`, result);
    });

    worker.on('failed',(job,err) =>{
        console.error(`Job ${job.id} failed after ${job.attemptsMade} attempts:`, err.message);

        if(job.attemptsMade >= job.opts.attempts){
            postModel.findByIdAndUpdate(job.data.postId,{
                overallStatus:'failed'
            }).catch(console.error)
        }
    });
    worker.on('error',(err) =>{
        console.error('Worker error: ', err);
    })
    console.log('✅ BullMQ Worker started');
    return worker;
}

module.exports = {createWorker};
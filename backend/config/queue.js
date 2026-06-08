const {Queue} = require('bullmq');
const redisConnection = require('../config/redis');

// this queue is hold all scheduled post
const postQueue = new Queue('post-scheduler',{

    connection:redisConnection, //connected to redis

    defaultJobOptions:{
        attempts:3, //max attempts 3 times when post failed to post

        backoff:{
            type:'exponential',
            delay:2000 //retry attemps with the 2 second into current time
        },
        removeOnComplete:{
            count:100 //keep only last 100 jobs published post data
        },
        removeOnFail:{
            count:50 // keep only last 50 failed post so that inspect and retry to post
        }
    }
});

console.log('Post queue created');

module.exports = {postQueue};
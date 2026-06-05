const rateLimit = require('express-rate-limit');


const createLimiter = (windowMinutes,maxRequests,message) =>{
    return ({
        windowMs:windowMinutes*60*1000, // time window
        max:maxRequests, //max req allowed
        message:{
            success:false,
            error: message,
            retryAfter: `${windowMinutes} minutes`
        },
        // this above response will return when request exceed
        standardHeaders:true,
        legacyHeaders:false,
        // this below function will run when the limit is exceed
        handler:(req,res,next, options) =>{
            console.warn(`Rate limit exceeded: ${req.ip} -> ${req.path}`);
            res.status(429).json(options.message);
        }
    });
}

// different limiters for different routes 
// it allows 100 request for 15 minutes in all routes
const generalLimiter = rateLimit(createLimiter(
    15, //15 minutes
    100, //100 request 
    'Too many request. Please try again in 15 minutes.'
));
// login limiter which allows only 5 request in 1 hr
const authLimiter = rateLimit(createLimiter(
    60,
    5,
    'Too many login attempts. Please try again in 1 hour.'
));
// register Limiter which allows 3 request in 1 hr
const regLimiter = rateLimit(createLimiter(
    60,
    3,
    'Too many login attempts. Please try again in 1 hour.'
));
// post limiter will allow only 30 request in 1 hr
const postLimiter = rateLimit(createLimiter(
    60,
    30,
    'Post limit reached. You can create 30 posts per hour.'
));
// ai caption limiter allows 20 request in 1 hr
const aiLimiter = rateLimit(createLimiter(
    60,
    20,
    'AI generation limit reached. Please try again in 1 hour.'
));
// oauth connect limiter allows 10 oauth request in 1 hr (platforms)
const oauthLimiter = rateLimit(createLimiter(
    60,    // 60 minute window
    10,    // 10 attempts
    'Too many connection attempts. Please try again in 1 hour.'
));

module.exports = {
    generalLimiter,
    regLimiter,
    postLimiter,
    aiLimiter,
    oauthLimiter,
    authLimiter
}; 
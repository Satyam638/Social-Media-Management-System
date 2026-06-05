const express = require('express');
const {generatePostCaptions} = require('../controller/ai.controllers');
const route = express.Router();
const isValid = require('../middleware/validation.middleware');
const ratelimitter = require('../middleware/rateLimiter.middleware');
const inputValidation = require('../middleware/inputValidation.middleware');
const {sanitizeAll} = require('../middleware/sanitize.middleware');


route.use(sanitizeAll);


route.post('/generate-captions',
    isValid.isValidUser,
    ratelimitter.aiLimiter,
    inputValidation.validateGenerateCaptions,
    generatePostCaptions)

module.exports =  route;
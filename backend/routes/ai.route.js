const express = require('express');
const {generatePostCaptions} = require('../controller/ai.controllers');
const route = express.Router();


route.post('/generate-captions', generatePostCaptions)

module.exports =  route;
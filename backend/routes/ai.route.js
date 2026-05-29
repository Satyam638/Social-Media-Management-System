const express = require('express');
const aiController = require('../controller/ai.controllers');
const route = express.Router();


route.post('/generate-post', aiController.generatePost)

module.exports =  route;
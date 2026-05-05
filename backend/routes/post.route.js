const express = require('express');
const route = express.Router();
const postController = require('../controller/post.controllers');
const isValidUser = require('../middleware/validation.middleware');


route.post('/create-post',
    isValidUser.isValidUser,
    postController.createPost
);


module.exports = route;
const express = require('express');
const route = express.Router();
const postController = require('../controller/post.controllers');
const isValidUser = require('../middleware/validation.middleware');
const upload = require('../config/upload');

route.post('/create-post',
    isValidUser.isValidUser, // tocheck is user logged in or not
    isValidUser.isConnectedtoLinkedIn, // to check either connected to platform or not
    upload.single('image'),
    postController.createPost
);


module.exports = route;
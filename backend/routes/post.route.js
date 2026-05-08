const express = require('express');
const route = express.Router();
const postController = require('../controller/post.controllers');
const isValidUser = require('../middleware/validation.middleware');
const upload = require('../config/upload');

route.post('/create-post',
    isValidUser.isValidUser,
    upload.single('image'),
    postController.createPost
);


module.exports = route;
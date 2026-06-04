const express = require('express');
const route = express.Router();
const {systemAnalyticsDashboard} = require('../controller/systemAnalyticsControllers');
const isvalidUser = require('../middleware/validation.middleware');



route.get('/dashboard', isvalidUser.isValidUser,systemAnalyticsDashboard);

module.exports = route;
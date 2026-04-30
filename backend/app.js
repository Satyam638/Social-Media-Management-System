const express = require('express');
const app = express();
const authRoute = require('../backend/routes/user.route');


// permisssions
app.use(express.json());

// middleware
app.use('/api',authRoute);

module.exports = app;


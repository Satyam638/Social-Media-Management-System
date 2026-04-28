const express = require('express');
const app = express();
const connectDB = require('../backend/config/db');


// permisssions
app.use(express.json());


// connected to DB
connectDB();

// middlewares


// routes


module.exports = app;


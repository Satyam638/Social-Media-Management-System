const express = require('express');
const app = express();
const session = require('express-session');
const authRoute = require('../backend/routes/user.route');
const postRoute = require('../backend/routes/post.route');
const linkedInRoute = require('../backend/platforms/linkedin/linkedinRoute');
// permisssions
app.use(express.json());
// Session middleware (needed to store tokens)
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // set true in production with HTTPS
}));
// middleware
app.use('/api',authRoute);
app.use('/post-api',postRoute);
app.use('/api/linkedin',linkedInRoute);


module.exports = app;



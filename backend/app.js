require("dotenv").config();
const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('../backend/config/swagger');
const session = require('express-session');
const authRoute = require('../backend/routes/user.route');
const postRoute = require('../backend/routes/post.route');
const facebookRoute = require('../backend/platforms/facebook/facebookRoute');
const linkedInRoute = require('../backend/platforms/linkedin/linkedinRoute');
const aiServiceRoute = require('../backend/routes/ai.route');
// permisssions
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: "http://localhost:5173", // frontend URL
  credentials: true
}))
app.use(cookieParser());
// Session middleware (needed to store tokens)
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // set true in production with HTTPS
}));
// middleware
app.use('/api', authRoute);
app.use('/api/posts', postRoute);
app.use('/api/linkedin', linkedInRoute);
app.use('/api/facebook',facebookRoute);
app.use('/api/ai',aiServiceRoute);

// add this after your other middleware
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


module.exports = app;



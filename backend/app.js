// require("dotenv").config();
const express = require('express');
const app = express();

const helmet = require('helmet');
const compression = require('compression');

const { createBullBoard }    = require('@bull-board/api');
const { BullMQAdapter }      = require('@bull-board/api/bullMQAdapter');
const { ExpressAdapter }     = require('@bull-board/express');
const { postQueue }          = require('../backend/config/queue');
const basicAuth            = require('express-basic-auth');

const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('admin/queues');

createBullBoard({
  queues:[new BullMQAdapter(postQueue)],
  serverAdapter
});

app.use('/admin/queues', 
  basicAuth({
        users:     { admin: process.env.BULL_BOARD_PASSWORD || 'admin123' },
        challenge: true
    })
  ,serverAdapter.getRouter());
// goto http://localhost:3000/admin/queues to see all jobs visually

const cors = require('cors');
const cookieParser = require('cookie-parser');

const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('../backend/config/swagger');
const session = require('express-session');

const authRoute = require('../backend/routes/user.route');
const postRoute = require('../backend/routes/post.route');
const analyticsRoute = require('../backend/routes/systemAnalytics.route');
const facebookRoute = require('../backend/platforms/facebook/facebookRoute');
const linkedInRoute = require('../backend/platforms/linkedin/linkedinRoute');
const aiServiceRoute = require('../backend/routes/ai.route');
const uploadRoute = require('../backend/routes/upload.route');

//run for all routes
const ratelimiter  = require('../backend/middleware/rateLimiter.middleware');
// permisssions
// use to set security headers
app.use(helmet());
app.use(compression());
app.use(ratelimiter.generalLimiter);
app.use(express.json({ limit: '10mb' }));
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
  cookie: {
        secure:   process.env.NODE_ENV === 'production',
        httpOnly: true,
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge:   7 * 24 * 60 * 60 * 1000
    } // set true in production with HTTPS
}));
// middleware
app.use('/api', authRoute);
app.use('/api/posts', postRoute);
app.use('/api/linkedin', linkedInRoute);
app.use('/api/facebook',facebookRoute);
app.use('/api/ai',aiServiceRoute);
app.use('/api/analytics',analyticsRoute);
app.use('/api/upload',uploadRoute);

// global error handler
app.use((err,req,res,next) =>{
  console.log('Unhandled Error:',err);
  res.status(500).json({success:false,message:"Internal Server Error"});
})

// add this after your other middleware
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


module.exports = app;



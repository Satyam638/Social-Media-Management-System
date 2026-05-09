const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const authRoute = require('../backend/routes/user.route');
const postRoute = require('../backend/routes/post.route');
const linkedInRoute = require('../backend/platforms/linkedin/linkedinRoute');
// permisssions
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: "http://localhost:5173", // frontend URL
  credentials: true
}))
app.use(cookieParser());
app.get('/', (req, res) => {
  res.send(`
    <h2>Login</h2>

    <form method="POST" action="api/auth/login">
      <input name="email" placeholder="email" />
      <input name="password" type="password" placeholder="password" />
      <button type="submit">Login</button>
    </form>

    <br/>

    <a href="/api/linkedin/auth">Connect LinkedIn</a>
  `);
});
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


module.exports = app;



# OneSocial — Social Media Management System

<img width="1348" height="605" alt="oneSocialHomepge" src="https://github.com/user-attachments/assets/a45d810f-7fdb-4399-9392-b9291dcf92bd" />
> Write once. Publish everywhere.

**Live Demo →** https://social-media-management-system-mu.vercel.app

OneSocial is a full-stack social media management platform that lets you connect LinkedIn, Facebook, and Instagram — then create, schedule, and publish content across all of them from a single dashboard. AI-powered caption generation included.

---

## The Problem

Managing multiple social media accounts means:
- Opening LinkedIn, writing a post, publishing.
- Switching to Facebook, rewriting it, publishing.
- Opening Instagram, adjusting it again, publishing.
- Repeating this every single day.

OneSocial eliminates that by letting you write once and publish everywhere — with AI captions tailored per platform and scheduling so posts go live even while you sleep.

---

## Live Demo

**→** https://social-media-management-system-mu.vercel.app

> Note: Full public access is coming in 2-3 weeks once Meta completes app verification. You can register and explore the dashboard in the meantime.

---

## Features

### Authentication
- JWT-based login with secure HTTP-only cookies
- OTP email verification on registration
- Role-based access control (Admin / User)
- Secure session management

### Social Media Integration
- LinkedIn — connect via OAuth 2.0, publish posts with or without images
- Facebook — connect Pages via OAuth 2.0, publish posts
- Instagram — publish image posts via Facebook Graph API
- Tokens stored securely per user in MongoDB

### AI Caption Generator
<img width="1352" height="604" alt="oneSocialDashboardPage" src="https://github.com/user-attachments/assets/dda3eeeb-1720-4f08-aa0b-c0dd728ac927" />

- Powered by Groq AI
- Enter a topic and tone — get platform-specific captions in under 60 seconds
- Separate caption output for LinkedIn, Facebook, and Instagram

### Post Scheduling
- Pick any future date and time
- Cron jobs automatically publish at the scheduled time
- Cancel scheduled posts before they go live
- View scheduled and published post history

### Media Management
- Upload images directly from the composer
- Images stored and served via Cloudinary
- Attach images to any platform post

### Analytics Dashboard
<img width="1352" height="607" alt="oneSocialAnalytics" src="https://github.com/user-attachments/assets/b820a825-1813-4b37-a16e-802e3db80448" />

- Track total posts per platform
- View 30-day publishing history
- Monitor success and failure rates

---

## Tech Stack

**Backend**
- Node.js + Express.js
- MongoDB + Mongoose
- Redis (caching)
- JWT + bcryptjs
- Nodemailer (OTP emails)
- node-cron (scheduled publishing)
- Multer + Cloudinary (media uploads)

**Frontend**
- React.js (Vite)
- Tailwind CSS
- Axios

**Integrations**
- LinkedIn API (OAuth 2.0)
- Facebook Graph API (OAuth 2.0)
- Instagram Graph API
- Groq AI API

**Deployment**
- Frontend → Vercel
- Backend → Render

---

## Project Structure

```
Social-Media-Management-System/
├── frontend/                  # React + Vite frontend
│   ├── src/
│   │   ├── pages/             # Login, Register, Dashboard, Home, etc.
│   │   ├── services/          # Axios API instance
│   │   └── main.jsx
│   └── .env
│
└── backend/                   # Node.js + Express backend
    ├── model/                 # MongoDB models
    ├── middleware/            # Auth, validation
    ├── linkedin/              # LinkedIn OAuth + posting
    ├── facebook/              # Facebook + Instagram OAuth + posting
    ├── routes/                # All API routes
    ├── controllers/           # Auth, posts, AI, upload
    └── server.js
```

---

## Getting Started

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- Redis
- Accounts: LinkedIn Developer App, Facebook Developer App, Groq AI, Cloudinary

### 1. Clone the repository

```bash
git clone https://github.com/Satyam638/Social-Media-Management-System.git
cd Social-Media-Management-System
```

### 2. Setup Backend

```bash
cd backend
npm install
```

Create a `.env` file in `/backend`:

```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
SECRET_KEY=your_jwt_secret

# Email (OTP)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# LinkedIn
LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret
LINKEDIN_REDIRECT_URI=http://localhost:3000/api/linkedin/callback

# Facebook & Instagram
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret
FACEBOOK_REDIRECT_URI=http://localhost:3000/api/facebook/callback

# Groq AI
GROQ_API_KEY=your_groq_api_key

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Redis
REDIS_URL=your_redis_url

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

```bash
npm start
```

### 3. Setup Frontend

```bash
cd frontend
npm install
```

Create a `.env` file in `/frontend`:

```env
VITE_API_URL=http://localhost:3000
```

```bash
npm run dev
```

Open http://localhost:5173

---

## How It Works

1. Register and verify your email via OTP
2. Connect LinkedIn, Facebook, and Instagram using OAuth
3. Write content manually or generate AI captions by entering a topic and tone
4. Upload an image if needed
5. Choose to publish immediately or schedule for later
6. Cron jobs handle scheduled publishing automatically
7. View all posts and analytics from the dashboard

---

## Screenshots
<img width="1350" height="605" alt="image" src="https://github.com/user-attachments/assets/68f5de1e-a1ee-43b0-a012-34fca898577c" />
---
## Roadmap

- [ ] Twitter/X integration
- [ ] Reddit integration
- [ ] Team collaboration and multi-user workspaces
- [ ] Post performance analytics (likes, comments, reach)
- [ ] Advanced AI content suggestions
- [ ] Mobile app

---

## Author

**Satyam Gupta** — Backend Developer | Node.js Developer | Full Stack Developer

- GitHub: [@Satyam638](https://github.com/Satyam638)
- Email: satyamgupta55591@gmail.com
- LinkedIn: [Connect with me](https://www.linkedin.com/in/your-linkedin-handle)

Open to work — if your team is hiring Node.js / Backend / Full Stack developers, feel free to reach out!

If you found this project useful, please ⭐ the repository — it helps a lot!

---

## License

MIT License — free to use and modify.

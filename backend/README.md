# FinIQD

A full-stack learning platform that includes user authentication, quizzes, comments, notes, OTP verification, and more.

---

## 🚀 Tech Stack

| Layer     | Technology                 |
|-----------|----------------------------|
| Frontend  | React + Vite               |
| Backend   | Node.js + Express          |
| Database  | MongoDB Atlas              |
| Auth      | Google OAuth + JWT         |
| Email     | Nodemailer (OTP-based)     |
| Deployment| Render (backend), Netlify (frontend) |

---

## 📁 Folder Structure

FinIQD/
├── backend/ # Express API
│ ├── routes/
│ ├── controllers/
│ ├── models/
│ └── index.js
├── frontend/ # React + Vite app
│ ├── src/
│ ├── public/
│ └── vite.config.js
└── README.md


---

## 🔧 Backend Features

- MongoDB Atlas (cloud DB)
- Google OAuth and JWT-based login
- Comments with upvote/downvote
- User quiz score tracking
- User notes (create, edit, delete)
- Profile management (with OTP password change)
- Upload and serve images via `/uploads`
- OTP verification using Gmail SMTP

### `.env` example (backend):
PORT=2100
MONGO_URL=your_mongo_atlas_uri
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
OTP_EMAIL=your_gmail_address
OTP_APP_PASSWORD=your_app_password

---

## ⚛️ Frontend Features

- Dynamic theming (light/dark mode)
- Topic navigation by level/topic ID
- Quiz interface with score saving
- Profile management (username, profession, password)
- OTP modal for password change
- Google login support
- Toasts with SweetAlert2 for feedback

### `.env` example (frontend):
VITE_BACKEND_URL=https://your-backend-url.onrender.com

---

## 🌍 Deployment

| Component | Platform | URL |
|-----------|----------|-----|
| Backend   | Render   | `https://your-backend-url.onrender.com` |
| Frontend  | Netlify  | `https://your-frontend-site.netlify.app` |
| Database  | MongoDB Atlas | Used globally |

---

## 🧪 Local Setup

### Backend
```bash
cd backend
npm install
npx nodemon index.js

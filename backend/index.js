import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import session from 'express-session';
import passport from 'passport';

import authRoutes from './routes/authRoute.js';
import googleAuthRoute from './routes/googleAuthRoute.js';
import moduleRoutes from './routes/moduleRoute.js';
import quizScoreRoutes from './routes/QuizscoreRoute.js';
import commentRoutes from './routes/comments.js';
import noteRoutes from './routes/noteRoute.js';
import userRoutes from './routes/userRoute.js';

import { errorHandler } from './middlewares/errorMiddleware.js';
import './config/passportConfig.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
mongoose.set('strictQuery', false);

const isProd = process.env.NODE_ENV === 'production';
const PORT = process.env.PORT || 2100;

// ✅ Use correct frontend URL from environment
const FRONTEND_URL = process.env.FRONTEND_URL || (isProd
  ? 'https://fin-iq.netlify.app'
  : 'http://localhost:5173');

// ✅ CORS setup
app.use(cors({
  origin: FRONTEND_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
}));

app.use(express.json());

// ✅ Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ Session setup
app.use(session({
  secret: process.env.SECRET || 'your_secret_key',
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

// ✅ Routes
app.use('/api/auth', authRoutes);
app.use('/api/auth', googleAuthRoute);
app.use('/api/levels', moduleRoutes);
app.use('/api/quiz-scores', quizScoreRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/users', userRoutes);

// ✅ Health check
app.get('/', (req, res) => {
  res.send('✅ Server is up and running!');
});

// ❌ 404 handler
app.use((req, res) => {
  res.status(404).json({ message: '❌ Route not found' });
});

// ✅ Global error handler
app.use(errorHandler);

// ✅ DB connect and launch
mongoose.connect(process.env.MONGO_URL)
  .then(() => {
    console.log('✅ Connected to MongoDB Atlas');
    app.listen(PORT, () => {
      const serverURL = isProd
        ? process.env.BACKEND_URL || 'https://finiqd-backend.onrender.com'
        : `http://localhost:${PORT}`;

      console.log(`🚀 Server running at ${serverURL}`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// backend/routes/googleAuthRoute.js
import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
const router = express.Router();

// Load environment variable
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// Step 1: Start Google OAuth
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email'],
}));

// Step 2: Callback
router.get('/google/callback', passport.authenticate('google', {
  failureRedirect: `${FRONTEND_URL}/login`,
}), (req, res) => {
  const user = req.user;

  const token = jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );

  res.redirect(`${FRONTEND_URL}/dashboard?token=${token}`);
});

export default router;

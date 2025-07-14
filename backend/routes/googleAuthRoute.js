// backend/routes/googleAuthRoute.js
import express from 'express';
import passport from 'passport';
const router = express.Router();

// Step 1: Start Google OAuth
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email'],
}));

// Step 2: Callback
router.get('/google/callback', passport.authenticate('google', {
  failureRedirect: 'http://localhost:3000/login',
}), (req, res) => {
  // Send token to frontend or redirect
  const token = 'JWT_TOKEN_IF_NEEDED';
  res.redirect(`http://localhost:3000/dashboard?token=${token}`);
});

export default router;

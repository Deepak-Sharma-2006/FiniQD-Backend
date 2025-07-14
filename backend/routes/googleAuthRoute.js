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
  failureRedirect: 'https://finiqd-frontend.netlify.app/login', // ✅ updated
}), (req, res) => {
  const token = 'JWT_TOKEN_IF_NEEDED'; // Replace with real JWT if needed

  res.redirect(`https://finiqd-frontend.netlify.app/dashboard?token=${token}`); // ✅ updated
});

export default router;

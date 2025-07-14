import express from 'express';
import {
  registerUser,
  loginUser,
  googleLogin,
  sendOtpForPasswordChange,
  verifyOtpAndUpdatePassword,
  updateProfile
} from '../controllers/authController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/google-login', googleLogin);
router.post('/send-otp', sendOtpForPasswordChange);
router.post('/verify-otp', verifyOtpAndUpdatePassword);

// Protected route
router.put('/update-profile', protect, updateProfile);

export default router;

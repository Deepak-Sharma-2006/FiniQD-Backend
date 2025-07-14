import express from 'express';
import { getUserProfile, updateUserProfile, uploadProfileImage } from '../controllers/userController.js';
import { authenticateUser } from '../middlewares/authenticateUser.js';
import multer from 'multer';

const router = express.Router();

// Multer setup for image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Changed from 'backend/uploads/' to 'uploads/'
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Get user profile
router.get('/me', authenticateUser, getUserProfile);
// Update user profile (text fields)
router.put('/me', authenticateUser, updateUserProfile);
// Upload profile image
router.post('/me/upload', authenticateUser, upload.single('image'), uploadProfileImage);

export default router;

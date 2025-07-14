// ✅ authController.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import User from '../models/userModel.js';
import Otp from '../models/Otp.js'; // 🔁 new line


dotenv.config();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const otpStore = new Map();

export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, dob, profession } = req.body;

    if (!name || !email || !password || !dob || !profession) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      dob: new Date(dob),
      profession,
      role: 'user'
    });

    const token = jwt.sign(
      { userId: user._id, role: user.role, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        dob: user.dob,
        profession: user.profession,
        role: user.role
      }
    });
  } catch (err) {
    console.error('[Register] Error:', err);
    next(err);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    user.password = undefined;

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        dob: user.dob,
        profession: user.profession,
        role: user.role
      }
    });
  } catch (err) {
    console.error('[Login] Error:', err);
    next(err);
  }
};

export const googleLogin = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ message: 'Google token is required' });

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const { email, name } = ticket.getPayload();
    if (!email) return res.status(400).json({ message: 'Google account missing email' });

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        name,
        email,
        password: '',
        dob: new Date(),
        profession: 'student',
        role: 'user'
      });
    }

    const jwtToken = jwt.sign(
      { userId: user._id, role: user.role, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(200).json({
      message: 'Google login successful',
      token: jwtToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        dob: user.dob,
        profession: user.profession,
        role: user.role
      }
    });
  } catch (err) {
    console.error('[Google Login] Error:', err);
    res.status(401).json({ message: 'Invalid Google token or login failed' });
  }
};

const sendOtp = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email is required' });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 min

  try {
    // Replace existing OTP for this email
    await Otp.findOneAndUpdate(
      { email },
      { otp, expiresAt },
      { upsert: true, new: true }
    );

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.OTP_EMAIL,
        pass: process.env.OTP_APP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: process.env.OTP_EMAIL,
      to: email,
      subject: 'Your OTP Code',
      html: `<p>Your OTP is: <b>${otp}</b>. It expires in 5 minutes.</p>`,
    });

    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (err) {
    console.error('[Send OTP Error]', err);
    res.status(500).json({ message: 'Failed to send OTP' });
  }
};


const verifyOtpAndChangePassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  if (!email || !otp || !newPassword) {
    return res.status(400).json({ message: 'Email, OTP and new password are required' });
  }

  try {
    const otpEntry = await Otp.findOne({ email });

    if (!otpEntry || otpEntry.otp !== otp || new Date() > otpEntry.expiresAt) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    const updatedUser = await User.findOneAndUpdate(
      { email },
      { password: hashedPassword },
      { new: true }
    );

    // Remove OTP after use
    await Otp.deleteOne({ email });

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error('[Verify OTP Error]', err);
    res.status(500).json({ message: 'Server error while verifying OTP' });
  }
};


export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { name, profession } = req.body;

    if (!name || !profession) {
      return res.status(400).json({ message: 'Name and profession are required' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, profession },
      { new: true, timestamps: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      message: 'Profile updated successfully',
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        dob: updatedUser.dob,
        profession: updatedUser.profession,
        role: updatedUser.role
      }
    });
  } catch (err) {
    console.error('[Update Profile] Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const sendOtpForPasswordChange = sendOtp;
export const verifyOtpAndUpdatePassword = verifyOtpAndChangePassword;

import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: 3,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address',
      ],
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false, // never return password by default
    },
    dob: {
      type: Date,
      required: [true, 'Date of birth is required'],
    },
    profession: {
      type: String,
      required: true,
      enum: ['student', 'business', 'corporate'],
    },
    role: {
      type: String,
      default: 'user',
      enum: ['user', 'admin'],
    },
    phone: { type: String },
    mobile: { type: String },
    address: { type: String },
    pfp: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);

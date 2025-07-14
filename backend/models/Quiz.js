import mongoose from 'mongoose';

const quizSchema = new mongoose.Schema({
    userEmail: { type: String, required: true },
    levelId: { type: String, required: true },
    topicId: { type: String, required: true },
    score: { type: Number, required: true },
    total: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now }
});

// Prevent duplicates (one quiz per topic per user)
quizSchema.index({ userEmail: 1, topicId: 1 }, { unique: true });

// Explicitly set collection name to avoid 'quizscores' or others
const Quiz = mongoose.model('Quiz', quizSchema, 'quizzes');

export default Quiz;
// models/topicModel.js
import mongoose from 'mongoose';

const topicSchema = new mongoose.Schema({
  customId: { type: String, required: true, unique: true },
  title: String,
  summary: String,
  content: String,
  image: String,
  additionalImages: [String],
  videoLinks: [String],
  quiz: [
    {
      question: String,
      options: [String],
      correctAnswer: String,
    },
  ],
}, { timestamps: true });

// ✅ This function dynamically returns a model for a level collection (e.g., 'level-1')
export function getTopicModelByLevel(levelName) {
  return mongoose.model(levelName, topicSchema, levelName);
}

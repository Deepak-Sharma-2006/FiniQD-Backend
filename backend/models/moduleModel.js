// models/moduleModel.js
import mongoose from 'mongoose';

const topicSchema = new mongoose.Schema({
  customId: { type: String, required: true }, // Ensure unique across topics when needed
  title: { type: String, required: true },
  summary: String,
  image: String,
  content: String,
  additionalImages: [String],
  videoLinks: [String],
  quiz: [
    {
      question: { type: String, required: true },
      options: [{ type: String }],
      correctAnswer: String,
    }
  ],
});

const levelSchema = new mongoose.Schema({
  level: { type: Number, required: true },
  topics: [topicSchema],
});

const moduleSchema = new mongoose.Schema({
  customId: { type: String, required: true, unique: true },
  seriesTitle: { type: String, required: true },
  levels: [levelSchema],
});

const ModuleContent = mongoose.model('ModuleContent', moduleSchema, 'ModuleContent');
export default ModuleContent;

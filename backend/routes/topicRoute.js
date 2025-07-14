import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

const topicSchema = new mongoose.Schema({
  seriesTitle: String,
  levels: [
    {
      level: Number,
      topics: [
        {
          customId: String,
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
              correctAnswer: String
            }
          ]
        }
      ]
    }
  ]
});

const Series = mongoose.model('Series', topicSchema, 'modules'); // Adjust collection if needed

// 👉 Get list of topics (only customId + title)
router.get('/:level', async (req, res) => {
  const { level } = req.params;

  try {
    const doc = await Series.findOne({ "levels.level": Number(level) }).lean();

    if (!doc) {
      return res.status(404).json({ message: `No data found for level ${level}` });
    }

    const levelObj = doc.levels.find(lvl => lvl.level === Number(level));

    if (!levelObj || !levelObj.topics || levelObj.topics.length === 0) {
      return res.status(404).json({ message: `No topics found for level ${level}` });
    }

    const topics = levelObj.topics.map(t => ({
      customId: t.customId,
      title: t.title,
      topic: t.topic, // Add this if topic property exists in your data
      summary: t.summary, // Include summary in the response
      image: t.image || null // Include image in the response
    }));

    res.json(topics);
  } catch (err) {
    console.error(`❌ Error fetching topics for level ${level}:`, err);
    res.status(500).json({ message: 'Server error' });
  }
});

// 👉 Get full topic data
router.get('/:level/:customId', async (req, res) => {
  const { level, customId } = req.params;

  try {
    const doc = await Series.findOne({ "levels.level": Number(level) }).lean();

    if (!doc) {
      return res.status(404).json({ message: `No data found for level ${level}` });
    }

    const levelObj = doc.levels.find(lvl => lvl.level === Number(level));

    if (!levelObj) {
      return res.status(404).json({ message: `Level ${level} not found` });
    }

    const topic = levelObj.topics.find(t => t.customId === customId);

    if (!topic) {
      return res.status(404).json({ message: `Topic ${customId} not found in level ${level}` });
    }

    res.json(topic);
  } catch (err) {
    console.error(`❌ Error fetching topic ${customId} from level ${level}:`, err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;

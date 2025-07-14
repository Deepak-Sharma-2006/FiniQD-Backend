import { getLevelModel } from '../utils/getLevelModel.js';

export const getTopicsByLevel = async (req, res) => {
  const { level } = req.params;

  try {
    const LevelModel = getLevelModel(level);
    // Fetch all fields needed for the card, including image, summary, topic, title
    const topics = await LevelModel.find({}, {
      customId: 1,
      title: 1,
      topic: 1,
      summary: 1,
      image: 1,
      _id: 0
    });

    if (!topics.length) {
      return res.status(404).json({ message: `No topics found for level-${level}` });
    }

    res.status(200).json(topics);
  } catch (err) {
    console.error(`❌ Error fetching topics for level-${level}:`, err);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const getTopicDetails = async (req, res) => {
  const { level, customId } = req.params;

  try {
    const LevelModel = getLevelModel(level);
    const topic = await LevelModel.findOne({ customId });

    if (!topic) {
      return res.status(404).json({ message: `Topic ${customId} not found in level-${level}` });
    }

    res.status(200).json(topic);
  } catch (err) {
    console.error(`❌ Error fetching topic ${customId} from level-${level}:`, err);
    res.status(500).json({ message: 'Server Error' });
  }
};

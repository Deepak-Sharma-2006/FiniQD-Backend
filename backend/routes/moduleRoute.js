import express from 'express';
import { getLevelModel } from '../utils/getLevelModel.js';
import ModuleContent from '../models/moduleModel.js';

const router = express.Router();

/**
 * GET /api/levels/:level/topics
 * Updated to support nested structure in ModuleContent collection
 */
router.get('/:level/topics', async (req, res) => {
  const { level } = req.params;
  try {
    const LevelModel = getLevelModel(level);
    const docs = await LevelModel.find({}).lean();
    if (!docs || docs.length === 0) {
      return res.status(404).json({ message: `No data found for level-${level}` });
    }
    let allTopics = [];
    // Support both flat and nested (levels[0].topics) structures
    docs.forEach(doc => {
      if (doc.levels && Array.isArray(doc.levels) && doc.levels.length > 0) {
        // Nested structure: topics inside levels[0].topics
        const topicsArr = doc.levels[0].topics || [];
        allTopics = allTopics.concat(
          topicsArr.map(t => ({
            customId: t.customId,
            title: t.title || t.topic,
            summary: t.summary,
            image: t.image || null // <-- include image
          }))
        );
      } else {
        // Flat structure: topic fields at root
        allTopics.push({
          customId: doc.customId,
          title: doc.title || doc.topic,
          summary: doc.summary,
          image: doc.image || null // <-- include image
        });
      }
    });
    if (allTopics.length === 0) {
      return res.status(404).json({ message: `No topics found for level-${level}` });
    }
    res.json(allTopics);
  } catch (err) {
    console.error(`❌ Error fetching topics for level-${level}:`, err);
    res.status(500).json({ message: 'Server Error' });
  }
});

/**
 * GET /api/levels/:level/topics/:customId
 * Updated to support nested structure in ModuleContent collection
 */
router.get('/:level/topics/:customId', async (req, res) => {
  const { level, customId } = req.params;
  try {
    const LevelModel = getLevelModel(level);
    // Find the document with the matching customId
    const doc = await LevelModel.findOne({ customId }).lean();
    if (!doc) {
      return res.status(404).json({ message: `Topic ${customId} not found in level-${level}` });
    }
    // If the topic is nested inside levels[0].topics, extract it
    if (doc.levels && Array.isArray(doc.levels) && doc.levels.length > 0) {
      const topicsArr = doc.levels[0].topics || [];
      const topic = topicsArr.find(t => t.customId === customId);
      if (topic) {
        // Merge top-level fields (like seriesTitle) into topic for frontend, but exclude image
        const { image, ...topicWithoutImage } = topic;
        return res.json({ ...topicWithoutImage, seriesTitle: doc.seriesTitle });
      }
    }
    // If the topic is flat (not nested), return the doc itself without image
    const { image, ...docWithoutImage } = doc;
    return res.json(docWithoutImage);
  } catch (err) {
    console.error(`❌ Error fetching topic ${customId} from level-${level}:`, err);
    res.status(500).json({ message: 'Server Error' });
  }
});

export default router;

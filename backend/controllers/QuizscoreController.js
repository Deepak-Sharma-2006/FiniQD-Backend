import Quiz from '../models/Quiz.js';

export const submitQuizScore = async (req, res) => {
    const { userEmail, levelId, topicId, score, total, attemptType } = req.body;

    console.log('📨 Incoming submission:', req.body);

    try {
        const existingEntry = await Quiz.findOne({ userEmail, topicId });
        if (existingEntry) {
            console.log('⚠️ Duplicate submission detected');
            return res.status(409).json({ message: 'Quiz already submitted for this module.' });
        }

        const quizEntry = new Quiz({
            userEmail,
            levelId,
            topicId,
            score,
            total,
            attemptType: attemptType === 'partial' ? 'partial' : 'complete' // fallback safeguard
        });

        await quizEntry.save();

        console.log('✅ Saved quiz entry:', quizEntry);

        res.status(201).json({ message: 'Quiz score saved successfully', quizEntry });
    } catch (err) {
        console.error('❌ Error saving quiz score:', err);
        res.status(500).json({ message: 'Failed to save quiz score' });
    }
};
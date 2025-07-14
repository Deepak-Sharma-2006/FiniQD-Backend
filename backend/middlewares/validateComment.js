module.exports = (req, res, next) => {
  const { name, text, topicId } = req.body;
  if (!name || !text || !topicId) {
    return res.status(400).json({ message: 'All fields (name, text, topicId) are required.' });
  }
  next();
};

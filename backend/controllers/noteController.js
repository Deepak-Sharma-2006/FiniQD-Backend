import Note from '../models/noteModel.js';

// Get all notes of the logged-in user
export const getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.user.userId }).sort({ createdAt: -1 });
    res.status(200).json(notes);
  } catch (err) {
    res.status(500).json({ message: "Failed to retrieve notes", error: err.message });
  }
};

// Create a new note
export const createNote = async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ message: 'Content is required' });
    }
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ message: 'User authentication failed' });
    }
    const newNote = new Note({
      userId: req.user.userId,
      content
    });
    await newNote.save();
    res.status(201).json(newNote);
  } catch (err) {
    res.status(500).json({ message: "Failed to create note", error: err.message });
  }
};

// Update a note
export const updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const updatedNote = await Note.findOneAndUpdate(
      { _id: id, userId: req.user.userId },
      { content },
      { new: true }
    );
    if (!updatedNote) {
      return res.status(404).json({ message: "Note not found" });
    }
    res.status(200).json(updatedNote);
  } catch (err) {
    res.status(500).json({ message: "Failed to update note", error: err.message });
  }
};

// Delete a note
export const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedNote = await Note.findOneAndDelete({
      _id: id,
      userId: req.user.userId
    });
    if (!deletedNote) {
      return res.status(404).json({ message: "Note not found" });
    }
    res.status(200).json({ message: "Note deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete note", error: err.message });
  }
};

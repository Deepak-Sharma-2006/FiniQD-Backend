import express from 'express';
import {
  getNotes,
  createNote,
  updateNote,
  deleteNote
} from '../controllers/noteController.js';

import { authenticateUser } from '../middlewares/authenticateUser.js';

const router = express.Router();

// Apply auth middleware to all note routes
router.use(authenticateUser);

// Routes
router.get('/', getNotes);              // GET all notes
router.post('/', createNote);           // POST new note
router.put('/:id', updateNote);         // PUT to update a note
router.delete('/:id', deleteNote);      // DELETE a note

export default router;

import express from 'express';
import { createMoodEntry, getMoodEntries, getMoodEntryById } from '../controllers/moodEntryController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Apply the protect middleware to all mood routes
router.use(protect);

// Route: POST /api/mood/add
router.post('/add', createMoodEntry);

// Route: GET /api/mood
router.get('/', getMoodEntries);

// Route: GET /api/mood/:id
router.get('/:id', getMoodEntryById);

export default router;
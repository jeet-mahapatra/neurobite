import MoodEntry from '../models/moodEntryModel.js';

// @desc    Create a new mood entry
// @route   POST /api/mood/add
// @access  Private
export const createMoodEntry = async (req, res) => {
  try {
    const { mood, journal } = req.body;

    // Validation
    if (!mood) {
      return res.status(400).json({ message: 'Mood is required' });
    }

    // Create new mood entry
    const moodEntry = await MoodEntry.create({
      user: req.user._id, // From auth middleware
      mood,
      journal: journal || '',
    });

    if (moodEntry) {
      res.status(201).json(moodEntry);
    } else {
      res.status(400).json({ message: 'Invalid mood entry data' });
    }
  } catch (error) {
    console.error(`Error creating mood entry: ${error.message}`);
    res.status(500).json({ 
      message: 'Server error', 
      error: process.env.NODE_ENV === 'development' ? error.message : undefined 
    });
  }
};

// @desc    Get all mood entries for a user
// @route   GET /api/mood
// @access  Private
export const getMoodEntries = async (req, res) => {
  try {
    const moodEntries = await MoodEntry.find({ user: req.user._id })
      .sort({ createdAt: -1 }); // Most recent first
    
    res.json(moodEntries);
  } catch (error) {
    console.error(`Error fetching mood entries: ${error.message}`);
    res.status(500).json({ 
      message: 'Server error', 
      error: process.env.NODE_ENV === 'development' ? error.message : undefined 
    });
  }
};

// @desc    Get a specific mood entry
// @route   GET /api/mood/:id
// @access  Private
export const getMoodEntryById = async (req, res) => {
  try {
    const moodEntry = await MoodEntry.findById(req.params.id);
    
    // Check if mood entry exists
    if (!moodEntry) {
      return res.status(404).json({ message: 'Mood entry not found' });
    }
    
    // Check if user owns this mood entry
    if (moodEntry.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to access this entry' });
    }
    
    res.json(moodEntry);
  } catch (error) {
    console.error(`Error fetching mood entry: ${error.message}`);
    res.status(500).json({ 
      message: 'Server error', 
      error: process.env.NODE_ENV === 'development' ? error.message : undefined 
    });
  }
};
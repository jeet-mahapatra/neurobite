import mongoose from 'mongoose';

const moodEntrySchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  mood: { 
    type: String, 
    required: true,
    enum: ['happy', 'good', 'neutral', 'sad', 'angry'] // Validates mood values
  },
  journal: { 
    type: String, 
    default: "" 
  },
  predictedMood: { 
    type: String, 
    default: null,
    enum: ['happy', 'good', 'neutral', 'sad', 'angry', null] // Validates predicted mood
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
}, {
  timestamps: true // Adds updatedAt field automatically
});

const MoodEntry = mongoose.model('MoodEntry', moodEntrySchema);
export default MoodEntry;
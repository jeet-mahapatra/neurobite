import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../../utils/api';

const MoodEntry = () => {
  const [selectedMood, setSelectedMood] = useState(null);
  const [journalText, setJournalText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [currentQuote, setCurrentQuote] = useState('');
  
  const navigate = useNavigate();

  // Available moods with emoji and description - matching the backend enum values
  const moods = [
    { emoji: '😄', label: 'Happy', value: 'happy' },
    { emoji: '😊', label: 'Good', value: 'good' },
    { emoji: '😐', label: 'Neutral', value: 'neutral' },
    { emoji: '😞', label: 'Sad', value: 'sad' },
    { emoji: '😠', label: 'Angry', value: 'angry' },
  ];

  // Random motivational quotes
  const motivationalQuotes = [
    "Every emotion is valid and has something to teach you.",
    "Your feelings matter, and it's okay to feel them completely.",
    "Self-awareness is the first step to emotional well-being.",
    "One day at a time. One feeling at a time.",
    "Understanding your emotions gives you power over them."
  ];

  // Set a random quote when component mounts
  useEffect(() => {
    getRandomQuote();
  }, []);

  // Function to get a random quote
  const getRandomQuote = () => {
    const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
    setCurrentQuote(motivationalQuotes[randomIndex]);
  };

  // Handle mood selection
  const handleMoodSelect = (mood) => {
    setSelectedMood(mood);
  };

  // Handle journal text change
  const handleJournalChange = (e) => {
    setJournalText(e.target.value);
  };

  // Show toast notification
  const showToastNotification = (message, type = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  // Handle form submission
  const submitMood = async (e) => {
    e.preventDefault();
    
    // Validate inputs
    if (!selectedMood) {
      showToastNotification('Please select your mood', 'error');
      return;
    }

    // Show loading state
    setIsSubmitting(true);
    
    try {
      // Prepare data to send to backend
      const moodData = {
        mood: selectedMood.value,  // This matches the enum in your model
        journal: journalText       // This will be stored in the journal field
      };

      // Make the actual API call to the backend
      const response = await api.post('/mood/add', moodData);
      
      // Show success message with data from the response
      showToastNotification('Your mood has been recorded successfully!');
      console.log('Mood entry saved:', response.data);
      
      // Reset form after successful submission
      setSelectedMood(null);
      setJournalText('');
      
      // Get a new quote after submission
      getRandomQuote();
      
      // Optional: Redirect to dashboard after short delay
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
      
    } catch (error) {
      console.error('Error submitting mood:', error);
      const errorMessage = error.response?.data?.message || 'Failed to record your mood. Please try again.';
      showToastNotification(errorMessage, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-blue-50 to-white py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto">
        {/* Card container */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl"
        >
          {/* Card header */}
          <div className="bg-gradient-to-r from-primary-500 to-purple-500 p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-bold text-white text-center">How are you feeling today?</h2>
          </div>
          
          {/* Card content */}
          <form onSubmit={submitMood} className="p-4 sm:p-6 space-y-6 sm:space-y-8">
            {/* Mood selector */}
            <div className="space-y-3 sm:space-y-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select your mood
              </label>
              
              {/* Mobile-friendly mood selector */}
              <div className="grid grid-cols-5 gap-1 sm:gap-2">
                {moods.map((mood) => (
                  <button
                    key={mood.value}
                    type="button"
                    onClick={() => handleMoodSelect(mood)}
                    className={`
                      flex flex-col items-center justify-center p-2 sm:p-3 rounded-lg transition-all duration-300
                      ${selectedMood?.value === mood.value 
                        ? 'bg-primary-100 ring-2 ring-primary-500 transform scale-110' 
                        : 'bg-gray-50 hover:bg-gray-100 transform hover:scale-105'}
                    `}
                  >
                    <span className="text-2xl sm:text-3xl mb-1" role="img" aria-label={mood.label}>
                      {mood.emoji}
                    </span>
                    <span className="text-[10px] sm:text-xs font-medium text-gray-600">
                      {mood.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Journal area */}
            <div className="space-y-2">
              <label htmlFor="journal" className="block text-sm font-medium text-gray-700">
                Journal Entry
              </label>
              <textarea
                id="journal"
                rows={window.innerWidth < 640 ? "4" : "5"}
                className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border border-gray-300 rounded-lg p-3 transition-colors duration-200"
                placeholder="How are you feeling today? What's on your mind?"
                value={journalText}
                onChange={handleJournalChange}
              ></textarea>
              <p className="text-xs text-gray-500 mt-1">Writing about your feelings can help process them better</p>
            </div>

            {/* Motivational quote */}
            <div className="italic text-center text-gray-500 text-xs sm:text-sm px-2 sm:px-4">
              "{currentQuote}"
            </div>

            {/* Submit button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center py-2.5 sm:py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 transition-colors duration-200"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="truncate">Recording your mood...</span>
                  </>
                ) : (
                  'Record Your Mood'
                )}
              </button>
            </div>
          </form>
        </motion.div>

        {/* Mobile-friendly mood tips */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-4 bg-white rounded-xl p-3 sm:p-4 shadow-md"
        >
          <h3 className="font-medium text-sm text-gray-700 mb-2">Mood Tracker Benefits</h3>
          <ul className="text-xs text-gray-600 space-y-1">
            <li className="flex items-start">
              <span className="text-primary-500 mr-1.5">•</span>
              <span>Helps identify patterns in your emotions</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary-500 mr-1.5">•</span>
              <span>Increases self-awareness of emotional triggers</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary-500 mr-1.5">•</span>
              <span>Provides data to discuss with mental health professionals</span>
            </li>
          </ul>
        </motion.div>
      </div>

      {/* Toast notification - Made mobile friendly */}
      {showToast && (
        <div className="fixed bottom-5 right-0 left-0 mx-auto w-[90%] max-w-sm z-50 px-2 sm:left-auto sm:right-5 sm:px-0">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className={`rounded-lg shadow-lg p-3 sm:p-4 ${
              toastType === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}
          >
            <div className="flex items-center">
              {toastType === 'success' ? (
                <svg className="h-5 w-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="h-5 w-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              )}
              <span className="text-sm">{toastMessage}</span>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default MoodEntry;
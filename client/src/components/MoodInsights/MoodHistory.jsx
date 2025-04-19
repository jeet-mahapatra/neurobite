import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { motion } from 'framer-motion';

const MoodHistory = () => {
  const [moodEntries, setMoodEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('newest'); // 'newest' or 'oldest'
  const [filterMood, setFilterMood] = useState('all'); // 'all', 'happy', 'sad', etc.
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMoodEntries = async () => {
      try {
        setLoading(true);
        const response = await api.get('/mood');
        setMoodEntries(response.data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch mood entries:', err);
        setError('Failed to load your mood data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchMoodEntries();
  }, []);

  // Map mood values to emojis
  const moodEmojis = {
    happy: '😄',
    good: '😊',
    neutral: '😐',
    sad: '😞',
    angry: '😠'
  };

  // Capitalize first letter
  const capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { 
      timeZone: 'Asia/Kolkata',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Filter and sort entries
  const filteredEntries = moodEntries
    .filter(entry => {
      // Apply mood filter
      if (filterMood !== 'all' && entry.mood !== filterMood) {
        return false;
      }
      
      // Apply search term filter
      if (searchTerm && !entry.journal?.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      
      return true;
    })
    .sort((a, b) => {
      // Apply sort
      if (sortOrder === 'newest') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else {
        return new Date(a.createdAt) - new Date(b.createdAt);
      }
    });

  // Calculate mood statistics
  const calculateStats = () => {
    const stats = {
      total: moodEntries.length,
      moodCounts: {
        happy: 0,
        good: 0,
        neutral: 0,
        sad: 0,
        angry: 0
      },
      mostFrequentMood: 'N/A',
      averageEntriesPerWeek: 0
    };
    
    // Count moods
    moodEntries.forEach(entry => {
      if (stats.moodCounts[entry.mood] !== undefined) {
        stats.moodCounts[entry.mood]++;
      }
    });
    
    // Find most frequent mood
    let maxCount = 0;
    Object.entries(stats.moodCounts).forEach(([mood, count]) => {
      if (count > maxCount) {
        maxCount = count;
        stats.mostFrequentMood = mood;
      }
    });
    
    // Calculate average entries per week
    if (moodEntries.length > 0) {
      const oldestEntry = new Date(Math.min(...moodEntries.map(e => new Date(e.createdAt))));
      const newestEntry = new Date(Math.max(...moodEntries.map(e => new Date(e.createdAt))));
      const diffTime = newestEntry - oldestEntry;
      const diffDays = diffTime / (1000 * 60 * 60 * 24);
      const diffWeeks = Math.max(1, diffDays / 7); // At least 1 week
      stats.averageEntriesPerWeek = (moodEntries.length / diffWeeks).toFixed(1);
    }
    
    return stats;
  };
  
  const stats = calculateStats();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-600"></div>
          <p className="mt-4 text-gray-600">Loading your mood history...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 via-purple-50 to-white py-12 px-4">
        {/* Back button */}
        <div className="absolute top-4 left-4">
          <button 
            onClick={() => navigate('/dashboard/insights')}
            className="flex items-center text-gray-600 hover:text-primary-600 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-md p-1"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6 mr-1" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="font-medium">Back</span>
          </button>
        </div>
        
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="text-red-500 text-5xl mb-4">😕</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops! Something went wrong</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button 
              onClick={() => navigate('/dashboard/insights')} 
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
            >
              Back to Insights
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-purple-50 to-white pb-12 relative">
      {/* Back button */}
      <div className="absolute top-4 left-4 z-10">
        <button 
          onClick={() => navigate('/dashboard/insights')}
          className="flex items-center text-gray-600 hover:text-primary-600 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-md p-1"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-6 w-6 mr-1" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="font-medium">Back</span>
        </button>
      </div>

      {/* Header Section */}
      <div className="bg-white shadow-sm mb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <motion.h1 
            className="text-3xl font-bold text-gray-900"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Your Mood History
          </motion.h1>
          <p className="text-gray-600 mt-1">All your mood entries in one place</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Stats Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-1">Total Entries</h3>
            <p className="text-3xl font-bold text-primary-600">{stats.total}</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-1">Most Frequent Mood</h3>
            <div className="flex items-center">
              <span className="text-3xl mr-2">
                {moodEmojis[stats.mostFrequentMood] || '📊'}
              </span>
              <p className="text-2xl font-bold text-primary-600">
                {capitalize(stats.mostFrequentMood)}
              </p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-1">Entries Per Week</h3>
            <p className="text-3xl font-bold text-primary-600">{stats.averageEntriesPerWeek}</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-1">Mood Distribution</h3>
            <div className="flex items-center space-x-2 mt-2">
              {Object.entries(stats.moodCounts).map(([mood, count]) => (
                count > 0 && (
                  <div key={mood} className="flex flex-col items-center">
                    <span>{moodEmojis[mood]}</span>
                    <span className="text-xs font-semibold">{count}</span>
                  </div>
                )
              ))}
            </div>
          </div>
        </motion.div>

        {/* Filters and Search */}
        <motion.div 
          className="bg-white rounded-lg shadow-md p-6 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                Search Journal
              </label>
              <input
                type="text"
                id="search"
                className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                placeholder="Search your entries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div>
              <label htmlFor="mood-filter" className="block text-sm font-medium text-gray-700 mb-1">
                Filter by Mood
              </label>
              <select
                id="mood-filter"
                className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                value={filterMood}
                onChange={(e) => setFilterMood(e.target.value)}
              >
                <option value="all">All Moods</option>
                <option value="happy">😄 Happy</option>
                <option value="good">😊 Good</option>
                <option value="neutral">😐 Neutral</option>
                <option value="sad">😞 Sad</option>
                <option value="angry">😠 Angry</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="sort-order" className="block text-sm font-medium text-gray-700 mb-1">
                Sort Order
              </label>
              <select
                id="sort-order"
                className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Mood Entries */}
        <motion.div 
          className="bg-white rounded-lg shadow-md overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-primary-500 to-purple-500">
            <h2 className="text-xl font-semibold text-white">All Mood Entries</h2>
            <p className="text-white text-opacity-80 text-sm">
              Showing {filteredEntries.length} of {moodEntries.length} entries
            </p>
          </div>
          
          <div className="divide-y divide-gray-200">
            {filteredEntries.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <p className="text-xl mb-2">No entries found</p>
                <p className="text-sm mb-4">Try adjusting your filters or search term</p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setFilterMood('all');
                  }}
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              filteredEntries.map((entry) => (
                <div key={entry._id} className="p-6 transition-colors hover:bg-gray-50">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <span className="text-3xl mr-3">{moodEmojis[entry.mood] || '🙂'}</span>
                      <h3 className="text-lg font-semibold text-gray-800">{capitalize(entry.mood)}</h3>
                    </div>
                    <div className="text-sm text-gray-500">{formatDate(entry.createdAt)}</div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    {entry.journal ? (
                      <p className="text-gray-700 whitespace-pre-line">{entry.journal}</p>
                    ) : (
                      <p className="text-gray-400 italic">No journal entry</p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>

        {/* Call to action */}
        <motion.div 
          className="bg-gradient-to-r from-primary-500 to-purple-500 rounded-lg shadow-lg p-8 text-white text-center mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2 className="text-2xl font-bold mb-2">Ready to record today's mood?</h2>
          <p className="mb-6 text-white/90 max-w-2xl mx-auto">
            Continue tracking your emotional journey to gain deeper insights.
          </p>
          <button 
            onClick={() => navigate('/mood')} 
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-primary-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-primary-600 focus:ring-white"
          >
            Record Your Mood
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default MoodHistory;
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { motion } from 'framer-motion';

// Component imports
import MoodLineChart from './charts/MoodLineChart';
import MoodPieChart from './charts/MoodPieChart';
import RecentMoods from './RecentMoods';
import MoodCalendar from './MoodCalendar';
import ExploreMore from './ExploreMore';

const MoodInsights = () => {
  const [moodEntries, setMoodEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeFrame, setTimeFrame] = useState('week'); // 'week', 'month', 'year'
  
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

  // Process data for visualizations
  const processChartData = () => {
    let filteredEntries = [...moodEntries];
    
    // Format date to YYYY-MM-DD in Indian time zone
    const formatToIndianYYYYMMDD = (date) => {
      const options = {
        timeZone: 'Asia/Kolkata',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      };

      const [month, day, year] = new Intl.DateTimeFormat('en-US', options)
        .format(date)
        .split('/');
      
      return `${year}-${month}-${day}`;
    };
    
    // Filter based on timeFrame using Indian timezone
    if (timeFrame === 'week') {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      const oneWeekAgoInIST = formatToIndianYYYYMMDD(oneWeekAgo);
      
      filteredEntries = moodEntries.filter(entry => {
        const entryDateIST = formatToIndianYYYYMMDD(new Date(entry.createdAt));
        return entryDateIST >= oneWeekAgoInIST;
      });
    } else if (timeFrame === 'month') {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      const oneMonthAgoInIST = formatToIndianYYYYMMDD(oneMonthAgo);
      
      filteredEntries = moodEntries.filter(entry => {
        const entryDateIST = formatToIndianYYYYMMDD(new Date(entry.createdAt));
        return entryDateIST >= oneMonthAgoInIST;
      });
    }
    // 'year' uses all entries

    return filteredEntries;
  };

  const chartData = processChartData();
  const recentMoods = moodEntries.slice(0, 5); // Get 5 most recent entries

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-600"></div>
          <p className="mt-4 text-gray-600">Loading your mood insights...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="text-red-500 text-5xl mb-4">😕</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops! Something went wrong</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button 
              onClick={() => navigate('/mood')} 
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
            >
              Record a New Mood Instead
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (moodEntries.length === 0) {
    return (
      <div className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="text-primary-500 text-5xl mb-4">📝</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No Mood Entries Yet</h2>
            <p className="text-gray-600 mb-6">Start tracking your mood to see insights here.</p>
            <button 
              onClick={() => navigate('/mood')} 
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
            >
              Record Your First Mood
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-blue-50 via-purple-50 to-white pb-12">
      {/* Header Section */}
      <div className="bg-white shadow-sm mb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <motion.h1 
            className="text-3xl font-bold text-gray-900"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Your Mood Insights
          </motion.h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Time Frame Selector */}
        <div className="mb-6 flex justify-end">
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <button
              type="button"
              onClick={() => setTimeFrame('week')}
              className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
                timeFrame === 'week' 
                  ? 'bg-primary-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              } border border-gray-200`}
            >
              7 Days
            </button>
            <button
              type="button"
              onClick={() => setTimeFrame('month')}
              className={`px-4 py-2 text-sm font-medium ${
                timeFrame === 'month' 
                  ? 'bg-primary-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              } border-t border-b border-gray-200`}
            >
              30 Days
            </button>
            <button
              type="button"
              onClick={() => setTimeFrame('year')}
              className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
                timeFrame === 'year' 
                  ? 'bg-primary-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              } border border-gray-200`}
            >
              All Time
            </button>
          </div>
        </div>

        {/* Main Content - Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Charts Section - Left Column */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div 
              className="bg-white rounded-lg shadow-md p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Mood Trends</h2>
              <MoodLineChart data={chartData} timeFrame={timeFrame} />
            </motion.div>

            <motion.div 
              className="bg-white rounded-lg shadow-md p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Mood Distribution</h2>
              <div className="h-80">
                <MoodPieChart data={chartData} />
              </div>
            </motion.div>

            <motion.div 
              className="bg-white rounded-lg shadow-md p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Mood Calendar</h2>
              <MoodCalendar data={moodEntries} />
            </motion.div>
          </div>

          {/* Recent Entries & Explore More - Right Column */}
          <div className="space-y-6">
            <motion.div 
              className="bg-white rounded-lg shadow-md overflow-hidden"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-primary-500 to-purple-500">
                <h2 className="text-xl font-semibold text-white">Recent Mood Entries</h2>
              </div>
              <RecentMoods moods={recentMoods} />
            </motion.div>

            <motion.div 
              className="bg-white rounded-lg shadow-md overflow-hidden"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-green-500 to-teal-500">
                <h2 className="text-xl font-semibold text-white">Explore More</h2>
              </div>
              <ExploreMore />
            </motion.div>
          </div>
        </div>

        {/* Call to action */}
        <motion.div 
          className="bg-gradient-to-r from-primary-500 to-purple-500 rounded-lg shadow-lg p-8 text-white text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2 className="text-2xl font-bold mb-2">Ready to record today's mood?</h2>
          <p className="mb-6 text-white/90 max-w-2xl mx-auto">
            Track your emotional journey and gain valuable insights about yourself.
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

export default MoodInsights;
import { Link } from 'react-router-dom';
import { formatDistance } from 'date-fns';

const RecentMoods = ({ moods }) => {
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

  // Get time ago (e.g., "2 hours ago", "3 days ago")
  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    return formatDistance(date, new Date(), { addSuffix: true });
  };

  // Truncate journal text
  const truncateJournal = (text, maxLength = 60) => {
    if (!text) return 'No journal entry';
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  if (!moods || moods.length === 0) {
    return (
      <div className="px-6 py-8 text-center text-gray-500">
        <p>No mood entries yet. Start tracking your mood!</p>
        <Link 
          to="/mood" 
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 transition-colors"
        >
          Record Your First Mood
        </Link>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200">
      <div className="text-center text-xs text-gray-500 p-2">
        All times shown in Indian Standard Time (IST)
      </div>
      {moods.map((mood) => (
        <div key={mood._id} className="p-4 hover:bg-gray-50 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <span className="text-2xl mr-2">{moodEmojis[mood.mood] || '🙂'}</span>
              <span className="font-medium text-gray-900">{capitalize(mood.mood)}</span>
            </div>
            <div className="text-sm text-gray-500">{getTimeAgo(mood.createdAt)}</div>
          </div>
          
          <p className="text-gray-600 text-sm">{truncateJournal(mood.journal)}</p>
          
          {/* Removed the "View Full Entry" link as requested */}
        </div>
      ))}
      
      <div className="p-4 text-center">
        <Link 
          to="/mood/history" 
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 transition-colors"
        >
          View All Entries
        </Link>
      </div>
    </div>
  );
};

export default RecentMoods;
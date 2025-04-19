import { useState, useEffect } from 'react';

const MoodCalendar = ({ data }) => {
  const [calendarData, setCalendarData] = useState([]);

  // Map mood values to colors for heatmap
  const moodColors = {
    happy: 'bg-green-400',
    good: 'bg-blue-400',
    neutral: 'bg-gray-400',
    sad: 'bg-indigo-400',
    angry: 'bg-red-400',
    // Empty day
    empty: 'bg-gray-100'
  };

  // Map mood values to emojis
  const moodEmojis = {
    happy: '😄',
    good: '😊',
    neutral: '😐',
    sad: '😞',
    angry: '😠',
  };

  // Format date to Indian time zone (IST)
  const formatToIndianDate = (date) => {
    // Options for formatting with Indian time zone
    const options = {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    };

    // Format to YYYY-MM-DD in Indian time zone
    const [month, day, year] = new Intl.DateTimeFormat('en-US', options)
      .format(date)
      .split('/');
    
    return `${year}-${month}-${day}`;
  };

  // Format date for display in Indian format
  const formatDateForDisplay = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Kolkata',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  useEffect(() => {
    if (!data || data.length === 0) return;

    const processCalendarData = () => {
      // Get data for past 30 days
      const past30Days = [];
      const now = new Date(); // Current date in local time

      // Create 30 day array
      for (let i = 29; i >= 0; i--) {
        const date = new Date();
        date.setDate(now.getDate() - i);
        
        // Format to YYYY-MM-DD in Indian time zone for comparison
        const dateString = formatToIndianDate(date);
        
        // Find an entry for this date, or mark as empty
        const dayEntry = data.find(entry => {
          // Convert entry date to Indian time zone before comparing
          const entryDate = formatToIndianDate(new Date(entry.createdAt));
          return entryDate === dateString;
        });

        // Day number in Indian time zone
        const dayNumber = new Intl.DateTimeFormat('en-US', {
          timeZone: 'Asia/Kolkata',
          day: '2-digit'
        }).format(date);

        past30Days.push({
          date: dateString,
          mood: dayEntry ? dayEntry.mood : 'empty',
          formattedDate: formatDateForDisplay(date),
          hasEntry: !!dayEntry,
          dayNumber: dayNumber
        });
      }

      setCalendarData(past30Days);
    };

    processCalendarData();
  }, [data]);

  if (calendarData.length === 0) {
    return (
      <div className="flex justify-center items-center h-40 text-gray-400">
        No mood data available yet
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <div className="flex flex-col">
        {/* Time zone indicator */}
        <div className="text-center text-sm text-gray-500 mb-2">
          All times shown in Indian Standard Time (IST)
        </div>
        
        {/* Legend */}
        <div className="flex justify-center mb-4 flex-wrap gap-4">
          {Object.entries(moodEmojis).map(([mood, emoji]) => (
            <div key={mood} className="flex items-center">
              <div className={`w-4 h-4 rounded-sm ${moodColors[mood]} mr-1`}></div>
              <span>{emoji} {mood.charAt(0).toUpperCase() + mood.slice(1)}</span>
            </div>
          ))}
          <div className="flex items-center">
            <div className={`w-4 h-4 rounded-sm ${moodColors.empty} mr-1`}></div>
            <span>No Entry</span>
          </div>
        </div>
        
        {/* Calendar grid */}
        <div className="grid grid-cols-7 sm:grid-cols-10 md:grid-cols-15 gap-2">
          {calendarData.map((day) => (
            <div 
              key={day.date} 
              className={`
                relative w-8 h-8 rounded-sm flex items-center justify-center cursor-pointer
                transition-transform hover:scale-110 hover:z-10
                ${moodColors[day.mood]}
                ${day.mood === 'empty' ? 'border border-gray-200' : ''}
              `}
              title={`${day.formattedDate}: ${day.mood !== 'empty' ? day.mood : 'No entry'}`}
            >
              {day.hasEntry && (
                <span className="text-xs">{moodEmojis[day.mood]}</span>
              )}
              <span className="absolute -bottom-5 text-[10px] text-gray-500">
                {day.dayNumber}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MoodCalendar;
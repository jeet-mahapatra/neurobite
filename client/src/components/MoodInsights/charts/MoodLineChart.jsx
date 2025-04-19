import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const MoodLineChart = ({ data, timeFrame }) => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  // Convert a date to Indian timezone (IST)
  const convertToIndianDate = (date) => {
    const options = { timeZone: 'Asia/Kolkata' };
    return new Date(new Intl.DateTimeFormat('en-US', options).format(date));
  };

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

  useEffect(() => {
    if (!data || data.length === 0) return;

    // Process data for chart
    const processData = () => {
      // Define how many days to look back
      let daysToLookBack = 7;
      if (timeFrame === 'month') daysToLookBack = 30;
      else if (timeFrame === 'year') daysToLookBack = 365;

      // Create date range in Indian time zone (IST)
      const dates = [];
      const now = new Date(); // Current date
      
      for (let i = daysToLookBack - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(now.getDate() - i);
        dates.push(formatToIndianYYYYMMDD(date)); // Format: YYYY-MM-DD in IST
      }

      // Count moods per day
      const moodsPerDay = {
        'happy': Array(dates.length).fill(0),
        'good': Array(dates.length).fill(0),
        'neutral': Array(dates.length).fill(0),
        'sad': Array(dates.length).fill(0),
        'angry': Array(dates.length).fill(0)
      };

      // Count mood occurrences for each date in IST
      data.forEach(entry => {
        const entryDate = formatToIndianYYYYMMDD(new Date(entry.createdAt));
        const dateIndex = dates.indexOf(entryDate);
        if (dateIndex !== -1 && moodsPerDay[entry.mood]) {
          moodsPerDay[entry.mood][dateIndex]++;
        }
      });

      // Format labels based on timeFrame (in IST)
      const formattedDates = dates.map(dateStr => {
        // Convert the YYYY-MM-DD string back to a Date object
        const [year, month, day] = dateStr.split('-');
        const d = new Date(year, month - 1, day); // month is 0-indexed in JS Date
        
        // Format according to timeFrame
        if (timeFrame === 'week') {
          return new Intl.DateTimeFormat('en-US', { 
            timeZone: 'Asia/Kolkata', 
            weekday: 'short' 
          }).format(d);
        }
        
        return new Intl.DateTimeFormat('en-US', { 
          timeZone: 'Asia/Kolkata', 
          month: 'short', 
          day: 'numeric' 
        }).format(d);
      });

      // Create datasets for chart
      const datasets = [
        {
          label: 'Happy',
          data: moodsPerDay['happy'],
          borderColor: '#10b981', // Green
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          tension: 0.4
        },
        {
          label: 'Good',
          data: moodsPerDay['good'],
          borderColor: '#3b82f6', // Blue
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.4
        },
        {
          label: 'Neutral',
          data: moodsPerDay['neutral'],
          borderColor: '#9ca3af', // Gray
          backgroundColor: 'rgba(156, 163, 175, 0.1)',
          tension: 0.4
        },
        {
          label: 'Sad',
          data: moodsPerDay['sad'],
          borderColor: '#6366f1', // Indigo
          backgroundColor: 'rgba(99, 102, 241, 0.1)',
          tension: 0.4
        },
        {
          label: 'Angry',
          data: moodsPerDay['angry'],
          borderColor: '#ef4444', // Red
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          tension: 0.4
        }
      ];

      setChartData({
        labels: formattedDates,
        datasets
      });
    };

    processData();
  }, [data, timeFrame]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          title: (context) => {
            // Add IST indicator to tooltip titles
            return `${context[0].label} (IST)`;
          }
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0 // Only show integer values
        }
      }
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    }
  };

  if (!data || data.length === 0) {
    return <div className="flex justify-center items-center h-40 text-gray-400">No data available yet</div>;
  }

  return (
    <div className="w-full h-64 md:h-80">
      <div className="text-center text-xs text-gray-500 mb-2">
        All times shown in Indian Standard Time (IST)
      </div>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default MoodLineChart;
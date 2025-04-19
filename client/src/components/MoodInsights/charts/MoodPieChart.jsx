import { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

const MoodPieChart = ({ data }) => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: []
  });

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
      // Count occurrences of each mood
      const moodCounts = {
        'happy': 0,
        'good': 0,
        'neutral': 0,
        'sad': 0,
        'angry': 0
      };

      // We don't need to adjust for time zone in the pie chart
      // since we're just counting total occurrences
      data.forEach(entry => {
        if (moodCounts[entry.mood] !== undefined) {
          moodCounts[entry.mood]++;
        }
      });

      // Create labels and data arrays
      const labels = [];
      const values = [];
      const backgroundColors = [];
      const hoverBackgroundColors = [];

      // Define colors for each mood
      const moodColors = {
        'happy': {
          bg: 'rgba(16, 185, 129, 0.7)', // Green
          hover: 'rgba(16, 185, 129, 0.9)'
        },
        'good': {
          bg: 'rgba(59, 130, 246, 0.7)', // Blue
          hover: 'rgba(59, 130, 246, 0.9)'
        },
        'neutral': {
          bg: 'rgba(156, 163, 175, 0.7)', // Gray
          hover: 'rgba(156, 163, 175, 0.9)'
        },
        'sad': {
          bg: 'rgba(99, 102, 241, 0.7)', // Indigo
          hover: 'rgba(99, 102, 241, 0.9)'
        },
        'angry': {
          bg: 'rgba(239, 68, 68, 0.7)', // Red
          hover: 'rgba(239, 68, 68, 0.9)'
        }
      };

      // Map mood emojis
      const moodLabels = {
        'happy': '😄 Happy',
        'good': '😊 Good',
        'neutral': '😐 Neutral',
        'sad': '😞 Sad',
        'angry': '😠 Angry'
      };

      // Add data for moods that have entries
      Object.entries(moodCounts).forEach(([mood, count]) => {
        if (count > 0) {
          labels.push(moodLabels[mood] || mood);
          values.push(count);
          backgroundColors.push(moodColors[mood]?.bg || 'rgba(156, 163, 175, 0.7)');
          hoverBackgroundColors.push(moodColors[mood]?.hover || 'rgba(156, 163, 175, 0.9)');
        }
      });

      setChartData({
        labels,
        datasets: [
          {
            data: values,
            backgroundColor: backgroundColors,
            hoverBackgroundColor: hoverBackgroundColors,
            borderWidth: 2,
            borderColor: 'rgba(255, 255, 255, 0.8)',
          }
        ]
      });
    };

    processData();
  }, [data]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((acc, val) => acc + val, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    },
    cutout: '15%',
    animation: {
      animateRotate: true,
      animateScale: true
    }
  };

  if (!data || data.length === 0) {
    return <div className="flex justify-center items-center h-40 text-gray-400">No data available yet</div>;
  }

  return (
    <div className="w-full h-full flex items-center justify-center flex-col">
      <div className="w-full max-w-md">
        <Pie data={chartData} options={options} />
      </div>
    </div>
  );
};

export default MoodPieChart;
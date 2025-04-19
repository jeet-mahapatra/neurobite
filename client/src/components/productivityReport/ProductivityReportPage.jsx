import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import api from "../../utils/api";
import {
  format,
  parseISO,
  subDays,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
} from "date-fns";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProductivityReportPage = () => {
  // State for holding various data
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState("week"); // 'week', 'month', 'year'
  const [productivityData, setProductivityData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [trendsData, setTrendsData] = useState([]);
  const [productivityStats, setProductivityStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    productivityScore: 0,
    highPriorityPending: 0,
    mostProductiveDay: null,
    streak: 0,
  });

  // Priority weights for direct scoring
  const priorityWeights = {
    high: 45,    // Each high priority task is worth 45% 
    medium: 35,  // Each medium priority task is worth 35%
    low: 20,     // Each low priority task is worth 20%
  };

  // Colors for the charts
  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#0088FE"];

  // Fetch tasks data
  useEffect(() => {
    fetchTasks();
  }, [timeRange]);

  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/todos");
      setTasks(response.data);
      processData(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to load task data. Please try again.");
      toast.error("Error loading productivity data");
      console.error("Error fetching tasks data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Process task data with the new productivity calculation
  const processData = (tasks) => {
    // Get time range bounds
    let startDate;
    const today = new Date();

    switch (timeRange) {
      case "week":
        startDate = subDays(today, 7);
        break;
      case "month":
        startDate = startOfMonth(today);
        break;
      case "year":
        startDate = new Date(today.getFullYear(), 0, 1);
        break;
      default:
        startDate = subDays(today, 7);
    }

    // Filter tasks based on time range
    const filteredTasks = tasks.filter((task) => {
      const taskDate = new Date(task.createdAt);
      return taskDate >= startDate && taskDate <= today;
    });

    // Group tasks by date
    const tasksByDate = {};
    filteredTasks.forEach((task) => {
      const date = format(new Date(task.createdAt), "yyyy-MM-dd");

      if (!tasksByDate[date]) {
        tasksByDate[date] = {
          date,
          totalTasks: 0,
          completedTasks: 0,
          
          // Track tasks by priority
          totalHighPriorityTasks: 0,
          totalMediumPriorityTasks: 0,
          totalLowPriorityTasks: 0,
          completedHighPriority: 0,
          completedMediumPriority: 0,
          completedLowPriority: 0,
          
          // Category tracking
          personal: 0,
          work: 0,
          health: 0,
          education: 0,
          leisure: 0,
        };
      }

      tasksByDate[date].totalTasks++;
      tasksByDate[date][task.category]++;
      
      // Track tasks by priority level
      if (task.priority === 'high') {
        tasksByDate[date].totalHighPriorityTasks++;
      } else if (task.priority === 'medium') {
        tasksByDate[date].totalMediumPriorityTasks++;
      } else {
        tasksByDate[date].totalLowPriorityTasks++;
      }

      if (task.completed) {
        tasksByDate[date].completedTasks++;
        
        // Track completed tasks by priority
        if (task.priority === 'high') {
          tasksByDate[date].completedHighPriority++;
        } else if (task.priority === 'medium') {
          tasksByDate[date].completedMediumPriority++;
        } else {
          tasksByDate[date].completedLowPriority++;
        }
      }
    });

    // Calculate productivity score and prepare chart data
    const productivityData = [];
    const trendsData = [];
    let maxProductivity = 0;
    let mostProductiveDay = null;
    let streak = 0;
    let currentStreak = 0;

    Object.values(tasksByDate)
      .sort((a, b) => a.date.localeCompare(b.date))
      .forEach((dayData) => {
        // NEW PRODUCTIVITY CALCULATION:
        // Calculate the potential maximum score based on all tasks
        const potentialMaxScore = 
          (dayData.totalHighPriorityTasks * priorityWeights.high) +
          (dayData.totalMediumPriorityTasks * priorityWeights.medium) +
          (dayData.totalLowPriorityTasks * priorityWeights.low);
        
        // Calculate the actual score based on completed tasks
        const actualScore = 
          (dayData.completedHighPriority * priorityWeights.high) +
          (dayData.completedMediumPriority * priorityWeights.medium) +
          (dayData.completedLowPriority * priorityWeights.low);
        
        // Final productivity score as a percentage of potential maximum
        let productivityScore = 0;
        if (potentialMaxScore > 0) {
          productivityScore = Math.min(Math.round((actualScore / potentialMaxScore) * 100), 100);
        } else if (dayData.completedTasks > 0) {
          // If there are no tasks assigned but some are completed (edge case)
          productivityScore = 100;
        }
          
        dayData.productivityScore = productivityScore;

        // Track most productive day
        if (productivityScore > maxProductivity) {
          maxProductivity = productivityScore;
          mostProductiveDay = dayData.date;
        }

        // Track streak
        if (productivityScore >= 50) {
          currentStreak++;
          streak = Math.max(streak, currentStreak);
        } else {
          currentStreak = 0;
        }

        // Add to chart data
        productivityData.push({
          date: format(parseISO(dayData.date), "MM/dd"),
          score: productivityScore,
        });

        trendsData.push({
          date: format(parseISO(dayData.date), "MM/dd"),
          completed: dayData.completedTasks,
          total: dayData.totalTasks,
        });
      });

    // Calculate category breakdown
    const categoryCounts = filteredTasks.reduce((acc, task) => {
      if (!acc[task.category]) acc[task.category] = 0;
      acc[task.category]++;
      return acc;
    }, {});

    const categoryData = Object.entries(categoryCounts).map(
      ([name, value]) => ({
        name,
        value,
      })
    );

    // Count high priority pending tasks
    const highPriorityPending = tasks.filter(
      (task) => task.priority === "high" && !task.completed
    ).length;

    // Calculate overall productivity score
    let overallProductivityScore = 0;
    
    if (productivityData.length > 0) {
      overallProductivityScore = Math.round(
        productivityData.reduce((sum, day) => sum + day.score, 0) / productivityData.length
      );
    } else {
      // If we have no daily data, calculate from all tasks
      const totalHighTasks = filteredTasks.filter(t => t.priority === 'high').length;
      const totalMediumTasks = filteredTasks.filter(t => t.priority === 'medium').length;
      const totalLowTasks = filteredTasks.filter(t => t.priority === 'low').length;
      
      const completedHighTasks = filteredTasks.filter(t => t.priority === 'high' && t.completed).length;
      const completedMediumTasks = filteredTasks.filter(t => t.priority === 'medium' && t.completed).length;
      const completedLowTasks = filteredTasks.filter(t => t.priority === 'low' && t.completed).length;
      
      const potentialMax = 
        (totalHighTasks * priorityWeights.high) +
        (totalMediumTasks * priorityWeights.medium) +
        (totalLowTasks * priorityWeights.low);
        
      const actual =
        (completedHighTasks * priorityWeights.high) +
        (completedMediumTasks * priorityWeights.medium) +
        (completedLowTasks * priorityWeights.low);
        
      if (potentialMax > 0) {
        overallProductivityScore = Math.min(Math.round((actual / potentialMax) * 100), 100);
      } else if (filteredTasks.filter(t => t.completed).length > 0) {
        overallProductivityScore = 100;
      }
    }

    // Set state with processed data
    setProductivityData(productivityData);
    setCategoryData(categoryData);
    setTrendsData(trendsData);
    setProductivityStats({
      totalTasks: filteredTasks.length,
      completedTasks: filteredTasks.filter((task) => task.completed).length,
      productivityScore: overallProductivityScore,
      highPriorityPending,
      mostProductiveDay: mostProductiveDay
        ? format(parseISO(mostProductiveDay), "MMMM d, yyyy")
        : null,
      streak,
    });
  };

  // Format date for smaller screens
  const formatDateForMobile = (date) => {
    if (window.innerWidth < 640) {
      // For mobile, just return the day
      return date.split('/')[1];
    }
    return date;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-purple-50 to-white py-6 sm:py-12">
      <ToastContainer position="bottom-right" />
      <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-6 sm:mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-900">
            Productivity Insights
          </h1>
          <p className="mt-2 sm:mt-3 text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            Track your progress and optimize your workflow
          </p>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600"></div>
          </div>
        ) : error ? (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6"
            role="alert"
          >
            <span className="block sm:inline">{error}</span>
          </div>
        ) : (
          <>
            {/* Time Range Selector - Mobile Friendly */}
            <div className="bg-white rounded-xl shadow-md p-3 sm:p-4 mb-6 overflow-x-auto">
              <div className="flex justify-center min-w-max">
                <div className="inline-flex rounded-md shadow-sm">
                  <button
                    onClick={() => setTimeRange("week")}
                    className={`px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium rounded-l-md ${
                      timeRange === "week"
                        ? "bg-primary-500 text-white"
                        : "bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    This Week
                  </button>
                  <button
                    onClick={() => setTimeRange("month")}
                    className={`px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium ${
                      timeRange === "month"
                        ? "bg-primary-500 text-white"
                        : "bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    This Month
                  </button>
                  <button
                    onClick={() => setTimeRange("year")}
                    className={`px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium rounded-r-md ${
                      timeRange === "year"
                        ? "bg-primary-500 text-white"
                        : "bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    This Year
                  </button>
                </div>
              </div>
            </div>

            {/* Stats Cards - Mobile Friendly Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
              <motion.div
                className="bg-white rounded-xl shadow-md overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="px-4 sm:px-6 py-3 sm:py-5 border-b border-gray-200 bg-gradient-to-r from-indigo-500 to-blue-500">
                  <h2 className="text-lg sm:text-xl font-bold text-white">
                    Productivity Score
                  </h2>
                </div>
                <div className="p-4 sm:p-6 flex flex-col items-center justify-center">
                  <div className="text-4xl sm:text-5xl font-bold text-indigo-600">
                    {productivityStats.productivityScore}%
                  </div>
                  <p className="text-sm text-gray-500 mt-2 text-center">
                    {productivityStats.productivityScore < 40
                      ? "Try focusing on high priority tasks."
                      : productivityStats.productivityScore < 70
                      ? "Good progress! Keep going."
                      : "Excellent work!"}
                  </p>
                </div>
              </motion.div>

              <motion.div
                className="bg-white rounded-xl shadow-md overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <div className="px-4 sm:px-6 py-3 sm:py-5 border-b border-gray-200 bg-gradient-to-r from-purple-500 to-pink-500">
                  <h2 className="text-lg sm:text-xl font-bold text-white">
                    Task Completion
                  </h2>
                </div>
                <div className="p-4 sm:p-6 flex flex-col items-center justify-center">
                  <div className="text-2xl sm:text-3xl font-bold text-purple-600">
                    {productivityStats.completedTasks} /{" "}
                    {productivityStats.totalTasks}
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
                    <div
                      className="bg-purple-600 h-2.5 rounded-full"
                      style={{
                        width: `${
                          productivityStats.totalTasks > 0
                            ? (productivityStats.completedTasks /
                                productivityStats.totalTasks) *
                              100
                            : 0
                        }%`,
                      }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">Tasks completed</p>
                </div>
              </motion.div>

              <motion.div
                className="bg-white rounded-xl shadow-md overflow-hidden sm:col-span-2 lg:col-span-1"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="px-4 sm:px-6 py-3 sm:py-5 border-b border-gray-200 bg-gradient-to-r from-amber-500 to-orange-500">
                  <h2 className="text-lg sm:text-xl font-bold text-white">
                    Productivity Insights
                  </h2>
                </div>
                <div className="p-4 sm:p-6">
                  <div className="flex flex-wrap gap-3">
                    <div className="flex items-center w-full sm:w-auto">
                      <div className="bg-amber-100 p-2 rounded-full mr-3 flex-shrink-0">
                        <svg
                          className="w-5 h-5 text-amber-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          ></path>
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">
                          {productivityStats.streak} day
                          {productivityStats.streak !== 1 ? "s" : ""} streak
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center w-full sm:w-auto">
                      <div className="bg-red-100 p-2 rounded-full mr-3 flex-shrink-0">
                        <svg
                          className="w-5 h-5 text-red-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                          ></path>
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">
                          {productivityStats.highPriorityPending} high priority pending
                        </p>
                      </div>
                    </div>

                    {productivityStats.mostProductiveDay && (
                      <div className="flex items-center w-full sm:w-auto">
                        <div className="bg-green-100 p-2 rounded-full mr-3 flex-shrink-0">
                          <svg
                            className="w-5 h-5 text-green-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            ></path>
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">
                            Best: <span className="hidden sm:inline">{productivityStats.mostProductiveDay}</span>
                            <span className="inline sm:hidden">{productivityStats.mostProductiveDay?.split(',')[0]}</span>
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Charts - Responsive layout */}
            <div className="grid grid-cols-1 gap-6">
              {/* Productivity Bar Chart */}
              <motion.div
                className="bg-white rounded-xl shadow-md overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div className="px-4 sm:px-6 py-3 sm:py-5 border-b border-gray-200">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                    Daily Productivity Score
                  </h2>
                </div>
                <div className="p-3 sm:p-4 h-64 sm:h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={productivityData}
                      margin={{
                        top: 10,
                        right: 10,
                        left: 0,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="date" 
                        tick={{ fontSize: window.innerWidth < 640 ? 10 : 12 }}
                        tickFormatter={formatDateForMobile}
                      />
                      <YAxis 
                        domain={[0, 100]} 
                        tick={{ fontSize: window.innerWidth < 640 ? 10 : 12 }}
                      />
                      <Tooltip />
                      <Legend wrapperStyle={{ fontSize: '12px', marginTop: '10px' }} />
                      <Bar
                        dataKey="score"
                        name="Productivity Score"
                        fill="#8884d8"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              {/* Task Categories Pie Chart */}
              <motion.div
                className="bg-white rounded-xl shadow-md overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <div className="px-4 sm:px-6 py-3 sm:py-5 border-b border-gray-200">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                    Task Categories
                  </h2>
                </div>
                <div className="p-3 sm:p-4 h-64 sm:h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%" 
                        labelLine={false} 
                        outerRadius={window.innerWidth < 640 ? 60 : 80} 
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => {
                          const percentValue = (percent * 100).toFixed(0);
                          return percentValue > 10
                            ? `${percentValue}%`
                            : ""; 
                        }}
                        labelStyle={{ fontSize: "12px", fontWeight: "bold" }}
                      >
                        {categoryData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value, name) => [`${value} tasks`, name]}
                        contentStyle={{ fontSize: "12px" }}
                      />
                      <Legend
                        layout="horizontal" 
                        verticalAlign="bottom"
                        align="center"
                        wrapperStyle={{
                          paddingTop: "10px",
                          fontSize: "12px",
                        }}
                        iconSize={10} 
                        formatter={(value) => (
                          <span style={{ fontSize: "12px", color: "#333" }}>
                            {value}
                          </span>
                        )}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              {/* Trends Line Chart */}
              <motion.div
                className="bg-white rounded-xl shadow-md overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <div className="px-4 sm:px-6 py-3 sm:py-5 border-b border-gray-200">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                    Task Completion Trend
                  </h2>
                </div>
                <div className="p-3 sm:p-4 h-64 sm:h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={trendsData}
                      margin={{
                        top: 10,
                        right: 10,
                        left: 0,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="date" 
                        tick={{ fontSize: window.innerWidth < 640 ? 10 : 12 }}
                        tickFormatter={formatDateForMobile}
                      />
                      <YAxis 
                        tick={{ fontSize: window.innerWidth < 640 ? 10 : 12 }}
                      />
                      <Tooltip />
                      <Legend 
                        wrapperStyle={{ fontSize: '12px', marginTop: '10px' }}
                        iconSize={10}
                      />
                      <Line
                        type="monotone"
                        dataKey="total"
                        name="Total Tasks"
                        stroke="#8884d8"
                        activeDot={{ r: 6 }}
                        strokeWidth={2}
                      />
                      <Line
                        type="monotone"
                        dataKey="completed"
                        name="Completed Tasks"
                        stroke="#82ca9d"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            </div>

            {/* Productivity Tips */}
            <motion.div
              className="bg-white rounded-xl shadow-md overflow-hidden mt-6 sm:mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <div className="px-4 sm:px-6 py-3 sm:py-5 border-b border-gray-200 bg-gradient-to-r from-green-500 to-teal-500">
                <h2 className="text-lg sm:text-xl font-bold text-white">
                  Recommendations
                </h2>
              </div>
              <div className="p-4 sm:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {productivityStats.productivityScore < 40 && (
                    <div className="bg-amber-50 rounded-lg p-3 sm:p-4">
                      <div className="flex items-start">
                        <div className="bg-amber-100 p-2 rounded-full mr-3 flex-shrink-0">
                          <span className="text-lg">💡</span>
                        </div>
                        <div>
                          <h3 className="font-medium text-amber-800">
                            Boost Productivity
                          </h3>
                          <p className="text-xs sm:text-sm text-amber-600">
                            Complete high priority tasks first (45% impact).
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {productivityStats.highPriorityPending > 0 && (
                    <div className="bg-red-50 rounded-lg p-3 sm:p-4">
                      <div className="flex items-start">
                        <div className="bg-red-100 p-2 rounded-full mr-3 flex-shrink-0">
                          <span className="text-lg">⚠️</span>
                        </div>
                        <div>
                          <h3 className="font-medium text-red-800">
                            High Priority Tasks
                          </h3>
                          <p className="text-xs sm:text-sm text-red-600">
                            {productivityStats.highPriorityPending} high priority task(s) pending (45% each).
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {productivityStats.streak > 0 && (
                    <div className="bg-green-50 rounded-lg p-3 sm:p-4">
                      <div className="flex items-start">
                        <div className="bg-green-100 p-2 rounded-full mr-3 flex-shrink-0">
                          <span className="text-lg">🔥</span>
                        </div>
                        <div>
                          <h3 className="font-medium text-green-800">
                            Keep Your Streak!
                          </h3>
                          <p className="text-xs sm:text-sm text-green-600">
                            {productivityStats.streak} day streak. Keep it up!
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {categoryData.length > 0 && categoryData[0].name && (
                    <div className="bg-blue-50 rounded-lg p-3 sm:p-4">
                      <div className="flex items-start">
                        <div className="bg-blue-100 p-2 rounded-full mr-3 flex-shrink-0">
                          <span className="text-lg">📊</span>
                        </div>
                        <div>
                          <h3 className="font-medium text-blue-800">
                            Category Focus
                          </h3>
                          <p className="text-xs sm:text-sm text-blue-600">
                            Most tasks in {categoryData[0].name}. Consider balancing.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="bg-purple-50 rounded-lg p-3 sm:p-4">
                    <div className="flex items-start">
                      <div className="bg-purple-100 p-2 rounded-full mr-3 flex-shrink-0">
                        <span className="text-lg">⏰</span>
                      </div>
                      <div>
                        <h3 className="font-medium text-purple-800">
                          Time Blocking
                        </h3>
                        <p className="text-xs sm:text-sm text-purple-600">
                          Allocate more time for high priority tasks (45% impact).
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-indigo-50 rounded-lg p-3 sm:p-4">
                    <div className="flex items-start">
                      <div className="bg-indigo-100 p-2 rounded-full mr-3 flex-shrink-0">
                        <span className="text-lg">🎯</span>
                      </div>
                      <div>
                        <h3 className="font-medium text-indigo-800">
                          Set Clear Priorities
                        </h3>
                        <p className="text-xs sm:text-sm text-indigo-600">
                          Use high (45%), medium (35%), low (20%) priority levels.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Export Section */}
            <div className="mt-6 sm:mt-8 flex justify-center">
              <button
                onClick={() => {
                  window.print();
                }}
                className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  ></path>
                </svg>
                Export Report
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductivityReportPage;
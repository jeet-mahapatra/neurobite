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

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-purple-50 to-white py-12">
      <ToastContainer position="bottom-right" />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-gray-900">
            Productivity Insights
          </h1>
          <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">
            Track your progress, analyze patterns, and optimize your workflow
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
            {/* Time Range Selector */}
            <div className="bg-white rounded-xl shadow-md p-4 mb-6 flex justify-center">
              <div className="inline-flex rounded-md shadow-sm">
                <button
                  onClick={() => setTimeRange("week")}
                  className={`px-4 py-2 text-sm font-medium rounded-l-md ${
                    timeRange === "week"
                      ? "bg-primary-500 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  This Week
                </button>
                <button
                  onClick={() => setTimeRange("month")}
                  className={`px-4 py-2 text-sm font-medium ${
                    timeRange === "month"
                      ? "bg-primary-500 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  This Month
                </button>
                <button
                  onClick={() => setTimeRange("year")}
                  className={`px-4 py-2 text-sm font-medium rounded-r-md ${
                    timeRange === "year"
                      ? "bg-primary-500 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  This Year
                </button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <motion.div
                className="bg-white rounded-xl shadow-md overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-indigo-500 to-blue-500">
                  <h2 className="text-xl font-bold text-white">
                    Productivity Score
                  </h2>
                </div>
                <div className="p-6 flex flex-col items-center justify-center">
                  <div className="text-5xl font-bold text-indigo-600">
                    {productivityStats.productivityScore}%
                  </div>
                  <p className="text-gray-500 mt-2">
                    {productivityStats.productivityScore < 40
                      ? "You can do better! Try focusing on high priority tasks."
                      : productivityStats.productivityScore < 70
                      ? "Good progress! Keep the momentum going."
                      : "Excellent work! You're very productive!"}
                  </p>
                </div>
              </motion.div>

              <motion.div
                className="bg-white rounded-xl shadow-md overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-purple-500 to-pink-500">
                  <h2 className="text-xl font-bold text-white">
                    Task Completion
                  </h2>
                </div>
                <div className="p-6 flex flex-col items-center justify-center">
                  <div className="text-3xl font-bold text-purple-600">
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
                  <p className="text-gray-500 mt-2">Tasks completed</p>
                </div>
              </motion.div>

              <motion.div
                className="bg-white rounded-xl shadow-md overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-amber-500 to-orange-500">
                  <h2 className="text-xl font-bold text-white">
                    Productivity Insights
                  </h2>
                </div>
                <div className="p-6">
                  <div className="flex items-center mb-2">
                    <div className="bg-amber-100 p-2 rounded-full mr-3">
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

                  <div className="flex items-center mb-2">
                    <div className="bg-red-100 p-2 rounded-full mr-3">
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
                        {productivityStats.highPriorityPending} high priority
                        tasks pending
                      </p>
                    </div>
                  </div>

                  {productivityStats.mostProductiveDay && (
                    <div className="flex items-center">
                      <div className="bg-green-100 p-2 rounded-full mr-3">
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
                          Most productive: {productivityStats.mostProductiveDay}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Productivity Bar Chart */}
              <motion.div
                className="bg-white rounded-xl shadow-md overflow-hidden col-span-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div className="px-6 py-5 border-b border-gray-200">
                  <h2 className="text-xl font-bold text-gray-800">
                    Daily Productivity Score
                  </h2>
                </div>
                <div className="p-4 h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={productivityData}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Legend />
                      <Bar
                        dataKey="score"
                        name="Productivity Score"
                        fill="#8884d8"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              {/* Productivity Pi Chart */}
              <motion.div
                className="bg-white rounded-xl shadow-md overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <div className="px-6 py-5 border-b border-gray-200">
                  <h2 className="text-xl font-bold text-gray-800">
                    Task Categories
                  </h2>
                </div>
                <div className="p-4 h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="45%" 
                        labelLine={true} 
                        outerRadius={80} 
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => {
                          const percentValue = (percent * 100).toFixed(0);
                          return percentValue > 3
                            ? `${percentValue}%`
                            : ""; 
                        }}
                        labelStyle={{ fontSize: "14px", fontWeight: "bold" }}
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
                        contentStyle={{ fontSize: "14px" }}
                      />
                      <Legend
                        layout="vertical" 
                        verticalAlign="middle"
                        align="right"
                        wrapperStyle={{
                          paddingLeft: "20px",
                          fontSize: "14px",
                        }}
                        iconSize={12} 
                        formatter={(value) => (
                          <span style={{ fontSize: "14px", color: "#333" }}>
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
                className="bg-white rounded-xl shadow-md overflow-hidden col-span-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <div className="px-6 py-5 border-b border-gray-200">
                  <h2 className="text-xl font-bold text-gray-800">
                    Task Completion Trend
                  </h2>
                </div>
                <div className="p-4 h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={trendsData}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="total"
                        name="Total Tasks"
                        stroke="#8884d8"
                        activeDot={{ r: 8 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="completed"
                        name="Completed Tasks"
                        stroke="#82ca9d"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            </div>

            {/* Productivity Tips */}
            <motion.div
              className="bg-white rounded-xl shadow-md overflow-hidden mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-green-500 to-teal-500">
                <h2 className="text-xl font-bold text-white">
                  Productivity Recommendations
                </h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {productivityStats.productivityScore < 40 && (
                    <div className="bg-amber-50 rounded-lg p-4">
                      <div className="flex items-start">
                        <div className="bg-amber-100 p-2 rounded-full mr-3">
                          <span className="text-lg">💡</span>
                        </div>
                        <div>
                          <h3 className="font-medium text-amber-800">
                            Boost Your Productivity
                          </h3>
                          <p className="text-sm text-amber-600">
                            Try completing high priority tasks first to maximize your productivity score.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {productivityStats.highPriorityPending > 0 && (
                    <div className="bg-red-50 rounded-lg p-4">
                      <div className="flex items-start">
                        <div className="bg-red-100 p-2 rounded-full mr-3">
                          <span className="text-lg">⚠️</span>
                        </div>
                        <div>
                          <h3 className="font-medium text-red-800">
                            High Priority Tasks
                          </h3>
                          <p className="text-sm text-red-600">
                            You have {productivityStats.highPriorityPending}{" "}
                            high priority tasks pending. Each one is worth 45% of your productivity!
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {productivityStats.streak > 0 && (
                    <div className="bg-green-50 rounded-lg p-4">
                      <div className="flex items-start">
                        <div className="bg-green-100 p-2 rounded-full mr-3">
                          <span className="text-lg">🔥</span>
                        </div>
                        <div>
                          <h3 className="font-medium text-green-800">
                            Keep Your Streak!
                          </h3>
                          <p className="text-sm text-green-600">
                            You're on a {productivityStats.streak} day
                            productivity streak. Keep up the good work!
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {categoryData.length > 0 && categoryData[0].name && (
                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="flex items-start">
                        <div className="bg-blue-100 p-2 rounded-full mr-3">
                          <span className="text-lg">📊</span>
                        </div>
                        <div>
                          <h3 className="font-medium text-blue-800">
                            Category Focus
                          </h3>
                          <p className="text-sm text-blue-600">
                            Most of your tasks are in the {categoryData[0].name}{" "}
                            category. Consider balancing your focus areas.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="bg-purple-50 rounded-lg p-4">
                    <div className="flex items-start">
                      <div className="bg-purple-100 p-2 rounded-full mr-3">
                        <span className="text-lg">⏰</span>
                      </div>
                      <div>
                        <h3 className="font-medium text-purple-800">
                          Priority-Based Time Blocking
                        </h3>
                        <p className="text-sm text-purple-600">
                          Allocate larger time blocks for your high priority tasks (45% impact) and smaller ones for lower priority tasks.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-indigo-50 rounded-lg p-4">
                    <div className="flex items-start">
                      <div className="bg-indigo-100 p-2 rounded-full mr-3">
                        <span className="text-lg">🎯</span>
                      </div>
                      <div>
                        <h3 className="font-medium text-indigo-800">
                          Set Clear Priorities
                        </h3>
                        <p className="text-sm text-indigo-600">
                          Make sure to properly assign priorities to your tasks: high (45%), medium (35%), low (20%).
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Export Section */}
            <div className="mt-8 flex justify-center">
              <button
                onClick={() => {
                  window.print();
                }}
                className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
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
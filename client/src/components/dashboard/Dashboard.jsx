import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  // Feature cards data
  const features = [
    {
      id: 'mood',
      title: 'Track Mood & Journal',
      description: 'Record how you feel today and write your thoughts',
      icon: '📝',
      color: 'bg-blue-100',
      iconColor: 'text-blue-500',
      path: '/mood'
    },
    {
      id: 'dashboard',
      title: 'View Mood Dashboard',
      description: 'Visualize your mood patterns and trends over time',
      icon: '📊',
      color: 'bg-purple-100',
      iconColor: 'text-purple-500',
      path: '/dashboard/insights'
    },
    {
      id: 'resources',
      title: 'Wellness Resources',
      description: 'Access tips, articles, and tools for mental wellness',
      icon: '🧠',
      color: 'bg-green-100',
      iconColor: 'text-green-500',
      path: '/wellness-resources'
    },
    {
      id: 'todo',
      title: 'Maintain Todo List',
      description: 'Organize your tasks and boost your productivity',
      icon: '✅',
      color: 'bg-amber-100',
      iconColor: 'text-amber-500',
      path: '/todo'
    }
  ];

  // Random inspirational quote
  const quotes = [
    "Mental health is not a destination, but a process.",
    "Progress, not perfection.",
    "Your mental health is a priority.",
    "Self-care is how you take your power back.",
    "You don't have to be positive all the time. It's perfectly okay to feel sad, angry, annoyed, frustrated, scared or anxious. Having feelings doesn't make you a negative person. It makes you human."
  ];
  
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

  // Animation variants for staggered animations
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-purple-50 to-white">
      <div className="py-10">
        <main>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Welcome Section */}
            <motion.div 
              className="text-center mb-10"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                Welcome back, {user?.name || 'Friend'}!
              </h1>
              <p className="mt-3 text-xl text-gray-600 max-w-2xl mx-auto">
                What would you like to do today?
              </p>
            </motion.div>

            {/* Feature Cards */}
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
              variants={container}
              initial="hidden"
              animate="show"
            >
              {features.map((feature) => (
                <motion.div 
                  key={feature.id}
                  variants={item}
                  className="group relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  <Link to={feature.path} className="block h-full">
                    <div className="p-6 h-full flex flex-col">
                      <div className={`w-12 h-12 ${feature.color} rounded-full flex items-center justify-center ${feature.iconColor} mb-4`}>
                        <span className="text-2xl" role="img" aria-label={feature.title}>
                          {feature.icon}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                      <p className="text-gray-600 flex-grow">{feature.description}</p>
                      <div className="mt-4 flex items-center text-primary-600 font-medium">
                        <span>Get Started</span>
                        <svg 
                          className="ml-1 w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200" 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>

            {/* Motivational Quote */}
            <motion.div 
              className="bg-white rounded-lg shadow-md p-6 mb-8 max-w-3xl mx-auto border-l-4 border-primary-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <p className="text-gray-700 text-lg italic">{randomQuote}</p>
            </motion.div>

            {/* Recent Activity Section (placeholder) */}
            <motion.div 
              className="bg-white rounded-lg shadow-md overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              <div className="px-6 py-5 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Your Recent Activity</h3>
              </div>
              <div className="px-6 py-8 flex flex-col items-center justify-center h-48">
                <svg 
                  className="w-16 h-16 text-gray-300" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={1.5} 
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" 
                  />
                </svg>
                <p className="mt-4 text-gray-500 text-center">
                  Start tracking your mood to see your activity here.
                </p>
                <Link 
                  to="/mood" 
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 transition-colors duration-200"
                >
                  Record Your First Mood
                </Link>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
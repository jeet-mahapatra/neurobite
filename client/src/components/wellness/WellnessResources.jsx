import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

// Import sub-components
import BlogSection from './sections/BlogSection';
import QuickTipsSection from './sections/QuickTipsSection';
import DailyRoutineSection from './sections/DailyRoutineSection';
import TodaysChallenge from './sections/TodaysChallenge';
// import SoothingSoundSection from './sections/SoothingSoundSection';
import QuoteOfTheDay from './sections/QuoteOfTheDay';
// Removed ToDoList import

const WellnessResources = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-purple-50 to-white">
      {/* Back button (for mobile) */}
      <div className="block sm:hidden absolute top-20 left-4 z-10">
        <button 
          onClick={() => navigate('/dashboard')}
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
      
      <div className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Title */}
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold text-gray-900">
              Wellness Resources
            </h1>
            <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
              Tools, tips, and resources to enhance your mental wellbeing journey.
            </p>
          </motion.div>
          
          {/* Main Content - Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-10">
              {/* Blog Articles Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <BlogSection />
              </motion.div>

              {/* Daily Routine Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <DailyRoutineSection />
              </motion.div>
              
              {/* Quick Health Tips Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <QuickTipsSection />
              </motion.div>
            </div>
            
            {/* Right Column - Sidebar */}
            <div className="space-y-8">
              {/* Today's Challenge */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <TodaysChallenge />
              </motion.div>
              
              {/* Quote of the Day */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <QuoteOfTheDay />
              </motion.div>
              
              {/* Removed Todo List */}
              
              {/* Soothing Sound - Commented out 
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <SoothingSoundSection />
              </motion.div>
              */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WellnessResources;
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// Navbar component
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full z-30 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-sm shadow-sm' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-2xl mr-2">🧠</span>
              <span className="text-xl font-semibold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
                NeuroBite
              </span>
            </Link>
          </div>
          
          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
          
          {/* Desktop menu */}
          <div className="hidden sm:flex sm:items-center sm:ml-6 space-x-8">
            <Link to="/" className="text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors">
              Home
            </Link>
            <a href="#features" className="text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors">
              How It Works
            </a>
            <Link to="/login" className="text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors">
              Login
            </Link>
            <Link 
              to="/register" 
              className="text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 px-4 py-2 rounded-md transition-colors"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div className={`${isOpen ? 'block' : 'hidden'} sm:hidden bg-white shadow-lg`}>
        <div className="pt-2 pb-3 space-y-1 px-4">
          <Link 
            to="/" 
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>
          <a 
            href="#features" 
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
            onClick={() => setIsOpen(false)}
          >
            Features
          </a>
          <a 
            href="#how-it-works" 
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
            onClick={() => setIsOpen(false)}
          >
            How It Works
          </a>
          <Link 
            to="/login"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
            onClick={() => setIsOpen(false)}
          >
            Login
          </Link>
          <Link 
            to="/register" 
            className="block px-3 py-2 rounded-md text-base font-medium text-white bg-primary-600 hover:bg-primary-700"
            onClick={() => setIsOpen(false)}
          >
            Sign Up
          </Link>
        </div>
      </div>
    </nav>
  );
};

// Hero section
const Hero = () => {
  return (
    <div className="relative bg-gradient-to-b from-white via-blue-50 to-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight">
              Balance Emotions
              <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                {" "}& Productivity
              </span>
            </h1>
            <p className="mt-4 text-xl text-gray-600 max-w-lg">
              Track your moods, manage tasks by priority, and discover personalized wellness insights to enhance your mental health journey.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link 
                to="/register" 
                className="px-6 py-3 rounded-lg bg-primary-600 text-white font-medium shadow-md hover:bg-primary-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                Start For Free
              </Link>
              <a 
                href="#features" 
                className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
              >
                Explore Features
              </a>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="hidden md:flex justify-center"
          >
            <div className="relative w-80 h-80">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-8xl">🧠</div>
              </div>
              <div className="absolute -top-4 -left-4 w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center text-2xl">
                😊
              </div>
              <div className="absolute top-12 -right-8 w-14 h-14 bg-secondary-100 rounded-full flex items-center justify-center text-xl">
                📝
              </div>
              <div className="absolute -bottom-2 right-12 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-2xl">
                🏃
              </div>
              <div className="absolute bottom-16 -left-6 w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-lg">
                ✅
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Background shapes */}
      <div className="hidden sm:block absolute top-1/4 right-0 w-40 h-40 bg-primary-100 rounded-full blur-3xl opacity-60 -z-10"></div>
      <div className="hidden sm:block absolute bottom-1/4 left-0 w-60 h-60 bg-secondary-100 rounded-full blur-3xl opacity-60 -z-10"></div>
    </div>
  );
};

// Feature card component
const FeatureCard = ({ icon, title, description }) => {
  return (
    <motion.div 
      className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow"
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 mb-4">
        <span className="text-2xl">{icon}</span>
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  );
};

// Features section
const Features = () => {
  return (
    <div id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            A Complete Solution for Mental Wellness
          </h2>
          <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
            NeuroBite combines mood tracking, priority-based task management, and wellness resources in one unified platform.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard 
            icon="😊" 
            title="Mood Tracking" 
            description="Track emotions with our simple mood diary and visualize patterns through insightful charts and calendars."
          />
          <FeatureCard 
            icon="✅" 
            title="Priority Tasks" 
            description="Organize tasks by high (45%), medium (35%), and low (20%) priorities to maximize your productivity score."
          />
          <FeatureCard 
            icon="📊" 
            title="Productivity Insights" 
            description="Get personalized productivity reports with metrics that help you understand your work patterns."
          />
          <FeatureCard 
            icon="🧘" 
            title="Wellness Resources" 
            description="Access curated articles, daily challenges, and health tips to support your mental well-being journey."
          />
        </div>
      </div>
    </div>
  );
};

// How it works step component
const Step = ({ number, title, description, delay = 0 }) => {
  return (
    <motion.div 
      className="flex flex-col items-center text-center px-4"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
    >
      <div className="w-12 h-12 rounded-full bg-primary-600 text-white flex items-center justify-center text-xl font-bold mb-4">
        {number}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  );
};

// How it works section
const HowItWorks = () => {
  return (
    <div id="how-it-works" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            How NeuroBite Works
          </h2>
          <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
            Four simple steps to improve your mental wellness and productivity
          </p>
        </div>
        
        <div className="relative">
          {/* Connecting line */}
          <div className="absolute top-6 left-0 w-full h-0.5 bg-gray-200 hidden md:block"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Step 
              number="1" 
              title="Track Your Mood" 
              description="Record how you're feeling daily using our simple emoji-based mood tracker with journal functionality."
              delay={0.1}
            />
            <Step 
              number="2" 
              title="Manage Tasks" 
              description="Create and organize tasks by priority levels to maximize your productivity score."
              delay={0.2}
            />
            <Step 
              number="3" 
              title="Access Resources" 
              description="Explore wellness articles and health tips personalized to your needs and interests."
              delay={0.3}
            />
            <Step 
              number="4" 
              title="Review Insights" 
              description="Analyze your mood patterns and task completion rates through beautiful, interactive visualizations."
              delay={0.4}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Testimonial component
const Testimonial = ({ quote, author, role }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
      <div className="flex items-center mb-4">
        <div className="text-4xl text-primary-400">❝</div>
      </div>
      <p className="text-gray-700 mb-6 italic">{quote}</p>
      <div>
        <p className="text-gray-900 font-medium">{author}</p>
        <p className="text-gray-600 text-sm">{role}</p>
      </div>
    </div>
  );
};

// Testimonials section
const Testimonials = () => {
  return (
    <div className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            What Our Users Say
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Testimonial 
            quote="The priority-based task management changed how I work. Being able to see that high priority tasks contribute 45% to my productivity score helps me focus on what truly matters."
            author="Sarah Johnson"
            role="Project Manager"
          />
          <Testimonial 
            quote="I love how the mood tracking integrates with the productivity features. Seeing the correlation between my emotional state and task completion has been eye-opening."
            author="Michael Chen"
            role="Software Developer"
          />
        </div>
      </div>
    </div>
  );
};

// Call to action section
const CTA = () => {
  return (
    <div className="py-12 bg-gradient-to-r from-primary-500 to-primary-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Ready to Balance Mood and Productivity?
          </h2>
          <p className="mt-4 text-xl text-white/90 max-w-2xl mx-auto">
            Join thousands who are tracking their emotions and maximizing productivity with our priority-based system.
          </p>
          <div className="mt-8">
            <Link 
              to="/register" 
              className="inline-block px-8 py-3 rounded-lg bg-white text-primary-600 font-medium shadow-md hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-600"
            >
              Start Free Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

// Footer component
const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <span className="text-2xl mr-2">🧠</span>
              <span className="text-xl font-semibold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
                NeuroBite
              </span>
            </div>
            <p className="text-gray-600 max-w-md">
              Track your moods, manage tasks by priority, and discover wellness resources to enhance your mental well-being and productivity.
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
              Features
            </h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-600 hover:text-primary-600 transition-colors">
                  Mood Tracking
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-primary-600 transition-colors">
                  Priority-Based Tasks
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-primary-600 transition-colors">
                  Productivity Reports
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-primary-600 transition-colors">
                  Wellness Resources
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
              Legal
            </h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-600 hover:text-primary-600 transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-primary-600 transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-primary-600 transition-colors">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-200 text-center">
          <p className="text-gray-600 text-sm">
            &copy; {new Date().getFullYear()} NeuroBite. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

// Main landing page component
const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <Testimonials />
      <CTA />
      <Footer />
    </div>
  );
};

export default LandingPage;
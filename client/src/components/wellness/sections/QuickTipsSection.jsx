import { useRef } from 'react';

const QuickTipsSection = () => {
  const scrollContainerRef = useRef(null);
  
  // Health tips data
  const healthTips = [
    {
      id: 1,
      icon: "💧",
      title: "Hydrate Well",
      description: "Drink 8 glasses of water daily to maintain energy levels and cognitive function.",
      color: "bg-blue-50 border-blue-200"
    },
    {
      id: 2,
      icon: "💤",
      title: "Screen-Free Bedtime",
      description: "Avoid screens 30 mins before bed to improve sleep quality and reduce insomnia.",
      color: "bg-indigo-50 border-indigo-200"
    },
    {
      id: 3,
      icon: "🙏",
      title: "Gratitude Practice",
      description: "Write down three things you're grateful for before bed to improve mental health.",
      color: "bg-purple-50 border-purple-200"
    },
    {
      id: 4,
      icon: "🧘",
      title: "Mindful Breathing",
      description: "Practice 5 minutes of deep breathing daily to reduce stress and improve focus.",
      color: "bg-green-50 border-green-200"
    },
    {
      id: 5,
      icon: "🌿",
      title: "Nature Connection",
      description: "Spend at least 20 minutes outdoors daily to reduce anxiety and boost mood.",
      color: "bg-emerald-50 border-emerald-200"
    },
    {
      id: 6,
      icon: "📱",
      title: "Digital Detox",
      description: "Schedule regular breaks from social media to improve mental clarity and focus.",
      color: "bg-amber-50 border-amber-200"
    },
    {
      id: 7,
      icon: "🎵",
      title: "Music Therapy",
      description: "Listen to calming music to reduce stress hormone levels and elevate mood.",
      color: "bg-rose-50 border-rose-200"
    },
    {
      id: 8,
      icon: "🚶",
      title: "Movement Breaks",
      description: "Take a 5-minute walking break every hour to improve circulation and energy.",
      color: "bg-cyan-50 border-cyan-200"
    }
  ];
  
  // Scroll functions
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };
  
  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  return (
    <section className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-green-500 to-teal-500">
        <h2 className="text-2xl font-bold text-white">Quick Health Tips</h2>
      </div>
      
      <div className="p-6">
        <div className="relative">
          {/* Scroll buttons */}
          <button 
            onClick={scrollLeft} 
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white bg-opacity-70 hover:bg-opacity-90 rounded-full p-2 shadow-md focus:outline-none"
            aria-label="Scroll left"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          {/* Scrollable container */}
          <div 
            ref={scrollContainerRef}
            className="flex overflow-x-auto py-4 scrollbar-hide space-x-4 px-2"
            style={{ scrollBehavior: 'smooth' }}
          >
            {healthTips.map((tip) => (
              <div 
                key={tip.id}
                className={`flex-shrink-0 w-72 p-5 rounded-lg border ${tip.color} transition-transform duration-300 hover:scale-105 hover:shadow-md`}
              >
                <div className="flex items-start">
                  <span className="text-3xl mr-4">{tip.icon}</span>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">{tip.title}</h3>
                    <p className="text-gray-600 text-sm">{tip.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Right scroll button */}
          <button 
            onClick={scrollRight} 
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white bg-opacity-70 hover:bg-opacity-90 rounded-full p-2 shadow-md focus:outline-none"
            aria-label="Scroll right"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default QuickTipsSection;
import { Link } from 'react-router-dom';

const ExploreMore = () => {
  const features = [
    {
      title: 'Predict My Mood',
      description: 'AI-powered mood prediction based on your patterns',
      icon: '🤖',
      color: 'bg-purple-100',
      textColor: 'text-purple-800',
      path: '/predict',
      available: false
    },
    {
      title: 'AI Chat for Mental Health',
      description: 'Talk to our AI companion about your feelings',
      icon: '💬',
      color: 'bg-indigo-100',
      textColor: 'text-indigo-800',
      path: '/chat',
      available: false
    },
    {
      title: 'Guided Journaling',
      description: 'Structured prompts to help you express your feelings',
      icon: '✏️',
      color: 'bg-green-100',
      textColor: 'text-green-800',
      path: '/guided',
      available: false
    }
  ];

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 gap-4">
        {features.map((feature, index) => (
          <div
            key={index}
            className={`
              ${feature.color} ${feature.textColor} p-4 rounded-lg
              ${feature.available ? 'hover:shadow-md cursor-pointer' : 'opacity-70 cursor-default'}
              transition-all duration-200
            `}
          >
            <div className="flex items-center">
              <div className="text-2xl mr-3">{feature.icon}</div>
              <div className="flex-1">
                <h3 className="font-medium">{feature.title}</h3>
                <p className="text-sm">{feature.description}</p>
              </div>
              {feature.available ? (
                <Link 
                  to={feature.path}
                  className="flex items-center justify-center w-8 h-8 rounded-full bg-white/50 hover:bg-white text-gray-800"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ) : (
                <span className="px-2 py-1 text-xs bg-white/30 rounded-full">Coming soon</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExploreMore;
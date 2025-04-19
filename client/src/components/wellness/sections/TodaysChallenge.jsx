import { useState, useEffect } from 'react';

const TodaysChallenge = () => {
  const [challenge, setChallenge] = useState(null);
  const [completed, setCompleted] = useState(false);
  
  // List of possible challenges
  const challenges = [
    {
      id: 1,
      title: "Smile at 3 strangers",
      description: "A simple smile can brighten someone's day and boost your own mood.",
      icon: "😊"
    },
    {
      id: 2,
      title: "Compliment 2 people",
      description: "Genuine compliments create positive connections and spread happiness.",
      icon: "👏"
    },
    {
      id: 3,
      title: "Take a 15-minute nature walk",
      description: "Spending time in nature reduces stress and improves mental clarity.",
      icon: "🌳"
    },
    {
      id: 4,
      title: "Try a 5-minute meditation",
      description: "Short meditations can reset your mind and reduce anxiety.",
      icon: "🧘"
    },
    {
      id: 5,
      title: "Write down 3 things you're grateful for",
      description: "Practicing gratitude boosts happiness and reduces negative thinking.",
      icon: "🙏"
    },
    {
      id: 6,
      title: "Drink 8 glasses of water today",
      description: "Proper hydration improves mood, cognition and physical wellbeing.",
      icon: "💧"
    },
    {
      id: 7,
      title: "Try a new healthy recipe",
      description: "Exploring nutritious foods can be both fun and beneficial for your health.",
      icon: "🥗"
    }
  ];
  
  // Load or set a new challenge on component mount
  useEffect(() => {
    // Check localStorage for today's date and challenge
    const today = new Date().toDateString();
    const savedChallenge = localStorage.getItem('todaysChallenge');
    const savedDate = localStorage.getItem('challengeDate');
    const savedCompleted = localStorage.getItem('challengeCompleted');
    
    // If we have a saved challenge for today, use it
    if (savedChallenge && savedDate === today) {
      setChallenge(JSON.parse(savedChallenge));
      setCompleted(savedCompleted === 'true');
    } else {
      // Otherwise pick a new random challenge
      const randomIndex = Math.floor(Math.random() * challenges.length);
      setChallenge(challenges[randomIndex]);
      localStorage.setItem('todaysChallenge', JSON.stringify(challenges[randomIndex]));
      localStorage.setItem('challengeDate', today);
      localStorage.setItem('challengeCompleted', 'false');
    }
  }, []);

  // Handle challenge completion
  const toggleComplete = () => {
    const newCompletedState = !completed;
    setCompleted(newCompletedState);
    localStorage.setItem('challengeCompleted', newCompletedState.toString());
  };
  
  if (!challenge) return null;

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-amber-500 to-yellow-500">
        <h2 className="text-xl font-bold text-white">Today's Challenge</h2>
      </div>
      
      <div className="p-5">
        <div className="flex items-center justify-center mb-4">
          <span className="text-5xl">{challenge.icon}</span>
        </div>
        
        <h3 className="text-lg font-bold text-center text-gray-900 mb-2">
          {challenge.title}
        </h3>
        
        <p className="text-gray-600 text-center mb-5">
          {challenge.description}
        </p>
        
        <button
          onClick={toggleComplete}
          className={`w-full flex items-center justify-center py-3 px-4 rounded-lg font-medium transition-colors ${
            completed 
              ? 'bg-green-100 text-green-700 border border-green-200' 
              : 'bg-amber-100 text-amber-700 border border-amber-200 hover:bg-amber-200'
          }`}
        >
          {completed ? (
            <>
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Completed!
            </>
          ) : (
            <>
              Mark as Complete
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default TodaysChallenge;
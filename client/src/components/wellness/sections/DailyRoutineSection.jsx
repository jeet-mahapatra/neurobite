const DailyRoutineSection = () => {
    // Routine data
    const routineSteps = [
      {
        time: "6:30 AM",
        activity: "Wake up & hydrate",
        emoji: "🕕",
        description: "Start your day with a glass of water to rehydrate your body after sleep",
        color: "bg-blue-50"
      },
      {
        time: "7:00 AM",
        activity: "10 mins meditation",
        emoji: "🧘",
        description: "Practice mindfulness to center yourself and prepare for the day",
        color: "bg-indigo-50"
      },
      {
        time: "8:00 AM",
        activity: "Healthy breakfast",
        emoji: "🍎",
        description: "Fuel your body with protein, complex carbs and healthy fats",
        color: "bg-green-50"
      },
      {
        time: "9:00 AM",
        activity: "Start work/study",
        emoji: "💻",
        description: "Begin with your most important or challenging tasks when your mind is fresh",
        color: "bg-amber-50"
      },
      {
        time: "1:00 PM",
        activity: "Short journaling",
        emoji: "📓",
        description: "Take 5 minutes to reflect on your morning and set intentions for afternoon",
        color: "bg-purple-50"
      },
      {
        time: "5:30 PM",
        activity: "Light walk/exercise",
        emoji: "🏃‍♂️",
        description: "Movement helps transition from work mode to relaxation",
        color: "bg-pink-50"
      },
      {
        time: "9:30 PM",
        activity: "Offline wind-down",
        emoji: "📴",
        description: "Put away electronic devices and prepare your mind for quality sleep",
        color: "bg-teal-50"
      },
      {
        time: "10:00 PM",
        activity: "Sleep",
        emoji: "😴",
        description: "Aim for 7-8 hours of quality sleep for optimal mental health",
        color: "bg-blue-50"
      }
    ];
  
    return (
      <section className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-indigo-500 to-purple-500">
          <h2 className="text-2xl font-bold text-white">Suggested Daily Routine</h2>
        </div>
        
        <div className="p-6">
          <p className="text-gray-600 mb-6">
            This balanced daily routine is designed to support your mental wellbeing. Adapt it to your personal schedule while maintaining the core wellness elements.
          </p>
          
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200"></div>
            
            {/* Timeline events */}
            <div className="space-y-6">
              {routineSteps.map((step, index) => (
                <div key={index} className="relative flex items-start">
                  <div className={`absolute left-8 top-5 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full border-4 border-white shadow-sm z-10 ${step.color}`}></div>
                  <div className="flex-none w-16 pt-1 text-right text-sm font-medium text-gray-500">
                    {step.time}
                  </div>
                  <div className="flex-grow pl-10">
                    <div className={`p-4 rounded-lg ${step.color}`}>
                      <div className="flex items-center mb-1">
                        <span className="text-2xl mr-2">{step.emoji}</span>
                        <h3 className="font-bold text-gray-900">{step.activity}</h3>
                      </div>
                      <p className="text-sm text-gray-600">{step.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  };
  
  export default DailyRoutineSection;
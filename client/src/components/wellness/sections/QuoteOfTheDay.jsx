import { useState, useEffect } from 'react';

const QuoteOfTheDay = () => {
  const [quote, setQuote] = useState(null);

  // List of motivational quotes
  const quotes = [
    {
      text: "Mental health is not a destination, but a process. It's about how you drive, not where you're going.",
      author: "Noam Shpancer"
    },
    {
      text: "You don't have to be positive all the time. It's perfectly okay to feel sad, angry, annoyed, frustrated, scared and anxious. Having feelings doesn't make you a negative person. It makes you human.",
      author: "Lori Deschene"
    },
    {
      text: "Self-care is not self-indulgence, it is self-preservation.",
      author: "Audre Lorde"
    },
    {
      text: "The strongest people are those who win battles we know nothing about.",
      author: "Unknown"
    },
    {
      text: "You are not your illness. You have an individual story to tell. You have a name, a history, a personality. Staying yourself is part of the battle.",
      author: "Julian Seifter"
    },
    {
      text: "Recovery is not one and done. It is a lifelong journey that takes place one day, one step at a time.",
      author: "Unknown"
    },
    {
      text: "Sometimes the people around you won't understand your journey. They don't need to, it's not for them.",
      author: "Joubert Botha"
    },
    {
      text: "Be proud of yourself for how hard you're trying.",
      author: "Unknown"
    },
    {
      text: "There is hope, even when your brain tells you there isn't.",
      author: "John Green"
    }
  ];

  useEffect(() => {
    // Check if we already have a quote for today
    const today = new Date().toDateString();
    const savedQuote = localStorage.getItem('dailyQuote');
    const savedDate = localStorage.getItem('quoteDate');
    
    if (savedQuote && savedDate === today) {
      setQuote(JSON.parse(savedQuote));
    } else {
      // Pick a new random quote
      const randomIndex = Math.floor(Math.random() * quotes.length);
      setQuote(quotes[randomIndex]);
      localStorage.setItem('dailyQuote', JSON.stringify(quotes[randomIndex]));
      localStorage.setItem('quoteDate', today);
    }
  }, []);
  
  if (!quote) return null;

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-purple-500 to-pink-500">
        <h2 className="text-xl font-bold text-white">Quote of the Day</h2>
      </div>
      
      <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="text-4xl text-center text-purple-300 mb-2">❝</div>
        <p className="text-lg text-gray-700 text-center italic mb-4">
          {quote.text}
        </p>
        
        <div className="flex justify-center">
          <p className="text-sm text-gray-500">— {quote.author}</p>
        </div>
      </div>
    </div>
  );
};

export default QuoteOfTheDay;
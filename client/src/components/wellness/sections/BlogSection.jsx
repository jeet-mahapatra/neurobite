import { useState } from 'react';

const BlogSection = () => {
  const [activeTab, setActiveTab] = useState(0);
  
  // Blog content
  const blogs = [
    {
      id: 1,
      title: "5 Ways to Instantly Boost Your Mood",
      content: `
        Feeling down? Sometimes we need a quick mood boost to get through challenging moments in our day. Here are five science-backed strategies you can use right away:

        First, try physical movement. Even a 5-minute walk or quick stretch session releases endorphins—your brain's natural mood elevators. The change in environment also breaks negative thought patterns.

        Second, practice gratitude. Take 60 seconds to write down or mentally list three specific things you're thankful for right now. This simple act shifts your focus from what's lacking to what's present.

        Third, connect with someone. Send a message to a friend, call a family member, or have a brief chat with a colleague. Social connection triggers oxytocin release, creating feelings of trust and bonding.

        Fourth, use music strategically. Create a "mood boost" playlist with songs that energize you or bring back positive memories. Music directly influences our emotional state through neural pathways.

        Finally, practice deep breathing. Try the 4-7-8 technique: inhale for 4 counts, hold for 7, exhale for 8. This activates your parasympathetic nervous system, reducing stress hormones almost immediately.

        The best part? Each of these strategies takes less than five minutes but can shift your mood significantly. Try incorporating one or two into your daily routine, especially during typical low-energy periods.
      `,
      author: "Dr. Emma Chen",
      date: "April 12, 2025",
      readTime: "4 min read",
      image: "https://images.unsplash.com/photo-1499728603263-13726abce5fd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80"
    },
    {
      id: 2,
      title: "How to Handle Stress in College or Work",
      content: `
        Stress in academic and professional settings is inevitable, but managing it effectively makes all the difference in your performance and wellbeing.

        Begin by identifying your specific stressors. Are they deadlines, presentations, social interactions, or something else? Naming what overwhelms you makes it more manageable and less abstract.

        Next, implement the "time blocking" technique. Rather than multitasking (which research shows decreases productivity by up to 40%), dedicate focused blocks of time to specific tasks, with short breaks between. The Pomodoro Technique—25 minutes of focused work followed by a 5-minute break—works well for many.

        When feeling overwhelmed, practice "brain dumping." Write down everything on your mind—tasks, worries, ideas—without organization or judgment. This frees up mental bandwidth and reduces the cognitive load causing your stress.

        Physical management matters too. During stressful periods, prioritize sleep, even if it means adjusting your schedule. Sleep deprivation impairs cognitive function and emotional regulation, creating a counterproductive cycle.

        Lastly, implement boundaries. Learn to say "no" to additional commitments when you're already at capacity. Set designated "off hours" for email and work messages. Creating these barriers prevents burnout and actually improves overall productivity.

        Remember: stress management isn't about eliminating stress completely, but developing systems to process it effectively.
      `,
      author: "Prof. Michael Lin",
      date: "April 10, 2025",
      readTime: "5 min read",
      image: "https://images.unsplash.com/photo-1471107340929-a87cd0f5b5f3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80"
    },
    {
      id: 3,
      title: "Why Journaling Helps with Mental Health",
      content: `
        The simple act of journaling has profound effects on our mental wellbeing, backed by substantial research across psychology, neuroscience, and behavioral medicine.

        When we journal, we engage in what psychologists call "emotional processing." This involves identifying, examining, and making meaning of our feelings. Research shows this process reduces the intensity of negative emotions while helping us gain valuable insights.

        Brain imaging studies reveal that putting feelings into words (a process called "affect labeling") reduces activity in the amygdala, our brain's emotional center, while activating the prefrontal cortex, responsible for higher-level thinking. This neurological shift literally helps us think more clearly about our emotions.

        Journaling also creates a record of our experiences and growth. During difficult periods, reviewing past journal entries can remind us of how we've overcome challenges before, building resilience and perspective.

        For those dealing with anxiety, journaling interrupts rumination cycles—those repetitive thought patterns that keep us trapped in worry. Writing helps externalize these thoughts, allowing us to examine them more objectively.

        To begin journaling effectively, start small with just 5-10 minutes daily. Don't worry about grammar or structure; focus on authenticity. Try writing prompts like "Today, I felt..." or "I'm currently challenged by..." to get started.

        Remember, journaling isn't about creating perfect prose—it's about creating a regular practice of self-reflection that supports your mental wellbeing.
      `,
      author: "Dr. Sarah Johnson",
      date: "April 8, 2025",
      readTime: "4 min read",
      image: "https://images.unsplash.com/photo-1517842645767-c639042777db?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80"
    },
  ];

  return (
    <section className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-primary-500 to-purple-500">
        <h2 className="text-2xl font-bold text-white">Wellness Articles</h2>
      </div>

      {/* Navigation tabs */}
      <div className="bg-white">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px overflow-x-auto scrollbar-hide">
            {blogs.map((blog, index) => (
              <button
                key={blog.id}
                onClick={() => setActiveTab(index)}
                className={`py-4 px-6 font-medium text-sm border-b-2 whitespace-nowrap ${
                  activeTab === index
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {blog.title}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Article content - Redesigned layout */}
      <div className="p-6">
        {blogs[activeTab] && (
          <article>
            <div className="flex flex-col md:flex-row gap-8">
              {/* Image container with fixed aspect ratio */}
              <div className="md:w-2/5 lg:w-1/3 flex-shrink-0">
                <div className="aspect-w-4 aspect-h-3 rounded-lg overflow-hidden shadow-md">
                  <img 
                    src={blogs[activeTab].image} 
                    alt={blogs[activeTab].title}
                    className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
                  />
                </div>
                
                {/* Author info under the image on desktop */}
                <div className="hidden md:flex items-center mt-4 text-sm text-gray-500">
                  <img 
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(blogs[activeTab].author.replace('Dr. ', '').replace('Prof. ', ''))}&background=random`} 
                    alt={blogs[activeTab].author}
                    className="w-8 h-8 rounded-full mr-2"
                  />
                  <div>
                    <p className="font-medium text-gray-700">{blogs[activeTab].author}</p>
                    <div className="flex items-center">
                      <span>{blogs[activeTab].date}</span>
                      <span className="mx-2">•</span>
                      <span>{blogs[activeTab].readTime}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Content section */}
              <div className="md:w-3/5 lg:w-2/3">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {blogs[activeTab].title}
                </h3>
                
                {/* Author info visible only on mobile */}
                <div className="flex md:hidden items-center text-sm text-gray-500 mb-4">
                  <img 
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(blogs[activeTab].author.replace('Dr. ', '').replace('Prof. ', ''))}&background=random`} 
                    alt={blogs[activeTab].author}
                    className="w-6 h-6 rounded-full mr-2"
                  />
                  <span>{blogs[activeTab].author}</span>
                  <span className="mx-2">•</span>
                  <span>{blogs[activeTab].date}</span>
                  <span className="mx-2">•</span>
                  <span>{blogs[activeTab].readTime}</span>
                </div>
                
                {/* Article content with improved typography */}
                <div className="prose prose-lg max-w-none">
                  {blogs[activeTab].content.split('\n\n').map((paragraph, idx) => (
                    <p key={idx} className="mb-4 text-gray-700 leading-relaxed">
                      {paragraph.trim()}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </article>
        )}
      </div>
      
      {/* Share and read more section */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
        <div className="flex flex-wrap justify-between items-center">
          <div className="flex items-center space-x-4">
            <button className="text-gray-600 hover:text-primary-500 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </button>
            <button className="text-gray-600 hover:text-primary-500 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </button>
          </div>
          <button className="mt-3 sm:mt-0 text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors">
            Browse all wellness articles →
          </button>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
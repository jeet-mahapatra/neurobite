const Footer = () => {
    return (
      <footer className="bg-white mt-12 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <span className="text-2xl mr-2">🧠</span>
              <span className="text-xl font-semibold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
                NeuroBite
              </span>
            </div>
            
            <div className="text-center md:text-right">
              <p className="text-gray-600 text-sm">
                &copy; {new Date().getFullYear()} NeuroBite. All rights reserved.
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Your mental wellness companion
              </p>
            </div>
          </div>
        </div>
      </footer>
    );
  };
  
  export default Footer;
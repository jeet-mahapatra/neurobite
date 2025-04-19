import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const Navbar = ({ activePage = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Modified logo link to go to dashboard if user is logged in
  const logoLinkPath = user ? "/dashboard" : "/";

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-30 transition-all duration-300 ${
        scrolled ? "bg-white/90 backdrop-blur-sm shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            {/* Updated Link to use the dynamic path based on auth status */}
            <Link to={logoLinkPath} className="flex items-center">
              <span className="text-2xl mr-2">🧠</span>
              <span className="text-xl font-semibold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
                NeuroBite
              </span>
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden sm:flex sm:items-center sm:space-x-8">
            <Link
              to="/dashboard"
              className={`text-sm font-medium ${
                activePage === "dashboard"
                  ? "text-primary-600"
                  : "text-gray-700 hover:text-primary-600"
              } transition-colors`}
            >
              Dashboard
            </Link>
            <Link
              to="/mood"
              className={`text-sm font-medium ${
                activePage === "mood"
                  ? "text-primary-600"
                  : "text-gray-700 hover:text-primary-600"
              } transition-colors`}
            >
              Track Mood
            </Link>
            <Link
              to="/dashboard/insights"
              className={`text-sm font-medium ${
                activePage === "insights"
                  ? "text-primary-600"
                  : "text-gray-700 hover:text-primary-600"
              } transition-colors`}
            >
              Insights
            </Link>
            <Link
              to="/wellness-resources"
              className={`text-sm font-medium ${
                activePage === "wellness"
                  ? "text-primary-600"
                  : "text-gray-700 hover:text-primary-600"
              } transition-colors`}
            >
              Wellness Resources
            </Link>
            <Link
              to="/todo"
              className={`text-sm font-medium ${
                activePage === "todo"
                  ? "text-primary-600"
                  : "text-gray-700 hover:text-primary-600"
              } transition-colors`}
            >
              Todo List
            </Link>
            <Link
              to="/productivity-report"
              className={`text-sm font-medium ${
                activePage === "productivity-report"
                  ? "text-primary-600"
                  : "text-gray-700 hover:text-primary-600"
              } transition-colors`}
            >
              Productivity Report
            </Link>
            <button
              onClick={handleLogout}
              className="text-sm font-medium text-white bg-primary-600 px-4 py-2 rounded-md hover:bg-primary-700 transition-colors"
            >
              Logout
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`${
          isOpen ? "block" : "hidden"
        } sm:hidden bg-white shadow-lg`}
      >
        <div className="pt-2 pb-3 space-y-1 px-4">
          <Link
            to="/dashboard"
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              activePage === "dashboard"
                ? "text-primary-600 bg-primary-50"
                : "text-gray-700 hover:bg-gray-50"
            }`}
            onClick={() => setIsOpen(false)}
          >
            Dashboard
          </Link>
          <Link
            to="/mood"
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              activePage === "mood"
                ? "text-primary-600 bg-primary-50"
                : "text-gray-700 hover:bg-gray-50"
            }`}
            onClick={() => setIsOpen(false)}
          >
            Track Mood
          </Link>
          <Link
            to="/dashboard/insights"
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              activePage === "insights"
                ? "text-primary-600 bg-primary-50"
                : "text-gray-700 hover:bg-gray-50"
            }`}
            onClick={() => setIsOpen(false)}
          >
            Insights
          </Link>
          <Link
            to="/wellness-resources"
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              activePage === "wellness"
                ? "text-primary-600 bg-primary-50"
                : "text-gray-700 hover:bg-gray-50"
            }`}
            onClick={() => setIsOpen(false)}
          >
            Wellness Resources
          </Link>
          <Link
            to="/todo"
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              activePage === "todo"
                ? "text-primary-600 bg-primary-50"
                : "text-gray-700 hover:bg-gray-50"
            }`}
            onClick={() => setIsOpen(false)}
          >
            Todo List
          </Link>
          <Link
            to="/productivity-report"
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              activePage === "productivity-report"
                ? "text-primary-600 bg-primary-50"
                : "text-gray-700 hover:bg-gray-50"
            }`}
            onClick={() => setIsOpen(false)}
          >
            Productivity Report
          </Link>
          <button
            onClick={handleLogout}
            className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-white bg-primary-600 hover:bg-primary-700"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

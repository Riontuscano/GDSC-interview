import { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { darkMode, toggleDarkMode } = useTheme();
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const profileDropdownRef = useRef(null);

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 20);
  }, []);

  useEffect(() => {
    let scrollTimer = null;
    const onScroll = () => {
      if (scrollTimer === null) {
        scrollTimer = setTimeout(() => {
          handleScroll();
          scrollTimer = null;
        }, 50);
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (scrollTimer) clearTimeout(scrollTimer);
    };
  }, [handleScroll]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleProfileDropdown = () => setIsProfileDropdownOpen(!isProfileDropdownOpen);

  const handleLogout = () => {
    logout();
    setIsProfileDropdownOpen(false);
    navigate('/');
  };

  const userInitials = currentUser
    ? `${currentUser.firstName[0]}${currentUser.lastName[0]}`
    : 'JD';

  return (
    <nav className={`bg-ocean-600 dark:bg-ocean-900 transition-colors duration-300 ${scrolled ? 'shadow-md' : ''} relative`}>
      <div className="h-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex items-center justify-between h-full">
          {/* Logo */}
          <Link to="/" className="flex items-center text-white font-bold text-xl">
            <img src="/img/gdsc-logo.png" alt="Unplug Logo" className="h-8 w-8 mr-2" />
            <span className="font-serif">Unplug</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              {[
                { name: 'Event Overview', path: '/eventsoverview' },
                { name: 'Events', path: '/events' },
                { name: 'Timeline', path: '/timeline' },
                { name: 'Mentors', path: '/mentors' },
                { name: 'Team', path: '/team' },
              ].map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="text-white px-3 py-2 rounded-md font-medium"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Right Side: Dark Mode, Profile, Mobile */}
          <div className="flex items-center">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className={`mr-4 p-2 rounded-full ${
                darkMode ? 'bg-gray-800 text-teal-300' : 'bg-blue-100 text-blue-600'
              }`}
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                </svg>
              )}
            </button>

            {/* Profile Dropdown */}
            {currentUser ? (
              <div className="relative ml-3 mr-4" ref={profileDropdownRef}>
                <button
                  type="button"
                  className="flex items-center space-x-2 rounded-md bg-ocean-500 dark:bg-ocean-800 px-3 py-1.5 focus:outline-none"
                  onClick={toggleProfileDropdown}
                >
                  <div className={`h-8 w-8 rounded-full overflow-hidden border-2 ${
                    darkMode ? 'border-teal-400' : 'border-blue-400'
                  }`}>
                    {currentUser.profileImage ? (
                      <img src={currentUser.profileImage} alt="Profile" className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full bg-gradient-to-br from-ocean-400 to-ocean-600 dark:from-ocean-800 dark:to-ocean-950 flex items-center justify-center text-white font-semibold">
                        {userInitials}
                      </div>
                    )}
                  </div>
                  <span className="hidden sm:block text-white font-medium text-sm">
                    {currentUser.firstName}
                  </span>
                  <svg className={`h-4 w-4 text-ocean-200 transition-transform duration-200 ${
                    isProfileDropdownOpen ? 'rotate-180' : ''
                  }`} viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>

                <div
                  className={`origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg overflow-hidden transition-all duration-200 ease-in-out ${
                    isProfileDropdownOpen
                      ? 'transform opacity-100 scale-100'
                      : 'transform opacity-0 scale-95 pointer-events-none'
                  } ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
                >
                  <div className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} px-4 py-3`}>
                    <p className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {currentUser.firstName} {currentUser.lastName}
                    </p>
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {currentUser.email}
                    </p>
                  </div>
                  <div className="py-1">
                    <Link 
                      to="/profile" 
                      className={`group flex items-center px-4 py-2 text-sm ${
                        darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
                      }`} 
                      onClick={() => setIsProfileDropdownOpen(false)}
                    >
                      <svg className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                      Your Profile
                    </Link>
                    <Link 
                      to="/settings" 
                      className={`group flex items-center px-4 py-2 text-sm ${
                        darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
                      }`} 
                      onClick={() => setIsProfileDropdownOpen(false)}
                    >
                      <svg className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                      </svg>
                      Settings
                    </Link>
                    <Link 
                      to="/notifications" 
                      className={`group flex items-center px-4 py-2 text-sm ${
                        darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
                      }`} 
                      onClick={() => setIsProfileDropdownOpen(false)}
                    >
                      <svg className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                      </svg>
                      Notifications
                    </Link>
                    <button 
                      onClick={handleLogout} 
                      className={`w-full text-left group flex items-center px-4 py-2 text-sm ${
                        darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
                      }`} 
                    >
                      <svg className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V7.414l-5-5H3zm7 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                        <path d="M8 11V5.414l3.293 3.293a1 1 0 001.414-1.414l-5-5a1 1 0 00-1.414 0l-5 5a1 1 0 001.414 1.414L6 5.414V11a1 1 0 002 0z" />
                      </svg>
                      Sign out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-1.5 rounded-md font-medium text-white border border-white/30 hover:border-white/60 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className={`px-4 py-1.5 rounded-md font-medium text-white ${
                    darkMode ? 'bg-teal-600 hover:bg-teal-700' : 'bg-blue-600 hover:bg-blue-700'
                  } transition-colors`}
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <div className="ml-3 md:hidden">
              <button
                onClick={toggleMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-white"
              >
                {!isMenuOpen ? (
                  <svg className="h-6 w-6" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                ) : (
                  <svg className="h-6 w-6" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden absolute w-full bg-ocean-600 dark:bg-ocean-900 shadow-md transition-all duration-300 ease-in-out ${
          isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
        }`}
        style={{ zIndex: 40 }}
      >
        <div className="px-2 pt-2 pb-3 space-y-1">
          {/* User Info (if logged in) */}
          {currentUser && (
            <div className="flex items-center px-3 py-2 border-b border-ocean-500 dark:border-ocean-700 mb-2">
              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-ocean-800 font-medium text-lg">
                {userInitials}
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-white">
                  {currentUser.firstName} {currentUser.lastName}
                </div>
                <div className="text-sm font-medium text-ocean-200">
                  {currentUser.email}
                </div>
              </div>
            </div>
          )}

          {[
            { name: 'Event Overview', path: '/eventsoverview' },
            { name: 'Events', path: '/events' },
            { name: 'Timeline', path: '/timeline' },
            { name: 'Mentors', path: '/mentors' },
            { name: 'Team', path: '/team' },
          ].map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className="text-white block px-3 py-2 rounded-md font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}

          <div className="border-t border-ocean-500 dark:border-ocean-700 pt-2 mt-2">
            {currentUser ? (
              <>
                <Link to="/profile" className="text-white block px-3 py-2 rounded-md" onClick={() => setIsMenuOpen(false)}>
                  Your Profile
                </Link>
                <Link to="/settings" className="text-white block px-3 py-2 rounded-md" onClick={() => setIsMenuOpen(false)}>
                  Settings
                </Link>
                <Link to="/notifications" className="text-white block px-3 py-2 rounded-md" onClick={() => setIsMenuOpen(false)}>
                  Notifications
                </Link>
                <button onClick={handleLogout} className="text-white block w-full text-left px-3 py-2 rounded-md">
                  Sign out
                </button>
              </>
            ) : (
              <Link to="/login" className="text-white block px-3 py-2 rounded-md" onClick={() => setIsMenuOpen(false)}>
                Sign in
              </Link>
            )}
          </div>
        </div>
      </div>
      
      {/* Admin link in footer */}
      <div className="absolute right-1 bottom-0 text-xs opacity-50">
        <Link to="/admin/login" className="text-white/50 hover:text-white/80">Admin</Link>
      </div>
    </nav>
  );
}

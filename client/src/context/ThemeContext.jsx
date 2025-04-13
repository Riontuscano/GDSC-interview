import { createContext, useState, useContext, useEffect } from 'react';

// Create theme context
const ThemeContext = createContext();

// Theme provider component
export const ThemeProvider = ({ children }) => {
  // Check for system preference or saved preference
  const getInitialMode = () => {
    const savedMode = localStorage.getItem('theme');
    
    if (savedMode) {
      return savedMode === 'dark';
    }
    
    // Check for system preference
    return window.matchMedia && 
           window.matchMedia('(prefers-color-scheme: dark)').matches;
  };

  const [darkMode, setDarkMode] = useState(false);
  
  // Initialize theme on mount
  useEffect(() => {
    setDarkMode(getInitialMode());
  }, []);

  // Apply dark mode class to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
    
    // Smoothly transition the body background color
    document.body.style.transition = 'background-color 0.3s ease';
  }, [darkMode]);

  // Toggle theme function
  const toggleDarkMode = () => {
    setDarkMode(prevMode => !prevMode);
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeContext; 
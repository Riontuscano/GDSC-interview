import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Apply dark mode on initial load to prevent flash of incorrect theme
const applyInitialTheme = () => {
  const isDarkMode = 
    localStorage.getItem('darkMode') === 'true' ||
    (!localStorage.getItem('darkMode') && window.matchMedia('(prefers-color-scheme: dark)').matches);
  
  if (isDarkMode) {
    document.documentElement.classList.add('dark');
  }
};

// Run before any rendering happens
applyInitialTheme();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

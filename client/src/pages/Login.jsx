import { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { darkMode } = useTheme();
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
    
    // Clear error when typing
    if (error) {
      setError('');
    }
  }, [error]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      setError('Please enter both email and password');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await login(formData.email, formData.password);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Invalid credentials. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className={`min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 ${darkMode ? 'bg-slate-900 text-white' : 'bg-sky-50 text-gray-900'}`}>
      <div className="max-w-md w-full space-y-8 p-8 rounded-xl shadow-lg backdrop-blur-sm bg-opacity-80 bg-white dark:bg-slate-800 dark:bg-opacity-50">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold">
            Welcome Back
          </h2>
          <p className={`mt-2 ${darkMode ? 'text-teal-300' : 'text-blue-600'}`}>
            Sign in to your account
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none sm:text-sm ${
                  darkMode 
                    ? 'bg-slate-700 border-slate-600 placeholder-slate-400 text-white focus:border-teal-500 focus:ring-teal-500' 
                    : 'bg-white border-gray-300 placeholder-gray-400 text-gray-900 focus:border-blue-500 focus:ring-blue-500'
                }`}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={handleInputChange}
                className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none sm:text-sm ${
                  darkMode 
                    ? 'bg-slate-700 border-slate-600 placeholder-slate-400 text-white focus:border-teal-500 focus:ring-teal-500' 
                    : 'bg-white border-gray-300 placeholder-gray-400 text-gray-900 focus:border-blue-500 focus:ring-blue-500'
                }`}
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-100 dark:bg-red-900/30 border-l-4 border-red-500 p-4 rounded">
              <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className={`h-4 w-4 rounded ${
                  darkMode ? 'text-teal-500 bg-slate-700 border-slate-500' : 'text-blue-600 bg-gray-100 border-gray-300'
                } focus:ring-0`}
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className={`${darkMode ? 'text-teal-300 hover:text-teal-200' : 'text-blue-600 hover:text-blue-500'}`}>
                Forgot your password?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                darkMode
                  ? 'bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500'
                  : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
              } ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </div>
              ) : 'Sign in'}
            </button>
          </div>
        </form>

        <div className="text-center mt-6">
          <p className="text-sm">
            Don't have an account?{' '}
            <Link to="/signup" className={darkMode ? 'text-teal-300 hover:text-teal-200' : 'text-blue-600 hover:text-blue-500'}>
              Sign up
            </Link>
          </p>
          <p className="text-sm mt-2">
            <Link to="/admin/login" className={`${darkMode ? 'text-teal-300/70 hover:text-teal-200' : 'text-blue-600/70 hover:text-blue-500'}`}>
              Admin Login
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

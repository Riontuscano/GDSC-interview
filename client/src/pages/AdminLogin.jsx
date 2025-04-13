import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

export default function AdminLogin() {
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    securityCode: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing again
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Define admin credentials
    const ADMIN_EMAIL = 'admin@gmail.com';
    const ADMIN_PASSWORD = 'Admin_1317';
    const SECURITY_CODE = '123456';
    
    // Simple validation
    if (!formData.email || !formData.password || !formData.securityCode) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }
    
    try {
      // Check against hardcoded admin credentials
      if (formData.email === ADMIN_EMAIL && 
          formData.password === ADMIN_PASSWORD && 
          formData.securityCode === SECURITY_CODE) {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Store admin session in localStorage
        localStorage.setItem('adminAuthenticated', 'true');
        
        // Redirect to dashboard
        navigate('/admin/events');
      } else if (formData.securityCode !== SECURITY_CODE) {
        setError('Invalid security code');
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('Admin login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 ${darkMode ? 'bg-slate-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className={`max-w-md w-full space-y-8 p-8 rounded-lg shadow-lg ${darkMode ? 'bg-slate-800' : 'bg-white'}`}>
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold">
            Admin Login
          </h2>
          <p className={`mt-2 text-center text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Enter your credentials to access the admin dashboard
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${darkMode ? 'bg-slate-700 border-slate-600 placeholder-gray-400 text-white' : 'bg-white border-gray-300 placeholder-gray-500 text-gray-900'} rounded-t-md focus:outline-none focus:ring-ocean-500 focus:border-ocean-500 focus:z-10 sm:text-sm`}
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={handleChange}
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${darkMode ? 'bg-slate-700 border-slate-600 placeholder-gray-400 text-white' : 'bg-white border-gray-300 placeholder-gray-500 text-gray-900'} focus:outline-none focus:ring-ocean-500 focus:border-ocean-500 focus:z-10 sm:text-sm`}
                placeholder="Password"
              />
            </div>
            <div>
              <label htmlFor="securityCode" className="sr-only">Security Code</label>
              <input
                id="securityCode"
                name="securityCode"
                type="password"
                required
                value={formData.securityCode}
                onChange={handleChange}
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${darkMode ? 'bg-slate-700 border-slate-600 placeholder-gray-400 text-white' : 'bg-white border-gray-300 placeholder-gray-500 text-gray-900'} rounded-b-md focus:outline-none focus:ring-ocean-500 focus:border-ocean-500 focus:z-10 sm:text-sm`}
                placeholder="Security Code"
              />
            </div>
          </div>

          {error && (
            <div className={`p-3 rounded-md ${darkMode ? 'bg-red-900/30 text-red-300' : 'bg-red-50 text-red-700'}`}>
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                darkMode 
                  ? 'bg-teal-600 hover:bg-teal-700'
                  : 'bg-ocean-600 hover:bg-ocean-700'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ocean-500 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </button>
          </div>
          
          <div className="flex items-center justify-center mt-4">
            <Link
              to="/login"
              className={`text-sm ${darkMode ? 'text-teal-400 hover:text-teal-300' : 'text-ocean-600 hover:text-ocean-500'}`}
            >
              Return to regular login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
} 
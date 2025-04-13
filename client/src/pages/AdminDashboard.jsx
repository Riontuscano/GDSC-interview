import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

export default function AdminDashboard() {
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    users: 124,
    events: 8,
    registrations: 352,
    revenue: 15800
  });

  // Check if admin is authenticated
  useEffect(() => {
    const checkAuth = () => {
      const isAdmin = localStorage.getItem('adminAuthenticated') === 'true';
      if (!isAdmin) {
        navigate('/admin/login');
      } else {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminAuthenticated');
    navigate('/admin/login');
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-slate-900' : 'bg-gray-50'}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-ocean-500"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-slate-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Admin Header */}
      <header className={`py-4 px-6 shadow ${darkMode ? 'bg-slate-800' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <button 
            onClick={handleLogout}
            className={`px-4 py-2 rounded-md font-medium text-white ${
              darkMode ? 'bg-red-600 hover:bg-red-700' : 'bg-red-500 hover:bg-red-600'
            } transition-colors`}
          >
            Logout
          </button>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className={`p-6 rounded-lg shadow ${darkMode ? 'bg-slate-800' : 'bg-white'}`}>
            <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400">Total Users</h3>
            <p className="mt-2 text-3xl font-bold">{stats.users}</p>
          </div>
          <div className={`p-6 rounded-lg shadow ${darkMode ? 'bg-slate-800' : 'bg-white'}`}>
            <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400">Total Events</h3>
            <p className="mt-2 text-3xl font-bold">{stats.events}</p>
          </div>
          <div className={`p-6 rounded-lg shadow ${darkMode ? 'bg-slate-800' : 'bg-white'}`}>
            <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400">Registrations</h3>
            <p className="mt-2 text-3xl font-bold">{stats.registrations}</p>
          </div>
          <div className={`p-6 rounded-lg shadow ${darkMode ? 'bg-slate-800' : 'bg-white'}`}>
            <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400">Revenue ($)</h3>
            <p className="mt-2 text-3xl font-bold">${stats.revenue.toLocaleString()}</p>
          </div>
        </div>
        
        {/* Quick Actions */}
        <div className={`p-6 mb-8 rounded-lg shadow ${darkMode ? 'bg-slate-800' : 'bg-white'}`}>
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className={`p-4 rounded-md text-white ${darkMode ? 'bg-teal-600 hover:bg-teal-700' : 'bg-ocean-600 hover:bg-ocean-700'} transition-colors text-left`}>
              <svg className="h-6 w-6 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Create New Event
            </button>
            <button className={`p-4 rounded-md text-white ${darkMode ? 'bg-teal-600 hover:bg-teal-700' : 'bg-ocean-600 hover:bg-ocean-700'} transition-colors text-left`}>
              <svg className="h-6 w-6 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              Manage Users
            </button>
            <button className={`p-4 rounded-md text-white ${darkMode ? 'bg-teal-600 hover:bg-teal-700' : 'bg-ocean-600 hover:bg-ocean-700'} transition-colors text-left`}>
              <svg className="h-6 w-6 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              View Reports
            </button>
          </div>
        </div>
        
        {/* Recent Users */}
        <div className={`p-6 rounded-lg shadow ${darkMode ? 'bg-slate-800' : 'bg-white'}`}>
          <h2 className="text-xl font-bold mb-4">Recent Users</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
                <tr>
                  <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300 uppercase tracking-wider' : 'text-gray-500 uppercase tracking-wider'}`}>
                    Name
                  </th>
                  <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300 uppercase tracking-wider' : 'text-gray-500 uppercase tracking-wider'}`}>
                    Email
                  </th>
                  <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300 uppercase tracking-wider' : 'text-gray-500 uppercase tracking-wider'}`}>
                    Status
                  </th>
                  <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300 uppercase tracking-wider' : 'text-gray-500 uppercase tracking-wider'}`}>
                    Registered
                  </th>
                </tr>
              </thead>
              <tbody className={`${darkMode ? 'divide-y divide-gray-700' : 'divide-y divide-gray-200'}`}>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">John Doe</td>
                  <td className="px-6 py-4 whitespace-nowrap">john@example.com</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Active
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">2023-04-15</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">Jane Smith</td>
                  <td className="px-6 py-4 whitespace-nowrap">jane@example.com</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Active
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">2023-04-12</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">Bob Johnson</td>
                  <td className="px-6 py-4 whitespace-nowrap">bob@example.com</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      Pending
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">2023-04-10</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">Alice Brown</td>
                  <td className="px-6 py-4 whitespace-nowrap">alice@example.com</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Active
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">2023-04-08</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
} 
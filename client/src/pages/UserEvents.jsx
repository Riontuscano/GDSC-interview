import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import EventCard from '../components/EventCard';

const UserEvents = () => {
  const { darkMode } = useTheme();
  const { currentUser } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    if (currentUser) {
      fetchUserEvents();
    } else {
      setEvents([]);
      setLoading(false);
    }
  }, [currentUser]);

  const fetchUserEvents = async () => {
    try {
      setLoading(true);
      const userId = currentUser?.id || '';
      
      // Add timestamp for cache busting
      const timestamp = new Date().getTime();
      const response = await axios.get(`http://localhost:5500/api/events/my-events?userId=${userId}&_=${timestamp}`);
      
      setEvents(response.data.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching user events:', err);
      setError('Failed to load your events. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Filter events based on the selected tab
  const filteredEvents = events.filter(event => {
    if (activeTab === 'all') return true;
    
    // Find user's application for this event
    const application = event.applicants.find(app => 
      app.user === currentUser?.id || (app.user?._id && app.user._id === currentUser?.id)
    );
    
    return application?.status === activeTab;
  });

  if (!currentUser) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-slate-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto text-center">
            <h1 className="text-3xl font-bold mb-4">My Events</h1>
            <p className="mb-6">Please log in to view your events.</p>
            <Link 
              to="/login" 
              className={`inline-block px-6 py-2 rounded ${
                darkMode ? 'bg-teal-600 hover:bg-teal-700' : 'bg-ocean-600 hover:bg-ocean-700'
              } text-white`}
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-slate-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Events</h1>
          <button
            onClick={fetchUserEvents}
            className={`px-3 py-2 rounded ${
              darkMode ? 'bg-slate-700 hover:bg-slate-600' : 'bg-gray-200 hover:bg-gray-300'
            } flex items-center space-x-1`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Refresh</span>
          </button>
        </div>
        
        {/* Status filter tabs */}
        <div className="mb-6">
          <div className={`flex border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <button
              className={`py-2 px-4 font-medium ${
                activeTab === 'all'
                  ? darkMode
                    ? 'border-b-2 border-teal-500 text-teal-500'
                    : 'border-b-2 border-ocean-500 text-ocean-600'
                  : darkMode
                  ? 'text-gray-400 hover:text-teal-300'
                  : 'text-gray-600 hover:text-ocean-500'
              }`}
              onClick={() => setActiveTab('all')}
            >
              All Events
            </button>
            <button
              className={`py-2 px-4 font-medium ${
                activeTab === 'pending'
                  ? darkMode
                    ? 'border-b-2 border-teal-500 text-teal-500'
                    : 'border-b-2 border-ocean-500 text-ocean-600'
                  : darkMode
                  ? 'text-gray-400 hover:text-teal-300'
                  : 'text-gray-600 hover:text-ocean-500'
              }`}
              onClick={() => setActiveTab('pending')}
            >
              Pending
            </button>
            <button
              className={`py-2 px-4 font-medium ${
                activeTab === 'approved'
                  ? darkMode
                    ? 'border-b-2 border-teal-500 text-teal-500'
                    : 'border-b-2 border-ocean-500 text-ocean-600'
                  : darkMode
                  ? 'text-gray-400 hover:text-teal-300'
                  : 'text-gray-600 hover:text-ocean-500'
              }`}
              onClick={() => setActiveTab('approved')}
            >
              Approved
            </button>
            <button
              className={`py-2 px-4 font-medium ${
                activeTab === 'rejected'
                  ? darkMode
                    ? 'border-b-2 border-teal-500 text-teal-500'
                    : 'border-b-2 border-ocean-500 text-ocean-600'
                  : darkMode
                  ? 'text-gray-400 hover:text-teal-300'
                  : 'text-gray-600 hover:text-ocean-500'
              }`}
              onClick={() => setActiveTab('rejected')}
            >
              Rejected
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className={`p-4 rounded-md ${darkMode ? 'bg-red-900/30 text-red-300' : 'bg-red-50 text-red-700'}`}>
            {error}
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-xl mb-4">No events found</p>
            <Link 
              to="/events" 
              className={`inline-block px-6 py-2 rounded ${
                darkMode ? 'bg-teal-600 hover:bg-teal-700' : 'bg-ocean-600 hover:bg-ocean-700'
              } text-white`}
            >
              Browse Events
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => {
              // Find user's application status for this event
              const application = event.applicants.find(app => 
                app.user === currentUser?.id || (app.user?._id && app.user._id === currentUser?.id)
              );
              const status = application?.status || 'pending';
              
              return (
                <div key={event._id} className="relative">
                  {/* Status badge */}
                  <div className={`absolute top-4 right-4 z-10 px-2 py-1 rounded-full text-xs font-semibold
                    ${status === 'approved' 
                      ? darkMode ? 'bg-green-800 text-green-200' : 'bg-green-500 text-white'
                      : status === 'rejected'
                      ? darkMode ? 'bg-red-800 text-red-200' : 'bg-red-500 text-white'
                      : darkMode ? 'bg-yellow-800 text-yellow-200' : 'bg-yellow-500 text-white'
                    }
                  `}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </div>
                  
                  <Link to={`/events/${event._id}`} className="block">
                    <EventCard 
                      event={event} 
                      isPast={event.isPast}
                      showApplyButton={false}
                    />
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserEvents; 
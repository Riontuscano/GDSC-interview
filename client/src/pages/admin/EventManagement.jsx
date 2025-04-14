import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

const EventManagement = () => {
  const { darkMode } = useTheme();
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  
  useEffect(() => {
    console.log('Active tab changed to:', activeTab);
    fetchEvents();
  }, [activeTab]);
  
  // Force fetch events on component mount only, without depending on activeTab changes
  useEffect(() => {
    console.log('EventManagement component mounted - fetching all events');
    const fetchAllEvents = async () => {
      try {
        const response = await axios.get('http://localhost:5500/api/events?showAll=true');
      
        setEvents(response.data.data);
      } catch (err) {
        console.error('Error fetching all events:', err);
      }
    };
    
    fetchAllEvents();
  }, []);
  
  const completeRefresh = async () => {
    console.log('Performing complete refresh of all events');
    try {
      setLoading(true);
      
      // Make a direct API call with a cache-busting parameter
      const timestamp = new Date().getTime();
      const response = await axios.get(`http://localhost:5500/api/events?showAll=true&_=${timestamp}`);
      
      console.log('Refresh complete. Received', response.data.count, 'events');
      setEvents(response.data.data);
      setError(null);
    } catch (err) {
      console.error('Error during complete refresh:', err);
      setError('Failed to refresh events. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const fetchEvents = async () => {
    try {
      setLoading(true);
      
      // Determine query parameters based on active tab
      let queryParams = '?showAll=true';
      if (activeTab === 'upcoming') {
        queryParams = '?past=false';
      } else if (activeTab === 'past') {
        queryParams = '?past=true';
      }
      
      // Add cache-busting parameter
      const timestamp = new Date().getTime();
      queryParams += `&_=${timestamp}`;
      
      console.log('Fetching events with query:', queryParams);
      const response = await axios.get(`http://localhost:5500/api/events${queryParams}`);
      
      console.log('Events received (count):', response.data.count);
      console.log('Events data:', response.data.data.map(event => ({
        id: event._id,
        title: event.title,
        date: new Date(event.date).toLocaleDateString(),
        isPast: event.isPast,
        isActive: event.isActive,
        applicants: event.applicants?.length || 0
      })));
      
      setEvents(response.data.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Failed to load events. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const deleteEvent = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event?')) {
      return;
    }
    
    try {
      console.log('Deleting event with ID:', eventId);
      
      // Call the backend to delete the event
      const response = await axios.delete(`http://localhost:5500/api/events/${eventId}`);
      
      console.log('Delete response:', response.data);
      
      // Optimistically update the UI
      setEvents(prevEvents => prevEvents.filter(event => event._id !== eventId));
      
      // Force a complete refresh to ensure state is in sync with the server
      console.log('Performing complete refresh after deletion');
      setTimeout(() => completeRefresh(), 500); // Small delay to ensure deletion completes
      
    } catch (err) {
      console.error('Error deleting event:', err);
      alert('Failed to delete event: ' + (err.response?.data?.message || err.message));
      
      // Refresh events list to ensure consistent state
      completeRefresh();
    }
  };
  
  return (
    <div className={`min-h-screen ${darkMode ? 'bg-slate-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="container mx-auto px-4 py-8">
        {/* Debug Information */}
        
        
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Event Management</h1>
          <div className="flex space-x-2">
            <button
              onClick={fetchEvents}
              className={`px-2 py-2 rounded ${
                darkMode ? 'bg-slate-700 hover:bg-slate-600' : 'bg-gray-200 hover:bg-gray-300'
              } text-center`}
              title="Refresh events"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
            
            <Link
              to="/admin/events/new"
              className={`px-4 py-2 rounded ${
                darkMode ? 'bg-teal-600 hover:bg-teal-700' : 'bg-ocean-600 hover:bg-ocean-700'
              } text-white`}
            >
              Create New Event
            </Link>
          </div>
        </div>
        
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
                activeTab === 'upcoming'
                  ? darkMode
                    ? 'border-b-2 border-teal-500 text-teal-500'
                    : 'border-b-2 border-ocean-500 text-ocean-600'
                  : darkMode
                  ? 'text-gray-400 hover:text-teal-300'
                  : 'text-gray-600 hover:text-ocean-500'
              }`}
              onClick={() => setActiveTab('upcoming')}
            >
              Upcoming Events
            </button>
            <button
              className={`py-2 px-4 font-medium ${
                activeTab === 'past'
                  ? darkMode
                    ? 'border-b-2 border-teal-500 text-teal-500'
                    : 'border-b-2 border-ocean-500 text-ocean-600'
                  : darkMode
                  ? 'text-gray-400 hover:text-teal-300'
                  : 'text-gray-600 hover:text-ocean-500'
              }`}
              onClick={() => setActiveTab('past')}
            >
              Past Events
            </button>
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className={`p-4 rounded-md mb-6 ${darkMode ? 'bg-red-900/30 text-red-300' : 'bg-red-50 text-red-700'}`}>
            {error}
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-xl mb-4">No events found</p>
            <Link
              to="/admin/events/new"
              className={`px-4 py-2 rounded ${
                darkMode ? 'bg-teal-600 hover:bg-teal-700' : 'bg-ocean-600 hover:bg-ocean-700'
              } text-white`}
            >
              Create Your First Event
            </Link>
          </div>
        ) : (
          <div className={`overflow-hidden rounded-lg border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className={darkMode ? 'bg-slate-800' : 'bg-gray-50'}>
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Event
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Location
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Applications
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className={`divide-y ${darkMode ? 'divide-gray-700 bg-slate-800' : 'divide-gray-200 bg-white'}`}>
                {/* Force display ALL events regardless of filters */}
                {console.log('Rendering events table with', events.length, 'events')}
                {events.map((event, index) => {
                  console.log(`Rendering event ${index}:`, event.title, event._id);
                  return (
                    <tr key={event._id || `event-${index}`}>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0 rounded-full overflow-hidden">
                            <img
                              className="h-10 w-10 object-cover"
                              src={event.image || "https://source.unsplash.com/random/40x40/?event"}
                              alt=""
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium">{event.title}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm">
                          {new Date(event.date).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm">{event.location}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${event.isPast 
                            ? darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800'
                            : event.isActive
                              ? darkMode ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-800'
                              : darkMode ? 'bg-red-900 text-red-300' : 'bg-red-100 text-red-800'
                          }`}>
                          {event.isPast ? 'Past' : (event.isActive ? 'Active' : 'Inactive')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${darkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-800'}`}>
                            {event.applicants?.length || 0}
                          </span>
                          <span className="ml-1">
                            {event.applicants?.length === 1 ? 'applicant' : 'applicants'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link
                          to={`/admin/events/${event._id}/applications`}
                          className={`mr-3 ${
                            darkMode ? 'text-teal-400 hover:text-teal-300' : 'text-ocean-600 hover:text-ocean-500'
                          }`}
                        >
                          Manage Applications
                        </Link>
                        <Link
                          to={`/admin/events/${event._id}/edit`}
                          className={`mr-3 ${
                            darkMode ? 'text-teal-400 hover:text-teal-300' : 'text-ocean-600 hover:text-ocean-500'
                          }`}
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => deleteEvent(event._id)}
                          className={`${
                            darkMode ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-500'
                          }`}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventManagement; 
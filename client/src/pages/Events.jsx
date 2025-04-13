import { useState, useEffect } from 'react';
import axios from 'axios';
import { useTheme } from '../context/ThemeContext';
import EventCard from '../components/EventCard';
import EventDetailModal from '../components/EventDetailModal';

const Events = () => {
  const { darkMode } = useTheme();
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    console.log('Events page mounted - fetching events');
    fetchEvents();
  }, []);

  // Listen for tab changes
  useEffect(() => {
    console.log('Active tab changed to:', activeTab);
  }, [activeTab]);

  const completeRefresh = async () => {
    console.log('Performing complete refresh of all events');
    try {
      setRefreshing(true);
      
      // Add cache-busting parameter
      const timestamp = new Date().getTime();
      
      // Fetch upcoming events with cache busting
      const upcomingResponse = await axios.get(`http://localhost:5500/api/events?past=false&_=${timestamp}`);
      console.log('Upcoming events received:', upcomingResponse.data.count);
      setUpcomingEvents(upcomingResponse.data.data);
      
      // Fetch past events with cache busting
      const pastResponse = await axios.get(`http://localhost:5500/api/events?past=true&_=${timestamp}`);
      console.log('Past events received:', pastResponse.data.count);
      setPastEvents(pastResponse.data.data);
      
      setError(null);
      console.log('Complete refresh finished');
    } catch (err) {
      console.error('Error during complete refresh:', err);
      setError('Failed to refresh events. Please try again.');
    } finally {
      setRefreshing(false);
    }
  };

  const fetchEvents = async () => {
    try {
      setLoading(true);
      
      // Add cache-busting parameter
      const timestamp = new Date().getTime();
      
      // Fetch upcoming events with cache busting
      console.log('Fetching upcoming events');
      const upcomingResponse = await axios.get(`http://localhost:5500/api/events?past=false&_=${timestamp}`);
      console.log('Upcoming events received:', upcomingResponse.data.data.length);
      setUpcomingEvents(upcomingResponse.data.data);
      
      // Fetch past events with cache busting
      console.log('Fetching past events');
      const pastResponse = await axios.get(`http://localhost:5500/api/events?past=true&_=${timestamp}`);
      console.log('Past events received:', pastResponse.data.data.length);
      setPastEvents(pastResponse.data.data);
      
      setError(null);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Failed to load events. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const openEventDetail = (event) => {
    console.log('Opening event detail modal for:', event.title);
    setSelectedEvent(event);
    setShowModal(true);
  };

  const closeEventDetail = () => {
    console.log('Closing event detail modal');
    setShowModal(false);
    // Refresh events when modal closes in case user applied for the event
    setTimeout(() => completeRefresh(), 500);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-slate-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-center">Events</h1>
          <button
            onClick={completeRefresh}
            className={`px-2 py-2 rounded flex items-center ${
              darkMode ? 'bg-slate-700 hover:bg-slate-600' : 'bg-gray-200 hover:bg-gray-300'
            } ${refreshing ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={refreshing}
            title="Refresh events"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${refreshing ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
        
        {/* Debug Information (collapsible) */}
        <div className="mb-4">
          <details className={`rounded-lg p-2 ${darkMode ? 'bg-slate-800' : 'bg-gray-100'}`}>
            <summary className="cursor-pointer font-semibold">Debug Info</summary>
            <div className="mt-2 p-2 text-xs">
              <p>Active Tab: {activeTab}</p>
              <p>Upcoming Events: {upcomingEvents.length}</p>
              <p>Past Events: {pastEvents.length}</p>
              <p>Loading: {loading ? 'Yes' : 'No'}</p>
              <p>Refreshing: {refreshing ? 'Yes' : 'No'}</p>
            </div>
          </details>
        </div>
        
        <div className="mb-6">
          <div className={`flex justify-center border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
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
          <div className={`p-4 rounded-md ${darkMode ? 'bg-red-900/30 text-red-300' : 'bg-red-50 text-red-700'}`}>
            {error}
          </div>
        ) : activeTab === 'upcoming' && upcomingEvents.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-xl mb-4">No upcoming events found</p>
          </div>
        ) : activeTab === 'past' && pastEvents.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-xl mb-4">No past events found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {console.log(`Rendering ${activeTab} events, count:`, activeTab === 'upcoming' ? upcomingEvents.length : pastEvents.length)}
            {activeTab === 'upcoming' 
              ? upcomingEvents.map((event, index) => {
                  console.log(`Rendering upcoming event ${index}:`, event.title);
                  return (
                    <div key={event._id || `event-${index}`} onClick={() => openEventDetail(event)} className="cursor-pointer">
                      <EventCard 
                        event={event} 
                        isPast={false}
                        showApplyButton={false}
                      />
                    </div>
                  );
                })
              : pastEvents.map((event, index) => {
                  console.log(`Rendering past event ${index}:`, event.title);
                  return (
                    <div key={event._id || `event-${index}`} onClick={() => openEventDetail(event)} className="cursor-pointer">
                      <EventCard 
                        event={event} 
                        isPast={true}
                        showApplyButton={false}
                      />
                    </div>
                  );
                })
            }
          </div>
        )}
      </div>
      
      {showModal && selectedEvent && (
        <EventDetailModal 
          event={selectedEvent}
          onClose={closeEventDetail}
          darkMode={darkMode}
          onEventUpdate={completeRefresh}
        />
      )}
    </div>
  );
};

export default Events; 
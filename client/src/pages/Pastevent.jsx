import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import EventCard from '../components/EventCard';

const Pastevent = () => {
  const { darkMode } = useTheme();
  const { user } = useAuth();
  const [pastEvents, setPastEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPastEvents = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5500/api/events?past=true');
        setPastEvents(response.data.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching past events:', err);
        setError('Failed to load past events. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPastEvents();
  }, []);

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-slate-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Past Events</h1>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className={`p-4 rounded-md ${darkMode ? 'bg-red-900/30 text-red-300' : 'bg-red-50 text-red-700'}`}>
            {error}
          </div>
        ) : pastEvents.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-xl mb-4">No past events found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pastEvents.map((event) => (
              <EventCard 
                key={event._id} 
                event={event} 
                isPast={true}
                showApplyButton={false}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Pastevent;

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const EventCard = ({ event, isPast = false, showApplyButton = true }) => {
  const { user, isAuthenticated } = useAuth();
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  
  const [applying, setApplying] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // Check if user has already applied
  const hasApplied = event.applicants?.some(
    applicant => applicant.user === user?._id
  );
  
  // Format date
  const eventDate = new Date(event.date);
  const formattedDate = format(eventDate, 'MMM dd, yyyy');
  
  const handleApply = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/events/${event._id}` } });
      return;
    }
    
    try {
      setApplying(true);
      setError(null);
      
      const response = await axios.post(
        `http://localhost:5500/api/events/${event._id}/apply`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      
      setSuccess('Application submitted successfully!');
      
      // Update the event with the new applicant
      event.applicants = response.data.data.applicants;
      
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err) {
      setError(
        err.response?.data?.message || 
        'Failed to apply for this event. Please try again.'
      );
      
      setTimeout(() => {
        setError(null);
      }, 3000);
    } finally {
      setApplying(false);
    }
  };
  
  return (
    <div 
      className={`rounded-lg shadow-md overflow-hidden ${
        darkMode ? 'bg-slate-800' : 'bg-white'
      } hover:shadow-lg transition-shadow duration-200`}
    >
      <div className="h-48 overflow-hidden">
        <img 
          src={event.image || "https://source.unsplash.com/random/400x200/?technology"} 
          alt={event.title} 
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold">{event.title}</h3>
          {isPast && (
            <span className={`px-2 py-1 text-xs rounded-full ${
              darkMode ? 'bg-slate-700 text-slate-300' : 'bg-gray-200 text-gray-700'
            }`}>
              Past Event
            </span>
          )}
        </div>
        
        <p className={`text-sm mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          <span className="inline-block mr-4">
            <i className="far fa-calendar-alt mr-1"></i> {formattedDate}
          </span>
          <span>
            <i className="fas fa-map-marker-alt mr-1"></i> {event.location}
          </span>
        </p>
        
        <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          {event.description?.length > 100 
            ? `${event.description.substring(0, 100)}...` 
            : event.description}
        </p>
        
        {error && (
          <div className={`p-2 mb-4 text-sm rounded ${
            darkMode ? 'bg-red-900/30 text-red-300' : 'bg-red-50 text-red-700'
          }`}>
            {error}
          </div>
        )}
        
        {success && (
          <div className={`p-2 mb-4 text-sm rounded ${
            darkMode ? 'bg-green-900/30 text-green-300' : 'bg-green-50 text-green-700'
          }`}>
            {success}
          </div>
        )}
        
        <div className="flex justify-between items-center">
          <Link 
            to={`/events/${event._id}`}
            className={`text-sm font-medium ${
              darkMode ? 'text-teal-400 hover:text-teal-300' : 'text-ocean-600 hover:text-ocean-500'
            }`}
          >
            View Details
          </Link>
          
          {showApplyButton && !isPast && (
            <button
              onClick={handleApply}
              disabled={applying || hasApplied}
              className={`px-4 py-2 rounded text-sm font-medium ${
                applying
                  ? 'opacity-70 cursor-not-allowed'
                  : hasApplied
                  ? darkMode 
                    ? 'bg-slate-600 text-slate-300 cursor-not-allowed' 
                    : 'bg-gray-300 text-gray-700 cursor-not-allowed'
                  : darkMode
                  ? 'bg-teal-600 hover:bg-teal-700 text-white'
                  : 'bg-ocean-600 hover:bg-ocean-700 text-white'
              }`}
            >
              {applying 
                ? 'Applying...' 
                : hasApplied 
                ? 'Applied' 
                : 'Apply Now'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventCard; 
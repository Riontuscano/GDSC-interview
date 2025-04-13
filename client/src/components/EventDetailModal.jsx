import { useState } from 'react';
import { format } from 'date-fns';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const EventDetailModal = ({ event, onClose, darkMode, onEventUpdate }) => {
  const { user } = useAuth();
  const [applying, setApplying] = useState(false);
  const [error, setError] = useState(null);
  const [applicationSuccess, setApplicationSuccess] = useState(false);
  
  // Format dates
  const eventDate = new Date(event.date);
  const formattedDate = format(eventDate, 'MMMM dd, yyyy');
  const formattedTime = format(eventDate, 'h:mm a');
  const deadlineDate = new Date(event.registrationDeadline);
  const formattedDeadline = format(deadlineDate, 'MMMM dd, yyyy');
  
  // Check if deadline has passed or event is past
  const isDeadlinePassed = new Date() > deadlineDate;
  const isPastEvent = event.isPast;
  const isEventFull = event.capacity && event.applicants && event.applicants.filter(app => app.status === 'approved').length >= event.capacity;
  
  // Check if user has already applied
  const hasApplied = event.applicants?.some(
    applicant => applicant.user === user?._id || (applicant.user?._id && applicant.user._id === user?._id)
  );
  
  // Status of application if user has applied
  const userApplication = event.applicants?.find(
    applicant => applicant.user === user?._id || (applicant.user?._id && applicant.user._id === user?._id)
  );
  const applicationStatus = userApplication?.status;
  
  const handleApply = async () => {
    try {
      setApplying(true);
      setError(null);
      
      // Use a fixed user ID if not authenticated
      const userId = user?._id || '661037f9f5aee68b6cb9ed9f';
      
      // Include sample user data if real user data is not available
      const userData = user || {
        firstName: 'Guest',
        lastName: 'User',
        email: 'guest@example.com'
      };
      
      console.log('Submitting application for event:', event.title);
      console.log('Using user ID:', userId);
      console.log('Including user data:', userData);
      
      const response = await axios.post(
        `http://localhost:5500/api/events/${event._id}/apply`,
        { 
          userId,
          userData // Send user data along with the request
        }
      );
      
      console.log('Application response:', response.data);
      setApplicationSuccess(true);
      
      // Get the updated event with the new application
      const updatedEventResponse = await axios.get(`http://localhost:5500/api/events/${event._id}`);
      
      // Update the event with the fresh data including the populated applicants
      Object.assign(event, updatedEventResponse.data.data);
      
      console.log('Application submitted successfully');
      
      // Call the onEventUpdate prop if it exists to refresh the parent component
      if (typeof onEventUpdate === 'function') {
        console.log('Triggering event update in parent component');
        setTimeout(() => onEventUpdate(), 500);
      }
      
    } catch (err) {
      console.error('Error applying for event:', err);
      setError(
        err.response?.data?.message || 
        'Failed to apply for this event. Please try again.'
      );
    } finally {
      setApplying(false);
    }
  };
  
  // Handle modal close
  const handleClose = () => {
    // If application was successful, trigger an update before closing
    if (applicationSuccess && typeof onEventUpdate === 'function') {
      onEventUpdate();
    }
    onClose();
  };
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" onClick={handleClose}>
          <div className={`absolute inset-0 ${darkMode ? 'bg-black' : 'bg-gray-500'} opacity-75`}></div>
        </div>
        
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
        
        <div 
          className={`inline-block align-bottom rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full ${
            darkMode ? 'bg-slate-800 text-white' : 'bg-white text-gray-900'
          }`}
        >
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button
              type="button"
              className={`text-2xl font-semibold ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-400 hover:text-gray-500'}`}
              onClick={handleClose}
            >
              ×
            </button>
          </div>
          
          <div className="h-64 overflow-hidden">
            <img 
              src={event.image || "https://source.unsplash.com/random/1200x400/?technology"} 
              alt={event.title} 
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-3xl font-bold">{event.title}</h1>
              {isPastEvent && (
                <span className={`px-3 py-1 text-sm rounded-full ${
                  darkMode ? 'bg-slate-700 text-slate-300' : 'bg-gray-200 text-gray-700'
                }`}>
                  Past Event
                </span>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <h3 className={`text-sm font-medium mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Date & Time
                </h3>
                <p className="text-lg">
                  {formattedDate}<br />
                  {formattedTime}
                </p>
              </div>
              <div>
                <h3 className={`text-sm font-medium mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Location
                </h3>
                <p className="text-lg">{event.location}</p>
              </div>
              <div>
                <h3 className={`text-sm font-medium mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Registration Deadline
                </h3>
                <p className="text-lg">{formattedDeadline}</p>
              </div>
            </div>
            
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-3">About this Event</h2>
              <p className={`whitespace-pre-line ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {event.description}
              </p>
            </div>
            
            {error && (
              <div className={`p-4 mb-6 rounded-md ${darkMode ? 'bg-red-900/30 text-red-300' : 'bg-red-50 text-red-600'}`}>
                {error}
              </div>
            )}
            
            {applicationSuccess && (
              <div className={`p-4 mb-6 rounded-md ${darkMode ? 'bg-green-900/30 text-green-300' : 'bg-green-50 text-green-600'}`}>
                Your application has been submitted successfully! We will notify you when there's an update.
              </div>
            )}
            
            <div className="flex justify-between items-center">
              <div>
                {hasApplied && (
                  <div className={`text-sm ${
                    applicationStatus === 'approved' 
                      ? darkMode ? 'text-green-400' : 'text-green-600'
                      : applicationStatus === 'rejected'
                      ? darkMode ? 'text-red-400' : 'text-red-600'
                      : darkMode ? 'text-yellow-400' : 'text-yellow-600'
                  }`}>
                    Status: <span className="font-semibold capitalize">{applicationStatus || 'Pending'}</span>
                  </div>
                )}
                
                {isEventFull && !hasApplied && (
                  <div className={`text-sm ${darkMode ? 'text-red-400' : 'text-red-600'}`}>
                    This event is fully booked.
                  </div>
                )}
                
                {isDeadlinePassed && !hasApplied && !isPastEvent && (
                  <div className={`text-sm ${darkMode ? 'text-red-400' : 'text-red-600'}`}>
                    Registration deadline has passed.
                  </div>
                )}
              </div>
              
              <button
                onClick={handleApply}
                disabled={applying || hasApplied || isPastEvent || isDeadlinePassed || isEventFull}
                className={`px-4 py-2 rounded ${
                  applying
                    ? 'opacity-70 cursor-not-allowed'
                    : hasApplied || isPastEvent || isDeadlinePassed || isEventFull
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
                  : isPastEvent 
                  ? 'Event Ended'
                  : isDeadlinePassed
                  ? 'Deadline Passed'
                  : isEventFull
                  ? 'Fully Booked'
                  : 'Apply Now'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailModal; 
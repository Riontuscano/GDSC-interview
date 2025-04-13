import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import axios from 'axios';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const EventDetail = () => {
  const { eventId } = useParams();
  const { darkMode } = useTheme();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [applying, setApplying] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState(null);
  const [applicationSuccess, setApplicationSuccess] = useState(false);
  
  useEffect(() => {
    fetchEvent();
  }, [eventId]);
  
  const fetchEvent = async () => {
    try {
      setLoading(true);
      
      const response = await axios.get(`http://localhost:5500/api/events/${eventId}`);
      setEvent(response.data.data);
      
      // Check if user has already applied
      if (isAuthenticated && user && response.data.data.applicants) {
        const userApplication = response.data.data.applicants.find(
          app => app.user._id === user._id
        );
        
        if (userApplication) {
          setApplicationStatus(userApplication.status);
        }
      }
      
      setError(null);
    } catch (err) {
      console.error('Error fetching event:', err);
      setError('Failed to load event details. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleApply = async () => {
    try {
      setApplying(true);
      setError(null);
      
      // Use a fixed user ID if not authenticated
      const userId = user?._id || '661037f9f5aee68b6cb9ed9f';
      
      await axios.post(
        `http://localhost:5500/api/events/${eventId}/apply`,
        { userId }
      );
      
      setApplicationSuccess(true);
      setApplicationStatus('pending');
      
      // Refresh event data
      fetchEvent();
    } catch (err) {
      setError(
        err.response?.data?.message || 
        'Failed to apply for this event. Please try again.'
      );
    } finally {
      setApplying(false);
    }
  };
  
  if (loading) {
    return (
      <div className={`min-h-screen flex justify-center items-center ${darkMode ? 'bg-slate-900' : 'bg-gray-50'}`}>
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (error || !event) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-slate-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
        <div className="container mx-auto px-4 py-8">
          <div className={`p-4 rounded-md ${darkMode ? 'bg-red-900/30 text-red-300' : 'bg-red-50 text-red-700'}`}>
            {error || 'Event not found'}
          </div>
          <div className="mt-4">
            <Link 
              to="/" 
              className={`${darkMode ? 'text-teal-400 hover:text-teal-300' : 'text-ocean-600 hover:text-ocean-500'}`}
            >
              &larr; Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  const eventDate = new Date(event.date);
  const formattedDate = format(eventDate, 'MMMM dd, yyyy');
  const formattedTime = format(eventDate, 'h:mm a');
  
  const isDeadlinePassed = new Date() > new Date(event.registrationDeadline);
  const isPastEvent = event.isPast;
  const isEventFull = event.isFull;
  
  // Format registration deadline
  const deadlineDate = new Date(event.registrationDeadline);
  const formattedDeadline = format(deadlineDate, 'MMMM dd, yyyy');
  
  // Determine if user can apply
  const canApply = 
    isAuthenticated && 
    !isPastEvent && 
    !isDeadlinePassed && 
    !isEventFull && 
    !applicationStatus;
  
  return (
    <div className={`min-h-screen ${darkMode ? 'bg-slate-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Link 
            to="/events" 
            className={`${darkMode ? 'text-teal-400 hover:text-teal-300' : 'text-ocean-600 hover:text-ocean-500'} mb-4 inline-block`}
          >
            &larr; Back to Events
          </Link>
          
          <div className={`rounded-lg shadow-lg overflow-hidden ${darkMode ? 'bg-slate-800' : 'bg-white'}`}>
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
              
              {applicationSuccess && (
                <div className={`p-4 mb-6 rounded-md ${
                  darkMode ? 'bg-green-900/30 text-green-300' : 'bg-green-50 text-green-800'
                }`}>
                  Your application has been submitted successfully! We will notify you when there's an update.
                </div>
              )}
              
              {error && (
                <div className={`p-4 mb-6 rounded-md ${
                  darkMode ? 'bg-red-900/30 text-red-300' : 'bg-red-50 text-red-700'
                }`}>
                  {error}
                </div>
              )}
              
              <div className={`border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} pt-6`}>
                {applicationStatus ? (
                  <div className="flex flex-col items-center">
                    <div className={`text-lg font-medium mb-2 ${
                      applicationStatus === 'approved'
                        ? darkMode ? 'text-green-400' : 'text-green-600'
                        : applicationStatus === 'rejected'
                        ? darkMode ? 'text-red-400' : 'text-red-600'
                        : darkMode ? 'text-yellow-400' : 'text-yellow-600'
                    }`}>
                      Your application status: {applicationStatus.charAt(0).toUpperCase() + applicationStatus.slice(1)}
                    </div>
                    {applicationStatus === 'pending' && (
                      <p className={`text-center ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Your application is being reviewed. We'll notify you once it's processed.
                      </p>
                    )}
                    {applicationStatus === 'approved' && (
                      <p className={`text-center ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Congratulations! Your application has been approved. We look forward to seeing you at the event.
                      </p>
                    )}
                    {applicationStatus === 'rejected' && (
                      <p className={`text-center ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        We're sorry, but your application was not approved for this event. Please check other events.
                      </p>
                    )}
                  </div>
                ) : isPastEvent ? (
                  <div className="text-center">
                    <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      This event has already taken place.
                    </p>
                  </div>
                ) : isDeadlinePassed ? (
                  <div className="text-center">
                    <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      The registration deadline for this event has passed.
                    </p>
                  </div>
                ) : isEventFull ? (
                  <div className="text-center">
                    <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      This event is at full capacity. No more applications are being accepted.
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <button
                      onClick={handleApply}
                      disabled={applying || !canApply}
                      className={`px-8 py-3 rounded-md text-white font-medium ${
                        applying
                          ? 'opacity-70 cursor-not-allowed'
                          : !isAuthenticated
                          ? darkMode
                            ? 'bg-teal-600 hover:bg-teal-700'
                            : 'bg-ocean-600 hover:bg-ocean-700'
                          : !canApply
                          ? darkMode 
                            ? 'bg-slate-600 cursor-not-allowed' 
                            : 'bg-gray-400 cursor-not-allowed'
                          : darkMode
                          ? 'bg-teal-600 hover:bg-teal-700'
                          : 'bg-ocean-600 hover:bg-ocean-700'
                      }`}
                    >
                      {applying 
                        ? 'Submitting Application...' 
                        : !isAuthenticated 
                        ? 'Login to Apply' 
                        : 'Apply for this Event'}
                    </button>
                    {!isAuthenticated && (
                      <p className={`mt-3 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        You need to login to apply for this event.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail; 
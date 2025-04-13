import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

const EventForm = () => {
  const { eventId } = useParams();
  const { darkMode } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  const isEditMode = Boolean(eventId);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    capacity: 0,
    registrationDeadline: '',
    image: '',
    isActive: true,
  });
  
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  
  useEffect(() => {    
    // If editing an existing event, fetch its data
    if (isEditMode) {
      fetchEvent();
    }
  }, [eventId, navigate, isEditMode]);
  
  const fetchEvent = async () => {
    try {
      setLoading(true);
      
      const response = await axios.get(`http://localhost:5500/api/events/${eventId}`);
      
      const event = response.data.data;
      
      // Format dates for the form
      const formattedDate = new Date(event.date).toISOString().split('T')[0];
      const formattedDeadline = new Date(event.registrationDeadline).toISOString().split('T')[0];
      
      setFormData({
        title: event.title,
        description: event.description,
        date: formattedDate,
        location: event.location,
        capacity: event.capacity,
        registrationDeadline: formattedDeadline,
        image: event.image || '',
        isActive: event.isActive,
      });
      
      setError(null);
    } catch (err) {
      console.error('Error fetching event:', err);
      setError('Failed to load event data. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSubmitting(true);
      setError(null);
      
      const payload = {
        ...formData,
        // Convert capacity to number
        capacity: parseInt(formData.capacity, 10),
      };
      
      if (isEditMode) {
        // Update existing event
        await axios.put(
          `http://localhost:5500/api/events/${eventId}`,
          payload
        );
      } else {
        // Create new event
        await axios.post(
          'http://localhost:5500/api/events',
          payload
        );
      }
      
      // Redirect to event management page
      navigate('/admin/events');
    } catch (err) {
      console.error('Error submitting form:', err);
      setError(err.response?.data?.message || 'Failed to save event. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };
  
  if (loading) {
    return (
      <div className={`min-h-screen flex justify-center items-center ${darkMode ? 'bg-slate-900' : 'bg-gray-50'}`}>
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <div className={`min-h-screen ${darkMode ? 'bg-slate-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">
            {isEditMode ? 'Edit Event' : 'Create New Event'}
          </h1>
          
          {error && (
            <div className={`p-4 rounded-md mb-6 ${darkMode ? 'bg-red-900/30 text-red-300' : 'bg-red-50 text-red-700'}`}>
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className={`rounded-lg shadow-md overflow-hidden mb-6 ${darkMode ? 'bg-slate-800' : 'bg-white'}`}>
              <div className="p-6 space-y-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium mb-2">
                    Event Title*
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className={`block w-full rounded-md px-4 py-2 ${
                      darkMode 
                        ? 'bg-slate-700 border-slate-600 text-white focus:border-teal-500' 
                        : 'bg-white border-gray-300 text-gray-900 focus:border-ocean-500'
                    } border focus:outline-none focus:ring-1 focus:ring-opacity-50 ${
                      darkMode ? 'focus:ring-teal-500' : 'focus:ring-ocean-500'
                    }`}
                  />
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium mb-2">
                    Description*
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    rows={6}
                    className={`block w-full rounded-md px-4 py-2 ${
                      darkMode 
                        ? 'bg-slate-700 border-slate-600 text-white focus:border-teal-500' 
                        : 'bg-white border-gray-300 text-gray-900 focus:border-ocean-500'
                    } border focus:outline-none focus:ring-1 focus:ring-opacity-50 ${
                      darkMode ? 'focus:ring-teal-500' : 'focus:ring-ocean-500'
                    }`}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="date" className="block text-sm font-medium mb-2">
                      Event Date*
                    </label>
                    <input
                      type="date"
                      id="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      required
                      className={`block w-full rounded-md px-4 py-2 ${
                        darkMode 
                          ? 'bg-slate-700 border-slate-600 text-white focus:border-teal-500' 
                          : 'bg-white border-gray-300 text-gray-900 focus:border-ocean-500'
                      } border focus:outline-none focus:ring-1 focus:ring-opacity-50 ${
                        darkMode ? 'focus:ring-teal-500' : 'focus:ring-ocean-500'
                      }`}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="registrationDeadline" className="block text-sm font-medium mb-2">
                      Registration Deadline*
                    </label>
                    <input
                      type="date"
                      id="registrationDeadline"
                      name="registrationDeadline"
                      value={formData.registrationDeadline}
                      onChange={handleChange}
                      required
                      className={`block w-full rounded-md px-4 py-2 ${
                        darkMode 
                          ? 'bg-slate-700 border-slate-600 text-white focus:border-teal-500' 
                          : 'bg-white border-gray-300 text-gray-900 focus:border-ocean-500'
                      } border focus:outline-none focus:ring-1 focus:ring-opacity-50 ${
                        darkMode ? 'focus:ring-teal-500' : 'focus:ring-ocean-500'
                      }`}
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="location" className="block text-sm font-medium mb-2">
                    Location*
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    className={`block w-full rounded-md px-4 py-2 ${
                      darkMode 
                        ? 'bg-slate-700 border-slate-600 text-white focus:border-teal-500' 
                        : 'bg-white border-gray-300 text-gray-900 focus:border-ocean-500'
                    } border focus:outline-none focus:ring-1 focus:ring-opacity-50 ${
                      darkMode ? 'focus:ring-teal-500' : 'focus:ring-ocean-500'
                    }`}
                  />
                </div>
                
                <div>
                  <label htmlFor="capacity" className="block text-sm font-medium mb-2">
                    Capacity (0 for unlimited)
                  </label>
                  <input
                    type="number"
                    id="capacity"
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleChange}
                    min="0"
                    className={`block w-full rounded-md px-4 py-2 ${
                      darkMode 
                        ? 'bg-slate-700 border-slate-600 text-white focus:border-teal-500' 
                        : 'bg-white border-gray-300 text-gray-900 focus:border-ocean-500'
                    } border focus:outline-none focus:ring-1 focus:ring-opacity-50 ${
                      darkMode ? 'focus:ring-teal-500' : 'focus:ring-ocean-500'
                    }`}
                  />
                </div>
                
                <div>
                  <label htmlFor="image" className="block text-sm font-medium mb-2">
                    Image URL
                  </label>
                  <input
                    type="text"
                    id="image"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    placeholder="https://example.com/image.jpg"
                    className={`block w-full rounded-md px-4 py-2 ${
                      darkMode 
                        ? 'bg-slate-700 border-slate-600 text-white focus:border-teal-500' 
                        : 'bg-white border-gray-300 text-gray-900 focus:border-ocean-500'
                    } border focus:outline-none focus:ring-1 focus:ring-opacity-50 ${
                      darkMode ? 'focus:ring-teal-500' : 'focus:ring-ocean-500'
                    }`}
                  />
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                    className={`h-4 w-4 rounded border ${
                      darkMode 
                        ? 'border-gray-600 focus:ring-teal-500 text-teal-600' 
                        : 'border-gray-300 focus:ring-ocean-500 text-ocean-600'
                    }`}
                  />
                  <label htmlFor="isActive" className="ml-2 block text-sm">
                    Event is active
                  </label>
                </div>
              </div>
              
              <div className={`px-6 py-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => navigate('/admin/events')}
                    className={`px-4 py-2 rounded border ${
                      darkMode 
                        ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                        : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className={`px-4 py-2 rounded ${
                      darkMode 
                        ? 'bg-teal-600 hover:bg-teal-700 text-white' 
                        : 'bg-ocean-600 hover:bg-ocean-700 text-white'
                    } ${submitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {submitting 
                      ? 'Saving...' 
                      : isEditMode 
                      ? 'Update Event' 
                      : 'Create Event'}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EventForm; 
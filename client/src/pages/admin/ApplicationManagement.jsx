import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

const ApplicationManagement = () => {
  const { eventId } = useParams();
  const { darkMode } = useTheme();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [event, setEvent] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [processingId, setProcessingId] = useState(null);
  
  useEffect(() => {
    fetchEvent();
  }, [eventId, navigate]);
  
  // Log application state changes
  useEffect(() => {
    if (applications.length > 0) {
      console.log('Applications in state:', applications.map(app => ({
        id: app._id?.toString() || 'Missing ID',
        name: app.userData?.firstName || (app.user?.firstName || 'Unknown'),
        status: app.status
      })));
    }
  }, [applications]);
  
  const fetchEvent = async () => {
    try {
      setLoading(true);
      
      console.log(`Fetching event details for event ID: ${eventId}`);
      const response = await axios.get(`http://localhost:5500/api/events/${eventId}`);
      
      setEvent(response.data.data);
      
      // Log the applicants to check the structure
      if (response.data.data.applicants) {
        console.log(`Found ${response.data.data.applicants.length} applicants:`, 
          response.data.data.applicants.map(app => ({
            id: app._id,
            name: app.userData?.firstName ? `${app.userData.firstName} ${app.userData.lastName}` : 'Unknown Name',
            email: app.userData?.email || 'Unknown Email',
            status: app.status
          }))
        );
      }
      
      // Extract and format applications with reliable IDs
      const apps = response.data.data.applicants.map((app, index) => {
        const uniqueId = app._id || `app-${index}-${Date.now()}`;
        
        // Create a reliable application object with all potential data sources
        return {
          ...app,
          _id: uniqueId,
          userData: app.userData || {
            firstName: app.user?.firstName || 'Guest',
            lastName: app.user?.lastName || 'User',
            email: app.user?.email || 'guest@example.com'
          },
          appliedAt: new Date(app.appliedAt),
        };
      });
      
      setApplications(apps);
      setError(null);
    } catch (err) {
      console.error('Error fetching event details:', err);
      setError('Failed to load event details. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const updateApplicationStatus = async (newStatus, applicationId) => {
    try {
      setProcessingId(applicationId);
      
      console.log(`Updating application ${applicationId} to status: ${newStatus}`);
      
      // Make sure we're using the string representation of the ID if it's an ObjectId
      const appId = typeof applicationId === 'object' ? applicationId.toString() : applicationId;
      
      await axios.put(
        `http://localhost:5500/api/events/${eventId}/applications/${appId}`,
        { status: newStatus }
      );
      
      // Update locally first for immediate feedback
      setApplications(prevApps => 
        prevApps.map(app => {
          const appIdStr = app._id.toString ? app._id.toString() : app._id;
          if (appIdStr === appId) {
            console.log(`Locally updating application with ID ${appId} to ${newStatus}`);
            return { ...app, status: newStatus };
          }
          return app;
        })
      );
      
      // Then refresh data from server
      setTimeout(() => fetchEvent(), 1000);
      
    } catch (err) {
      console.error('Error updating application status:', err);
      alert('Failed to update application status. Please try again.');
    } finally {
      setProcessingId(null);
    }
  };
  
  // Filter applications based on active tab
  const filteredApplications = applications.filter(app => {
    if (activeTab === 'all') return true;
    return app.status === activeTab;
  });
  
  if (loading) {
    return (
      <div className={`min-h-screen flex justify-center items-center ${darkMode ? 'bg-slate-900' : 'bg-gray-50'}`}>
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-slate-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
        <div className="container mx-auto px-4 py-8">
          <div className={`p-4 rounded-md ${darkMode ? 'bg-red-900/30 text-red-300' : 'bg-red-50 text-red-700'}`}>
            {error}
          </div>
          <div className="mt-4">
            <Link 
              to="/admin/events" 
              className={`${darkMode ? 'text-teal-400 hover:text-teal-300' : 'text-ocean-600 hover:text-ocean-500'}`}
            >
              &larr; Back to Events
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`min-h-screen ${darkMode ? 'bg-slate-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link 
            to="/admin/events" 
            className={`${darkMode ? 'text-teal-400 hover:text-teal-300' : 'text-ocean-600 hover:text-ocean-500'} mb-4 inline-block`}
          >
            &larr; Back to Events
          </Link>
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold mt-2">{event.title} - Applications</h1>
            <button
              onClick={fetchEvent}
              className={`px-3 py-2 rounded ${
                darkMode ? 'bg-slate-700 hover:bg-slate-600' : 'bg-gray-200 hover:bg-gray-300'
              } flex items-center space-x-1`}
              title="Refresh applications"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Refresh</span>
            </button>
          </div>
          <p className={`mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Event Date: {new Date(event.date).toLocaleDateString()}
          </p>
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
              All ({applications.length})
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
              Pending ({applications.filter(app => app.status === 'pending').length})
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
              Approved ({applications.filter(app => app.status === 'approved').length})
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
              Rejected ({applications.filter(app => app.status === 'rejected').length})
            </button>
          </div>
        </div>
        
        {filteredApplications.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-xl">No applications found.</p>
          </div>
        ) : (
          <div className={`overflow-hidden rounded-lg border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className={darkMode ? 'bg-slate-800' : 'bg-gray-50'}>
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Applicant
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Applied On
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className={`divide-y ${darkMode ? 'divide-gray-700 bg-slate-800' : 'divide-gray-200 bg-white'}`}>
                {filteredApplications.map((application) => (
                  <tr key={application._id || `app-${Math.random()}`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="ml-4">
                          <div className="text-sm font-bold">
                            {application.userData?.firstName ? 
                              `${application.userData.firstName} ${application.userData.lastName || ''}` :
                              application.user && typeof application.user !== 'string' && application.user.firstName ? 
                                `${application.user.firstName} ${application.user.lastName || ''}` : 
                                'Guest User'}
                          </div>
                          <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {application.userData?.email ? 
                              application.userData.email :
                              application.user && typeof application.user !== 'string' && application.user.email ? 
                                application.user.email : 
                                'guest@example.com'}
                          </div>
                          <div className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                            ID: {application._id ? application._id.toString().substring(0, 8) : '—'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        {application.appliedAt.toLocaleDateString()}, {application.appliedAt.toLocaleTimeString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${application.status === 'approved' 
                          ? darkMode ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-800'
                          : application.status === 'rejected'
                            ? darkMode ? 'bg-red-900 text-red-300' : 'bg-red-100 text-red-800'
                            : darkMode ? 'bg-yellow-900 text-yellow-300' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                        {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      {application.status !== 'approved' && (
                        <button
                          onClick={() => updateApplicationStatus(
                            'approved',
                            application._id
                          )}
                          className={`px-3 py-1 rounded text-white ${
                            darkMode ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'
                          }`}
                        >
                          Approve
                        </button>
                      )}
                      
                      {application.status !== 'rejected' && (
                        <button
                          onClick={() => updateApplicationStatus(
                            'rejected',
                            application._id
                          )}
                          className={`px-3 py-1 rounded text-white ${
                            darkMode ? 'bg-red-600 hover:bg-red-700' : 'bg-red-500 hover:bg-red-600'
                          }`}
                        >
                          Reject
                        </button>
                      )}
                      
                      {application.status !== 'pending' && (
                        <button
                          onClick={() => updateApplicationStatus(
                            'pending',
                            application._id
                          )}
                          className={`px-3 py-1 rounded text-white ${
                            darkMode ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-yellow-500 hover:bg-yellow-600'
                          }`}
                        >
                          Reset
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationManagement; 
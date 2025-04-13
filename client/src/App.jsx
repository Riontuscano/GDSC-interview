import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import './App.css';
import Landing from '../src/pages/Landling';
import SignUp from '../src/pages/SignUp';
import Login from '../src/pages/Login';
import AdminLogin from '../src/pages/AdminLogin';
import AdminDashboard from '../src/pages/AdminDashboard';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import EventDetail from '../src/pages/EventDetail';
import EventForm from '../src/pages/admin/EventForm';
import ApplicationManagement from '../src/pages/admin/ApplicationManagement';
import EventManagement from './pages/admin/EventManagement';
// import EventOverview from '../pages/EventOverview';
// import Home from '../src/pages/Home';
import Events from '../src/pages/Events';

// Create placeholder pages until they're properly implemented
const EventOverview = () => (
  <div className="container mx-auto px-4 py-16">
    <h1 className="text-4xl font-bold text-ocean-700 dark:text-ocean-300 mb-6 font-serif">Event Overview</h1>
    <p className="text-lg text-gray-700 dark:text-gray-300">Theme, vibe, location, and purpose of our upcoming event.</p>
  </div>
);

const Timeline = () => (
  <div className="container mx-auto px-4 py-16">
    <h1 className="text-4xl font-bold text-ocean-700 dark:text-ocean-300 mb-6 font-serif">Timeline & Schedule</h1>
    <p className="text-lg text-gray-700 dark:text-gray-300">Details about the event schedule and timeline.</p>
  </div>
);

const PastEvents = () => (
  <div className="container mx-auto px-4 py-16">
    <h1 className="text-4xl font-bold text-ocean-700 dark:text-ocean-300 mb-6 font-serif">Past Events</h1>
    <p className="text-lg text-gray-700 dark:text-gray-300">Stats, images, highlights, and testimonials from our past events.</p>
  </div>
);

const Mentors = () => (
  <div className="container mx-auto px-4 py-16">
    <h1 className="text-4xl font-bold text-ocean-700 dark:text-ocean-300 mb-6 font-serif">Speakers, Mentors & Investors</h1>
    <p className="text-lg text-gray-700 dark:text-gray-300">Images and short bios of our speakers, mentors, and investors.</p>
  </div>
);

const Team = () => (
  <div className="container mx-auto px-4 py-16">
    <h1 className="text-4xl font-bold text-ocean-700 dark:text-ocean-300 mb-6 font-serif">Team</h1>
    <p className="text-lg text-gray-700 dark:text-gray-300">Organizer and core team profiles.</p>
  </div>
);

// Layout wrapper for admin routes (no navbar)
const AdminLayout = ({ children }) => (
  <div className="flex flex-col min-h-screen bg-gradient-to-b from-ocean-50 to-ocean-100 dark:from-slate-900 dark:to-slate-800 dark:text-white transition-colors duration-300">
    <main className="flex-grow">
      {children}
    </main>
  </div>
);

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Admin routes - no navbar */}
            <Route path="/admin/login" element={
              <AdminLayout>
                <AdminLogin />
              </AdminLayout>
            } />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            
            {/* Regular routes with navbar */}
            <Route path="*" element={
              <div className="flex flex-col min-h-screen bg-gradient-to-b from-ocean-50 to-ocean-100 dark:from-slate-900 dark:to-slate-800 dark:text-white transition-colors duration-300">
                {/* Fixed height navbar container to prevent layout shifts */}
                <header className="sticky top-0 z-50">
                  <Navbar />
                </header>
                
                {/* Main content that fills remaining space */}
                <main className="flex-grow">
                  <Routes>
                    <Route path="/" element={<Landing />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/events" element={<Events />} />
                    <Route path="/eventsoverview" element={<EventOverview />} />
                    <Route path="/timeline" element={<Timeline />} />
                    <Route path="/events/:eventId" element={<EventDetail />} />
                    <Route path="/admin/events" element={<EventManagement />} />
                    <Route path="/admin/events/new" element={<EventForm />} />
                    <Route path="/admin/events/:eventId/edit" element={<EventForm />} />
                    <Route path="/admin/events/:eventId/applications" element={<ApplicationManagement />} />
                    <Route path="/mentors" element={<Mentors />} />
                    <Route path="/team" element={<Team />} />
                  </Routes>
                </main>
              </div>
            } />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}
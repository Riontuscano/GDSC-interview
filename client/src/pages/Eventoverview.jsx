import { useState } from 'react';
import { Calendar, Clock, MapPin, Users, Award, Coffee, Music, Moon, Sunrise, Sunset } from 'lucide-react';

export default function UnplugEventOverview() {
  const [activeDay, setActiveDay] = useState(1);

  const days = [
    {
      day: 1,
      date: "Friday, 28th March",
      theme: "The Journey Begins",
      activities: [
        { time: "1:30 PM", title: "Assemble for departure", icon: <MapPin size={18} /> },
        { time: "5:00 PM", title: "Arrival at Mandwa, transition to Alibaug", icon: <MapPin size={18} /> },
        { time: "6:00 PM", title: "Welcome drinks & gourmet snacks", icon: <Coffee size={18} /> },
        { time: "8:00 PM", title: "The First Pitch by the bonfire", icon: <Users size={18} /> },
        { time: "10:30 PM", title: "Dinner", icon: <Coffee size={18} /> },
        { time: "11:30 PM", title: "Open Mic: Stories, music, and more", icon: <Music size={18} /> },
        { time: "Post 12:30 AM", title: "Work, rest, or jam by the fire", icon: <Moon size={18} /> }
      ]
    },
    {
      day: 2,
      date: "Saturday, 29th March",
      theme: "Golden Hour & Unplug & Create",
      activities: [
        { time: "7:00 AM", title: "Beach Games: Play, refresh, reset", icon: <Sunrise size={18} /> },
        { time: "8:00 AM", title: "Breakfast + Mentoring", icon: <Coffee size={18} /> },
        { time: "10:30 AM", title: "Speaker Session", icon: <Users size={18} /> },
        { time: "11:15 AM", title: "Build + Mentoring", icon: <Users size={18} /> },
        { time: "2:00 PM", title: "Lunch", icon: <Coffee size={18} /> },
        { time: "3:00 PM", title: "Speaker Session", icon: <Users size={18} /> },
        { time: "4:00 PM", title: "Sunset, freshen up & relax", icon: <Sunset size={18} /> },
        { time: "6:00 PM", title: "Evening Snacks", icon: <Coffee size={18} /> },
        { time: "7:00 PM", title: "The GDSC Special", icon: <Award size={18} /> },
        { time: "8:30 PM", title: "Bounty Games", icon: <Award size={18} /> },
        { time: "9:30 PM", title: "DJ Night", icon: <Music size={18} /> },
        { time: "10:30 PM", title: "Dinner Under the Moon", icon: <Moon size={18} /> },
        { time: "11:30 PM", title: "Movie Night begins", icon: <Moon size={18} /> }
      ]
    },
    {
      day: 3,
      date: "Sunday, 30th March",
      theme: "The Grand Finale",
      activities: [
        { time: "9:00 AM", title: "Breakfast", icon: <Coffee size={18} /> },
        { time: "10:00 AM", title: "Investor Round", icon: <Users size={18} /> },
        { time: "12:00 PM", title: "Lunch", icon: <Coffee size={18} /> },
        { time: "1:00 PM", title: "Closing Ceremony", icon: <Award size={18} /> },
        { time: "1:30 PM", title: "Hamper Distribution & Pack-Up", icon: <Award size={18} /> },
        { time: "2:00 PM", title: "The journey home begins", icon: <MapPin size={18} /> }
      ]
    }
  ];

  return (
    <div className="bg-gradient-to-br from-blue-50 to-teal-50 min-h-screen p-6 font-sans">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-500 to-blue-500 p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-cover bg-center opacity-10" style={{ backgroundImage: "url('/api/placeholder/1200/300')" }}></div>
          <div className="relative z-10">
            <h1 className="text-4xl font-bold text-white mb-2">UNPLUG</h1>
            <p className="text-teal-100 text-lg">A 3-day beachside startup retreat & investor showcase</p>
            <div className="flex items-center mt-4 text-white">
              <Calendar className="mr-2" size={20} />
              <span>March 28-30</span>
              <div className="mx-4 h-4 border-r border-teal-300"></div>
              <MapPin className="mr-2" size={20} />
              <span>Alibaug, Mandwa</span>
            </div>
          </div>
        </div>
        
        {/* Event Overview */}
        <div className="p-6">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Event Overview</h2>
            <p className="text-gray-600">
              Unplug was an immersive 3-day startup retreat that brought together entrepreneurs, 
              mentors, and investors in the beautiful beachside setting of Alibaug. 
              From bonfire pitches to investor rounds, this event combined work and relaxation 
              to foster creativity, connections, and startup growth.
            </p>
          </div>
          
          {/* Day Selection Tabs */}
          <div className="flex border-b border-gray-200 mb-6">
            {days.map((day) => (
              <button
                key={day.day}
                onClick={() => setActiveDay(day.day)}
                className={`px-6 py-3 font-medium text-sm transition-colors duration-200 ${
                  activeDay === day.day
                    ? "border-b-2 border-teal-500 text-teal-600"
                    : "text-gray-500 hover:text-teal-500"
                }`}
              >
                Day {day.day}
              </button>
            ))}
          </div>
          
          {/* Day Content */}
          {days.map((day) => (
            <div key={day.day} className={activeDay === day.day ? "block" : "hidden"}>
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{day.date}</h3>
                  <p className="text-teal-600 font-medium">{day.theme}</p>
                </div>
              </div>
              
              {/* Timeline */}
              <div className="space-y-4">
                {day.activities.map((activity, index) => (
                  <div key={index} className="flex items-start p-3 hover:bg-teal-50 rounded-lg transition-colors duration-150">
                    <div className="bg-teal-100 text-teal-700 p-2 rounded-full mr-4">
                      {activity.icon}
                    </div>
                    <div>
                      <p className="text-gray-700 font-medium">{activity.time}</p>
                      <p className="text-gray-900">{activity.title}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        {/* Footer */}
        <div className="bg-gray-50 p-6 border-t border-gray-200">
          <div>
            <h3 className="text-gray-700 font-medium mb-1">Event Highlights</h3>
            <div className="flex flex-wrap gap-2">
              <span className="bg-teal-100 text-teal-800 text-xs px-3 py-1 rounded-full">Startup Pitches</span>
              <span className="bg-teal-100 text-teal-800 text-xs px-3 py-1 rounded-full">Investor Round</span>
              <span className="bg-teal-100 text-teal-800 text-xs px-3 py-1 rounded-full">Mentoring</span>
              <span className="bg-teal-100 text-teal-800 text-xs px-3 py-1 rounded-full">Beach Activities</span>
              <span className="bg-teal-100 text-teal-800 text-xs px-3 py-1 rounded-full">Bonfire Networking</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
import { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Users, Award, Coffee, Music, Moon, Sunrise, Sunset, ChevronRight, ChevronLeft } from 'lucide-react';

export default function UnplugEventTimeline() {
  const [activeDay, setActiveDay] = useState(1);
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState('right');
  const [visible, setVisible] = useState(true);

  const days = [
    {
      day: 1,
      date: "Friday, 28th March",
      theme: "The Journey Begins",
      activities: [
        { time: "1:30 PM", title: "Assemble for departure", icon: <MapPin size={18} />, color: "bg-blue-500" },
        { time: "5:00 PM", title: "Arrival at Mandwa, transition to Alibaug", icon: <MapPin size={18} />, color: "bg-blue-600" },
        { time: "6:00 PM", title: "Welcome drinks & gourmet snacks", icon: <Coffee size={18} />, color: "bg-teal-500" },
        { time: "8:00 PM", title: "The First Pitch by the bonfire", icon: <Users size={18} />, color: "bg-orange-500" },
        { time: "10:30 PM", title: "Dinner", icon: <Coffee size={18} />, color: "bg-teal-600" },
        { time: "11:30 PM", title: "Open Mic: Stories, music, and more", icon: <Music size={18} />, color: "bg-purple-500" },
        { time: "Post 12:30 AM", title: "Work, rest, or jam by the fire", icon: <Moon size={18} />, color: "bg-indigo-600" }
      ]
    },
    {
      day: 2,
      date: "Saturday, 29th March",
      theme: "Golden Hour & Unplug & Create",
      activities: [
        { time: "7:00 AM", title: "Beach Games: Play, refresh, reset", icon: <Sunrise size={18} />, color: "bg-yellow-500" },
        { time: "8:00 AM", title: "Breakfast + Mentoring", icon: <Coffee size={18} />, color: "bg-teal-500" },
        { time: "10:30 AM", title: "Speaker Session", icon: <Users size={18} />, color: "bg-blue-500" },
        { time: "11:15 AM", title: "Build + Mentoring", icon: <Users size={18} />, color: "bg-indigo-500" },
        { time: "2:00 PM", title: "Lunch", icon: <Coffee size={18} />, color: "bg-teal-600" },
        { time: "3:00 PM", title: "Speaker Session", icon: <Users size={18} />, color: "bg-blue-600" },
        { time: "4:00 PM", title: "Sunset, freshen up & relax", icon: <Sunset size={18} />, color: "bg-orange-500" },
        { time: "6:00 PM", title: "Evening Snacks", icon: <Coffee size={18} />, color: "bg-teal-500" },
        { time: "7:00 PM", title: "The GDSC Special", icon: <Award size={18} />, color: "bg-purple-600" },
        { time: "8:30 PM", title: "Bounty Games", icon: <Award size={18} />, color: "bg-pink-500" },
        { time: "9:30 PM", title: "DJ Night", icon: <Music size={18} />, color: "bg-violet-600" },
        { time: "10:30 PM", title: "Dinner Under the Moon", icon: <Coffee size={18} />, color: "bg-teal-600" },
        { time: "11:30 PM", title: "Movie Night begins", icon: <Moon size={18} />, color: "bg-indigo-600" }
      ]
    },
    {
      day: 3,
      date: "Sunday, 30th March",
      theme: "The Grand Finale",
      activities: [
        { time: "9:00 AM", title: "Breakfast", icon: <Coffee size={18} />, color: "bg-teal-500" },
        { time: "10:00 AM", title: "Investor Round", icon: <Users size={18} />, color: "bg-green-600" },
        { time: "12:00 PM", title: "Lunch", icon: <Coffee size={18} />, color: "bg-teal-600" },
        { time: "1:00 PM", title: "Closing Ceremony", icon: <Award size={18} />, color: "bg-purple-600" },
        { time: "1:30 PM", title: "Hamper Distribution & Pack-Up", icon: <Award size={18} />, color: "bg-blue-500" },
        { time: "2:00 PM", title: "The journey home begins", icon: <MapPin size={18} />, color: "bg-blue-600" }
      ]
    }
  ];

  const handleDayChange = (newDay) => {
    if (activeDay === newDay || animating) return;
    
    setDirection(newDay > activeDay ? 'right' : 'left');
    setAnimating(true);
    setVisible(false);
    
    setTimeout(() => {
      setActiveDay(newDay);
      setTimeout(() => {
        setVisible(true);
        setTimeout(() => {
          setAnimating(false);
        }, 500);
      }, 100);
    }, 500);
  };

  const nextDay = () => {
    if (activeDay < 3) handleDayChange(activeDay + 1);
  };

  const prevDay = () => {
    if (activeDay > 1) handleDayChange(activeDay - 1);
  };

  useEffect(() => {
    // Trigger initial animation
    setVisible(true);
  }, []);

  return (
    <div className="bg-gradient-to-br from-blue-50 to-teal-50 min-h-screen p-6 font-sans">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-600 to-blue-600 rounded-xl shadow-lg p-8 relative overflow-hidden mb-8">
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
        
        {/* Day Navigation */}
        <div className="flex justify-between items-center mb-8">
          <button 
            onClick={prevDay} 
            disabled={activeDay === 1}
            className={`flex items-center p-2 rounded-lg ${activeDay === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-teal-600 hover:bg-teal-50'}`}
          >
            <ChevronLeft size={20} />
            <span className="ml-1">Previous Day</span>
          </button>
          
          <div className="flex space-x-3">
            {[1, 2, 3].map(day => (
              <button
                key={day}
                onClick={() => handleDayChange(day)}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                  activeDay === day 
                    ? 'bg-teal-600 text-white shadow-md transform scale-110' 
                    : 'bg-white text-gray-700 hover:bg-teal-100'
                }`}
              >
                {day}
              </button>
            ))}
          </div>
          
          <button 
            onClick={nextDay} 
            disabled={activeDay === 3}
            className={`flex items-center p-2 rounded-lg ${activeDay === 3 ? 'text-gray-400 cursor-not-allowed' : 'text-teal-600 hover:bg-teal-50'}`}
          >
            <span className="mr-1">Next Day</span>
            <ChevronRight size={20} />
          </button>
        </div>
        
        {/* Day Header */}
        <div className="bg-white rounded-t-xl shadow-lg p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">
                Day {activeDay}: {days[activeDay - 1].date}
              </h2>
              <p className="text-teal-600 font-medium mt-1">{days[activeDay - 1].theme}</p>
            </div>
          </div>
        </div>
        
        {/* Timeline */}
        <div className="bg-white rounded-b-xl shadow-lg p-6 mb-8 overflow-hidden">
          <div 
            className={`transition-all duration-500 ease-in-out transform ${
              visible
                ? 'opacity-100 translate-x-0'
                : direction === 'right'
                  ? 'opacity-0 -translate-x-full'
                  : 'opacity-0 translate-x-full'
            }`}
          >
            <div className="relative pl-8 before:content-[''] before:absolute before:left-4 before:top-0 before:bottom-0 before:w-0.5 before:bg-gradient-to-b before:from-teal-500 before:via-blue-500 before:to-teal-500">
              {days[activeDay - 1].activities.map((activity, index) => (
                <div 
                  key={index}
                  className="mb-8 relative animate-fadeIn"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className={`absolute left-[-10px] w-6 h-6 rounded-full ${activity.color} flex items-center justify-center shadow-md`}>
                    {activity.icon}
                  </div>
                  <div className="bg-white rounded-lg shadow-md p-4 ml-4 hover:shadow-lg transition-shadow duration-300 border-l-4 border-teal-500">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">{activity.title}</h3>
                        <p className="text-gray-600 text-sm mt-1">{activity.time}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Event Summary */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Event Highlights</h3>
          <div className="flex flex-wrap gap-2">
            <span className="bg-gradient-to-r from-teal-500 to-teal-600 text-white text-xs px-4 py-2 rounded-full">Startup Pitches</span>
            <span className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs px-4 py-2 rounded-full">Investor Round</span>
            <span className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white text-xs px-4 py-2 rounded-full">Mentoring</span>
            <span className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs px-4 py-2 rounded-full">Beach Activities</span>
            <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs px-4 py-2 rounded-full">Bonfire Networking</span>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}
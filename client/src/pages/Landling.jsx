import Spline from '@splinetool/react-spline';
import { useState, useCallback, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

export default function Home() {
  const { darkMode } = useTheme();
  const [loaded, setLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const splineRef = useRef();
  const splineContainerRef = useRef();

  const handleSplineLoad = useCallback(() => {
    setLoaded(true);
  }, []);

  useEffect(() => {
    // Check if device is mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Set initial value
    checkMobile();
    
    // Add event listener for resize
    window.addEventListener('resize', checkMobile);
    
    // Clean up
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (splineContainerRef.current) {
      splineContainerRef.current.style.transform = 'translateZ(0)';
    }
  }, [darkMode]);

  return (
    <main className={`relative min-h-screen ${darkMode ? 'bg-slate-900' : 'bg-sky-200'}`}>
      <section className="relative h-screen overflow-hidden">
        {/* Sky elements - Stars and Moon (dark mode) or Sun and light clouds (light mode) */}
        <div className={`absolute inset-0 z-10 transition-opacity duration-1000 ${darkMode ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          {/* Stars - only visible in dark mode */}
          <div className="stars absolute inset-0">
            {[...Array(isMobile ? 50 : 100)].map((_, i) => (
              <div
                key={i}
                className="star absolute rounded-full bg-white"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  width: `${Math.random() * 3 + 1}px`,
                  height: `${Math.random() * 3 + 1}px`,
                  opacity: Math.random() * 0.8 + 0.2,
                  animation: `twinkle ${Math.random() * 5 + 3}s infinite`,
                  zIndex: 5
                }}
              />
            ))}
          </div>
          
          {/* Moon - only visible in dark mode */}
          <div className="absolute top-10 right-10 md:top-20 md:right-20 z-5">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gray-100 shadow-[0_0_30px_8px_rgba(255,255,255,0.3)] md:shadow-[0_0_40px_10px_rgba(255,255,255,0.3)]"></div>
          </div>
          
          {/* Dark mode clouds - responsive sizing */}
          <div className="absolute top-40 left-1/4 w-32 h-10 md:w-40 md:h-14 rounded-full bg-gray-700/30 blur-sm"></div>
          <div className="absolute top-52 right-1/3 w-40 h-12 md:w-56 md:h-16 rounded-full bg-gray-700/20 blur-sm"></div>
          <div className="absolute top-32 right-1/4 w-24 h-8 md:w-32 md:h-10 rounded-full bg-gray-700/40 blur-sm"></div>
        </div>
        <div className={`absolute inset-0 z-10 transition-opacity duration-1000 ${darkMode ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          <div className="absolute top-10 left-10 md:top-20 md:left-20">
            <div className="w-16 h-16 md:w-24 md:h-24 rounded-full bg-yellow-300 shadow-[0_0_50px_20px_rgba(250,204,21,0.4)] md:shadow-[0_0_70px_30px_rgba(250,204,21,0.4)]"></div>
          </div>
          
          {/* Light mode clouds - responsive sizing */}
          <div className="absolute top-40 left-1/3 w-32 h-12 md:w-48 md:h-16 rounded-full bg-white/80 blur-sm"></div>
          <div className="absolute top-52 right-1/4 w-44 h-14 md:w-64 md:h-20 rounded-full bg-white/90 blur-sm"></div>
          <div className="absolute top-32 right-1/3 w-28 h-10 md:w-40 md:h-14 rounded-full bg-white/70 blur-sm"></div>
        </div>
        
        {/* Added Heading Text at the top - well above the UNPLUG logo */}
        <div className="absolute top-24 md:top-32 left-0 right-0 z-30 text-center">
          <h1 className={`text-3xl sm:text-4xl md:text-5xl font-bold mb-2 ${darkMode ? 'text-blue-100' : 'text-blue-800'}`}>
            Disconnect to Reconnect
          </h1>
          <p className={`text-base sm:text-lg md:text-xl ${darkMode ? 'text-blue-200' : 'text-blue-600'}`}>
            A digital detox experience
          </p>
        </div>
        
        {/* Spline 3D for desktop only */}
        <div ref={splineContainerRef} className="absolute inset-0 z-20 hidden md:block">
          <Spline 
            scene="https://prod.spline.design/vriEGtPzItjXhDU6/scene.splinecode"
            onLoad={handleSplineLoad}
            ref={splineRef}
            style={{
              width: '100%',
              height: '100%',
              willChange: 'transform',
              contain: 'strict', 
            }}
          />
     
          {!loaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-ocean-600/20 dark:bg-slate-900/50 backdrop-blur-sm">
              <div className="w-16 h-16 border-4 border-ocean-200 border-t-ocean-500 rounded-full animate-spin"></div>
            </div>
          )}
        </div>

        {/* Mobile-friendly alternative to Spline */}
        <div className="absolute inset-0 z-20 block md:hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Static water animation for mobile */}
            <div className="relative w-full h-1/2 mt-32">
              {/* Static water surface */}
              <div className="absolute bottom-0 w-full h-full bg-blue-400/80 dark:bg-blue-500/70">
                {/* Animated waves */}
                <div className="absolute inset-0 opacity-30 dark:opacity-40"
                     style={{
                       backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 1440 320%22%3E%3Cpath fill=%22%230099ff%22 d=%22M0,288L48,272C96,256,192,224,288,197.3C384,171,480,149,576,165.3C672,181,768,235,864,250.7C960,267,1056,245,1152,250.7C1248,256,1344,288,1392,304L1440,320L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z%22%3E%3C/path%3E%3C/svg%3E")',
                       backgroundSize: 'cover',
                       backgroundRepeat: 'no-repeat',
                       animation: 'wave 15s ease-in-out infinite alternate'
                     }}
                />
                <div className="absolute inset-0 opacity-60 dark:opacity-70"
                     style={{
                       backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 1440 320%22%3E%3Cpath fill=%22%230099ff%22 d=%22M0,64L48,80C96,96,192,128,288,122.7C384,117,480,75,576,80C672,85,768,139,864,176C960,213,1056,235,1152,218.7C1248,203,1344,149,1392,122.7L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z%22%3E%3C/path%3E%3C/svg%3E")',
                       backgroundSize: 'cover',
                       backgroundRepeat: 'no-repeat',
                       animation: 'wave 10s ease-in-out infinite'
                     }}
                />
              </div>
              
              {/* UNPLUG text for mobile */}
              <div className="absolute bottom-1/4 left-1/2 transform -translate-x-1/2 text-center">
                <h1 className="text-6xl font-bold text-blue-100 drop-shadow-lg" 
                    style={{
                      fontFamily: "'Arial', sans-serif",
                      textShadow: '0 2px 5px rgba(0,0,0,0.2)',
                      animation: 'float 3s ease-in-out infinite'
                    }}>
                  UNPLUG
                </h1>
                {/* Water droplets/bubbles */}
                <div className="absolute -top-2 -left-2 w-3 h-3 rounded-full bg-blue-200 opacity-80 animate-ping" style={{ animationDuration: '3s' }}></div>
                <div className="absolute top-1 right-0 w-2 h-2 rounded-full bg-blue-200 opacity-70 animate-ping" style={{ animationDuration: '2.5s' }}></div>
                <div className="absolute bottom-1 left-1 w-2 h-2 rounded-full bg-blue-200 opacity-60 animate-ping" style={{ animationDuration: '4s' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Added Text below the UNPLUG logo - above the arrow */}
        <div className="absolute bottom-24 md:bottom-32 left-0 right-0 z-30 text-center px-4">
          <p className={`text-base md:text-lg max-w-md mx-auto mb-4 md:mb-6 ${darkMode ? 'text-blue-100' : 'text-blue-700'}`}>
            Find your balance in a hyper-connected world
          </p>
          <button className={`px-5 py-2 md:px-6 md:py-2 rounded-full font-medium transition-colors ${
            darkMode 
              ? 'bg-blue-400 text-slate-900 hover:bg-blue-300' 
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}>
            Begin Journey
          </button>
        </div>

        <div className="absolute bottom-8 md:bottom-10 left-1/2 transform -translate-x-1/2 z-30 animate-bounce text-white">
          <svg className="h-6 w-6 md:h-8 md:w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
          </svg>
        </div>
      </section>
      
      {/* Add this CSS to your global stylesheet */}
      <style jsx>{`
        @keyframes wave {
          0% { transform: translateX(0) translateY(0); }
          50% { transform: translateX(-25px) translateY(5px); }
          100% { transform: translateX(0) translateY(0); }
        }
        
        @keyframes float {
          0% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0); }
        }
        
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
      `}</style>
    </main>
  );
}
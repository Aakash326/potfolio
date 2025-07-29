import React from 'react';

const ParticleBackground = () => {
  const aiColors = ['hsl(174 100% 50%)', 'hsl(240 100% 70%)', 'hsl(280 100% 70%)', 'hsl(193 100% 60%)'];
  
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none particle-container">
      {/* Neural network connections */}
      <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 1920 1080">
        <defs>
          <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{stopColor: 'hsl(174 100% 50%)', stopOpacity: 0.6}} />
            <stop offset="50%" style={{stopColor: 'hsl(240 100% 70%)', stopOpacity: 0.3}} />
            <stop offset="100%" style={{stopColor: 'hsl(280 100% 70%)', stopOpacity: 0.6}} />
          </linearGradient>
        </defs>
        
        {/* Neural network lines */}
        {[...Array(15)].map((_, i) => (
          <line
            key={`line-${i}`}
            x1={Math.random() * 1920}
            y1={Math.random() * 1080}
            x2={Math.random() * 1920}
            y2={Math.random() * 1080}
            stroke="url(#connectionGradient)"
            strokeWidth="1"
            className="animate-pulse"
            style={{
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          />
        ))}
      </svg>
      
      {/* AI-themed floating particles */}
      {[...Array(35)].map((_, i) => (
        <div
          key={i}
          className={`absolute rounded-full particle-${i % 3}`}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${Math.random() * 8 + 2}px`,
            height: `${Math.random() * 8 + 2}px`,
            backgroundColor: aiColors[Math.floor(Math.random() * aiColors.length)],
            opacity: Math.random() * 0.6 + 0.2,
            animationDelay: `${Math.random() * 5}s`,
            boxShadow: `0 0 ${Math.random() * 20 + 10}px currentColor`,
            filter: `blur(${Math.random() * 2}px)`,
          }}
        />
      ))}
      
      {/* Additional glowing orbs */}
      {[...Array(8)].map((_, i) => (
        <div
          key={`orb-${i}`}
          className="absolute rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${Math.random() * 60 + 20}px`,
            height: `${Math.random() * 60 + 20}px`,
            background: `radial-gradient(circle, ${aiColors[Math.floor(Math.random() * aiColors.length)]} 0%, transparent 70%)`,
            opacity: Math.random() * 0.3 + 0.1,
            animation: `float-${i % 3} ${8 + Math.random() * 4}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 3}s`,
            filter: 'blur(40px)',
          }}
        />
      ))}
    </div>
  );
};

export default ParticleBackground;
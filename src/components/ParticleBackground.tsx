import React from 'react';

const ParticleBackground = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none particle-container">
      {/* Animated particles using CSS */}
      {[...Array(25)].map((_, i) => (
        <div
          key={i}
          className={`absolute rounded-full particle-${i % 3}`}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${Math.random() * 6 + 3}px`,
            height: `${Math.random() * 6 + 3}px`,
            backgroundColor: ['#3b82f6', '#8b5cf6', '#06b6d4', '#6366f1'][Math.floor(Math.random() * 4)],
            opacity: Math.random() * 0.5 + 0.3,
            animationDelay: `${Math.random() * 5}s`,
            boxShadow: '0 0 10px currentColor',
          }}
        />
      ))}
    </div>
  );
};

export default ParticleBackground;
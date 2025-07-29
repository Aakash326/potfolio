import React from 'react';

const NeuralNetwork = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
      <svg className="w-full h-full" viewBox="0 0 400 400" fill="none">
        <defs>
          <linearGradient id="neuralGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(174 100% 50%)" stopOpacity={0.8} />
            <stop offset="50%" stopColor="hsl(240 100% 70%)" stopOpacity={0.6} />
            <stop offset="100%" stopColor="hsl(280 100% 70%)" stopOpacity={0.8} />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Neural network nodes */}
        <g filter="url(#glow)">
          {/* Input layer */}
          <circle cx="50" cy="100" r="6" fill="url(#neuralGradient)" className="animate-pulse" style={{animationDelay: '0s'}} />
          <circle cx="50" cy="150" r="6" fill="url(#neuralGradient)" className="animate-pulse" style={{animationDelay: '0.5s'}} />
          <circle cx="50" cy="200" r="6" fill="url(#neuralGradient)" className="animate-pulse" style={{animationDelay: '1s'}} />
          <circle cx="50" cy="250" r="6" fill="url(#neuralGradient)" className="animate-pulse" style={{animationDelay: '1.5s'}} />
          
          {/* Hidden layer 1 */}
          <circle cx="150" cy="80" r="6" fill="url(#neuralGradient)" className="animate-pulse" style={{animationDelay: '0.2s'}} />
          <circle cx="150" cy="130" r="6" fill="url(#neuralGradient)" className="animate-pulse" style={{animationDelay: '0.7s'}} />
          <circle cx="150" cy="180" r="6" fill="url(#neuralGradient)" className="animate-pulse" style={{animationDelay: '1.2s'}} />
          <circle cx="150" cy="230" r="6" fill="url(#neuralGradient)" className="animate-pulse" style={{animationDelay: '1.7s'}} />
          <circle cx="150" cy="280" r="6" fill="url(#neuralGradient)" className="animate-pulse" style={{animationDelay: '2.2s'}} />
          
          {/* Hidden layer 2 */}
          <circle cx="250" cy="100" r="6" fill="url(#neuralGradient)" className="animate-pulse" style={{animationDelay: '0.3s'}} />
          <circle cx="250" cy="150" r="6" fill="url(#neuralGradient)" className="animate-pulse" style={{animationDelay: '0.8s'}} />
          <circle cx="250" cy="200" r="6" fill="url(#neuralGradient)" className="animate-pulse" style={{animationDelay: '1.3s'}} />
          <circle cx="250" cy="250" r="6" fill="url(#neuralGradient)" className="animate-pulse" style={{animationDelay: '1.8s'}} />
          
          {/* Output layer */}
          <circle cx="350" cy="150" r="6" fill="url(#neuralGradient)" className="animate-pulse" style={{animationDelay: '0.4s'}} />
          <circle cx="350" cy="200" r="6" fill="url(#neuralGradient)" className="animate-pulse" style={{animationDelay: '0.9s'}} />
        </g>
        
        {/* Connections with data flow animation */}
        <g stroke="url(#neuralGradient)" strokeWidth="1" opacity="0.6">
          {/* Input to hidden layer 1 connections */}
          <line x1="56" y1="100" x2="144" y2="80">
            <animate attributeName="stroke-dasharray" values="0 200;200 0;0 200" dur="3s" repeatCount="indefinite" />
          </line>
          <line x1="56" y1="150" x2="144" y2="130">
            <animate attributeName="stroke-dasharray" values="0 200;200 0;0 200" dur="3.2s" repeatCount="indefinite" />
          </line>
          <line x1="56" y1="200" x2="144" y2="180">
            <animate attributeName="stroke-dasharray" values="0 200;200 0;0 200" dur="2.8s" repeatCount="indefinite" />
          </line>
          
          {/* Hidden layer 1 to hidden layer 2 connections */}
          <line x1="156" y1="130" x2="244" y2="150">
            <animate attributeName="stroke-dasharray" values="0 200;200 0;0 200" dur="3.5s" repeatCount="indefinite" />
          </line>
          <line x1="156" y1="180" x2="244" y2="200">
            <animate attributeName="stroke-dasharray" values="0 200;200 0;0 200" dur="2.9s" repeatCount="indefinite" />
          </line>
          
          {/* Hidden layer 2 to output connections */}
          <line x1="256" y1="150" x2="344" y2="150">
            <animate attributeName="stroke-dasharray" values="0 200;200 0;0 200" dur="3.1s" repeatCount="indefinite" />
          </line>
          <line x1="256" y1="200" x2="344" y2="200">
            <animate attributeName="stroke-dasharray" values="0 200;200 0;0 200" dur="3.3s" repeatCount="indefinite" />
          </line>
        </g>
      </svg>
    </div>
  );
};

export default NeuralNetwork;
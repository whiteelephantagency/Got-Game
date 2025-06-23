"use client";

import { useEffect, useState } from "react";

interface StatMapProps {
  total: number;
  safe: number;
  progress: number;
  showFinalSplit?: boolean;
  onComplete?: () => void;
  label?: string;
  fullScreen?: boolean; // New prop for full-screen mode
  playerName?: string; // Player name for personalized messages
  theme?: 'default' | 'elimination' | 'advancement' | 'final'; // Theme variants
}

export default function StatMap({
  total,
  safe,
  progress,
  showFinalSplit = false,
  onComplete,
  label = "players answered correctly",
  fullScreen = false,
  playerName = "Player",
  theme = 'default'
}: StatMapProps) {
  const [completed, setCompleted] = useState(false);
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (progress >= (showFinalSplit ? safe : total) && !completed) {
      setCompleted(true);
      onComplete?.();
    }
  }, [progress, total, safe, showFinalSplit, onComplete, completed]);

  // Animate the counter
  useEffect(() => {
    const targetValue = showFinalSplit ? safe : progress;
    const duration = 500; // 0.5 seconds
    const steps = 20;
    const increment = (targetValue - displayValue) / steps;
    
    if (Math.abs(targetValue - displayValue) > 1) {
      const timer = setInterval(() => {
        setDisplayValue(prev => {
          const newValue = prev + increment;
          if (increment > 0 && newValue >= targetValue) {
            clearInterval(timer);
            return targetValue;
          } else if (increment < 0 && newValue <= targetValue) {
            clearInterval(timer);
            return targetValue;
          }
          return Math.round(newValue);
        });
      }, duration / steps);

      return () => clearInterval(timer);
    } else {
      setDisplayValue(targetValue);
    }
  }, [progress, safe, showFinalSplit, displayValue]);

  // Theme configurations
  const themeConfig = {
    default: {
      bg: "from-purple-900 via-blue-900 to-indigo-900",
      accent: "from-purple-400 to-pink-400",
      textGradient: "from-purple-300 via-pink-300 to-purple-300",
      icon: "📊",
      dots: "bg-purple-400"
    },
    elimination: {
      bg: "from-red-900 via-orange-900 to-yellow-900",
      accent: "from-red-400 to-orange-400",
      textGradient: "from-red-300 via-orange-300 to-yellow-300",
      icon: "❌",
      dots: "bg-red-400"
    },
    advancement: {
      bg: "from-green-900 via-emerald-900 to-teal-900",
      accent: "from-green-400 to-emerald-400",
      textGradient: "from-green-300 via-emerald-300 to-teal-300",
      icon: "✅",
      dots: "bg-green-400"
    },
    final: {
      bg: "from-yellow-900 via-orange-900 to-red-900",
      accent: "from-yellow-400 to-orange-400",
      textGradient: "from-yellow-300 via-orange-300 to-red-300",
      icon: "🏆",
      dots: "bg-yellow-400"
    }
  };

  const config = themeConfig[theme];

  if (fullScreen) {
    return (
      <div className={`flex flex-col items-center justify-center min-h-[500px] bg-gradient-to-br ${config.bg} rounded-3xl p-12 border-2 border-purple-500/50 shadow-2xl relative overflow-hidden`}>
        {/* Enhanced background animations */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-2 h-2 ${config.dots} rounded-full animate-bounce`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${1 + Math.random()}s`
              }}
            />
          ))}
        </div>

        {/* Main content */}
        <div className="relative z-10 text-center space-y-8">
          {/* Large icon */}
          <div className="text-8xl mb-6 animate-pulse">
            {config.icon}
          </div>

          {/* Title */}
          <div className="text-white/90 text-3xl font-bold mb-6 tracking-wider uppercase">
            Game Statistics
          </div>

          {/* Counter with enhanced styling */}
          <div className="relative">
            <div className={`absolute inset-0 bg-gradient-to-r ${config.accent} rounded-3xl blur-2xl opacity-30 animate-pulse`}></div>
            <div className="relative bg-black/50 backdrop-blur-sm rounded-3xl px-12 py-8 border border-white/20">
              <div className={`text-9xl font-bold text-transparent bg-gradient-to-r ${config.textGradient} bg-clip-text mb-4 text-center font-mono tracking-wider`}>
                {displayValue.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Enhanced label with personalization */}
          <div className="text-white/80 text-2xl mt-8 text-center max-w-lg leading-relaxed">
            {label.includes(playerName) ? label : `${playerName}: ${label}`}
          </div>

          {/* Progress bar */}
          <div className="w-full max-w-md mx-auto mt-8">
            <div className="w-full bg-gray-700 rounded-full h-4">
              <div 
                className={`bg-gradient-to-r ${config.accent} h-4 rounded-full transition-all duration-1000 ease-out`}
                style={{ width: `${(displayValue / total) * 100}%` }}
              ></div>
            </div>
            <div className="text-white/70 text-lg mt-2">
              {Math.round((displayValue / total) * 100)}% Complete
            </div>
          </div>

          {/* Enhanced decorative elements */}
          <div className="flex justify-center space-x-3 mt-8">
            {Array.from({ length: 7 }).map((_, i) => (
              <div
                key={i}
                className={`w-3 h-3 ${config.dots} rounded-full animate-pulse`}
                style={{
                  animationDelay: `${i * 0.3}s`,
                  animationDuration: '2s'
                }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Regular compact mode
  return (
    <div className={`flex flex-col items-center justify-center min-h-[300px] bg-gradient-to-br ${config.bg} rounded-3xl p-8 border-2 border-purple-500/50 shadow-2xl relative overflow-hidden`}>
      {/* Background effect */}
      <div className={`absolute inset-0 bg-gradient-to-r ${config.accent} rounded-3xl blur-xl opacity-20 animate-pulse`}></div>
      
      {/* Header */}
      <div className="relative z-10 text-white/80 text-lg font-medium mb-4 tracking-wider uppercase flex items-center">
        <span className="text-2xl mr-2">{config.icon}</span>
        Game Stats
      </div>
      
      {/* Main counter display */}
      <div className="relative">
        <div className={`absolute inset-0 bg-gradient-to-r ${config.accent} rounded-2xl blur-xl opacity-20 animate-pulse`}></div>
        <div className="relative bg-black/40 backdrop-blur-sm rounded-2xl px-8 py-6 border border-purple-400/30">
          <div className={`text-6xl font-bold text-transparent bg-gradient-to-r ${config.textGradient} bg-clip-text mb-2 text-center font-mono tracking-wider`}>
            {displayValue.toLocaleString()}
          </div>
        </div>
      </div>
      
      {/* Label */}
      <div className="text-white/70 text-base mt-4 text-center max-w-xs">
        {label}
      </div>
      
      {/* Decorative elements */}
      <div className="flex space-x-2 mt-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 ${config.dots} rounded-full animate-pulse`}
            style={{
              animationDelay: `${i * 0.2}s`,
              animationDuration: '2s'
            }}
          />
        ))}
      </div>
    </div>
  );
}
"use client";
import { useEffect, useState } from "react";

interface StatMapProps {
  total: number;
  safe: number;
  progress: number;
  showFinalSplit?: boolean;
  onComplete?: () => void;
  label?: string;
}

export default function StatMap({
  total,
  safe,
  progress,
  showFinalSplit = false,
  onComplete,
  label = "players answered correctly"
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

  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 rounded-3xl p-8 border-2 border-purple-500/50 shadow-2xl">
      <div className="text-white/80 text-lg font-medium mb-4 tracking-wider uppercase">
        Game Stats
      </div>
      
      <div className="relative">
        {/* Glowing background effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-2xl blur-xl opacity-20 animate-pulse"></div>
        
        {/* Main counter display */}
        <div className="relative bg-black/40 backdrop-blur-sm rounded-2xl px-8 py-6 border border-purple-400/30">
          <div className="text-6xl font-bold text-transparent bg-gradient-to-r from-purple-300 via-pink-300 to-purple-300 bg-clip-text mb-2 text-center font-mono tracking-wider">
            {displayValue.toLocaleString()}
          </div>
        </div>
      </div>
      
      <div className="text-white/70 text-base mt-4 text-center max-w-xs">
        {label}
      </div>
      
      {/* Decorative elements */}
      <div className="flex space-x-2 mt-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"
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
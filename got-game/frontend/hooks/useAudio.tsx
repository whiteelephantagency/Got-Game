// useAudio.tsx
"use client"
import React, { createContext, useContext, useState, FC, ReactNode } from 'react';

// Define the shape of the context
interface AudioContextType {
  audioEnabled: boolean;
  setAudioEnabled: (enabled: boolean) => void;
}

// Create the Context
const AudioContext = createContext<AudioContextType | undefined>(undefined);

// Custom Hook to use the context
export const useAudio = (): AudioContextType => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};

// Provider Component
interface AudioProviderProps {
  children: ReactNode;
}

export const AudioProvider: FC<AudioProviderProps> = ({ children }) => {
  // audioEnabled starts false, requiring the user gesture to set to true.
  const [audioEnabled, setAudioEnabled] = useState(false);

  return (
    <AudioContext.Provider value={{ audioEnabled, setAudioEnabled }}>
      {children}
    </AudioContext.Provider>
  );
};
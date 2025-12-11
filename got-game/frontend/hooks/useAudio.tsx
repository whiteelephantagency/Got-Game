// hooks/useAudio.ts
"use client"
import React, { createContext, useContext, useState, FC, ReactNode } from 'react';

interface AudioContextType {
  audioEnabled: boolean;
  setAudioEnabled: (enabled: boolean) => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const useAudio = (): AudioContextType => {
  const context = useContext(AudioContext);
  if (!context) {
    // Helpful error message if hook is used outside the provider
    throw new Error('useAudio must be used within an AudioProvider'); 
  }
  return context;
};

interface AudioProviderProps {
  children: ReactNode;
}

export const AudioProvider: FC<AudioProviderProps> = ({ children }) => {
  const [audioEnabled, setAudioEnabled] = useState(false);

  return (
    <AudioContext.Provider value={{ audioEnabled, setAudioEnabled }}>
      {children}
    </AudioContext.Provider>
  );
};
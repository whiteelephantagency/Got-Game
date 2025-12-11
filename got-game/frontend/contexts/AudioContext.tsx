// contexts/AudioContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AudioContextType {
  audioEnabled: boolean;
  requestAudioPermission: () => Promise<void>;
  isPermissionGranted: boolean;
}

const AudioPermissionContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: ReactNode }) {
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [isPermissionGranted, setIsPermissionGranted] = useState(false);

  // Check if permission was previously granted (stored in localStorage)
  useEffect(() => {
    const permissionGranted = localStorage.getItem('audioPermissionGranted');
    if (permissionGranted === 'true') {
      setIsPermissionGranted(true);
      setAudioEnabled(true);
    }
  }, []);

  const requestAudioPermission = async () => {
    try {
      // Create AudioContext to unlock audio playback
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      const audioContext = new AudioContext();
      
      // Resume context if suspended (Safari requirement)
      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }
      
      // Play silent audio to unlock
      const buffer = audioContext.createBuffer(1, 1, 22050);
      const source = audioContext.createBufferSource();
      source.buffer = buffer;
      source.connect(audioContext.destination);
      source.start(0);
      
      // Save permission to localStorage
      localStorage.setItem('audioPermissionGranted', 'true');
      setAudioEnabled(true);
      setIsPermissionGranted(true);
      
      console.log('Audio unlocked successfully');
    } catch (error) {
      console.error('Failed to unlock audio:', error);
    }
  };

  return (
    <AudioPermissionContext.Provider 
      value={{ 
        audioEnabled, 
        requestAudioPermission, 
        isPermissionGranted 
      }}
    >
      {children}
    </AudioPermissionContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioPermissionContext);
  if (context === undefined) {
    throw new Error('useAudio must be used within AudioProvider');
  }
  return context;
}
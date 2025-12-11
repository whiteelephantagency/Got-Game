// components/AudioPermissionModal.tsx
// This component now takes children and conditionally renders them.

"use client"
import React, { FC, ReactNode } from 'react';
import { useAudio } from '@/hooks/useAudio'; // Import the useAudio hook

interface GlobalAudioPromptProps {
    children: ReactNode;
}

export const GlobalAudioPrompt: FC<GlobalAudioPromptProps> = ({ children }) => {
  const { audioEnabled, setAudioEnabled } = useAudio();

  // This function is called by the single user click
  const handleEnableAudio = () => {
    if (!audioEnabled) {
      // 1. Set the global state to true (Authorization granted!)
      setAudioEnabled(true);
      
      // 2. OPTIONAL: Play a silent audio file to confirm the gesture is registered
      // This is a browser trick to lock in the permission.
      try {
          const dummyAudio = new Audio();
          dummyAudio.muted = false; // Ensure it's not muted for the test
          // Minimal silent data URI
          dummyAudio.src = 'data:audio/mpeg;base64,TVRhdgIAAAAAAAGVAAAAAAAAAAACAwAAAwAAAAABAAAA'; 
          dummyAudio.play().catch(e => console.log('Dummy audio play failed:', e));
      } catch (e) {
          // Ignore errors
      }
    }
  };

  if (audioEnabled) {
    // If permission is granted, render the rest of the application
    return <>{children}</>;
  }

  // If permission is NOT granted, render the blocking prompt/overlay
  return (
    <div className="fixed inset-0 z-[9999] bg-black/95 flex flex-col items-center justify-center p-4">
      <h2 className="text-white text-3xl font-bold mb-4">GOT GAME: Audio Required</h2>
      <p className="text-gray-300 text-center mb-8 max-w-md">
        Please click "Enable Sound" to ensure all game videos and audio play correctly on Safari and other browsers.
      </p>
      
      <button 
        onClick={handleEnableAudio}
        className="px-8 py-4 bg-[#A757E7] text-white text-xl font-bold rounded-lg shadow-2xl hover:bg-purple-600 transition-colors focus:outline-none focus:ring-4 focus:ring-[#A757E7]/50"
      >
        Click to Enable Sound
      </button>
      
      <p className="text-gray-500 mt-4 text-sm">This is only required once per session.</p>
    </div>
  );
};
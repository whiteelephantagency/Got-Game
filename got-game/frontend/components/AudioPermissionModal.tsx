// GlobalAudioPrompt.tsx (Example Component)
"use client"
import React, { FC } from 'react';
import { useAudio } from '@/hooks/useAudio'; 

export const GlobalAudioPrompt: FC = () => {
  const { audioEnabled, setAudioEnabled } = useAudio();

  // Function called by the single user click
  const handleEnableAudio = () => {
    // This state change is the core of the fix!
    setAudioEnabled(true);
    
    // OPTIONAL: Immediately play a tiny, silent audio file
    // to "register" the gesture with the browser API.
    try {
        const dummyAudio = new Audio();
        // A minimal data URI for a silent sound wave
        dummyAudio.src = 'data:audio/mpeg;base64,TVRhdgIAAAAAAAGVAAAAAAAAAAACAwAAAwAAAAABAAAA'; 
        dummyAudio.play().catch(e => console.log('Dummy audio play failed:', e));
    } catch (e) {
        // ...
    }
  };

  if (audioEnabled) {
    return null; // Audio is enabled, hide the prompt
  }

  return (
    <div className="fixed inset-0 bg-black/80 z-[9999] flex flex-col items-center justify-center p-4">
      <h2 className="text-white text-2xl mb-4">Welcome to the Game!</h2>
      <p className="text-gray-300 mb-8 text-center">Click below to enter the site and enable game sound.</p>
      
      <button 
        onClick={handleEnableAudio}
        className="px-8 py-4 bg-[#A757E7] text-white text-lg font-bold rounded-lg shadow-lg hover:bg-purple-600 transition-colors"
      >
        Click to Start (Enable Sound)
      </button>
      
      <p className="text-gray-500 mt-4 text-sm">You only have to do this once per visit.</p>
    </div>
  );
};
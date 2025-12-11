// components/AudioPermissionModal.tsx
"use client";

import { useEffect, useState } from 'react';
import { useAudio } from '@/contexts/AudioContext';
import { usePathname } from 'next/navigation';

export default function AudioPermissionModal() {
  const { isPermissionGranted, requestAudioPermission } = useAudio();
  const [showModal, setShowModal] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Show modal only if permission not granted
    if (!isPermissionGranted) {
      // Small delay for better UX
      const timer = setTimeout(() => setShowModal(true), 500);
      return () => clearTimeout(timer);
    }
  }, [isPermissionGranted, pathname]);

  const handleEnableAudio = async () => {
    await requestAudioPermission();
    
    // CRITICAL FOR SAFARI: Find all video/audio elements on page and try to play them
    // This must happen in the same click handler to work on Safari
    const videos = document.querySelectorAll('video');
    const audios = document.querySelectorAll('audio');
    
    videos.forEach(video => {
      if (video) {
        video.muted = false;
        video.play().catch(e => console.log('Video play error:', e));
      }
    });
    
    audios.forEach(audio => {
      if (audio) {
        audio.muted = false;
        audio.play().catch(e => console.log('Audio play error:', e));
      }
    });
    
    setShowModal(false);
  };

  const handleDismiss = () => {
    // User can dismiss but we'll show again on next page
    setShowModal(false);
  };

  if (!showModal || isPermissionGranted) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="max-w-md w-full mx-4 bg-gradient-to-br from-purple-900 to-indigo-900 rounded-2xl shadow-2xl border border-purple-500/30 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-center">
          <div className="inline-block p-4 bg-white/10 rounded-full mb-3">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white">
            Enable Audio Experience
          </h2>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <p className="text-white/90 text-center leading-relaxed">
            This website uses audio and video narration by Alex to guide you through an interactive experience.
          </p>

          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div>
                <h3 className="text-yellow-300 font-semibold text-sm mb-1">
                  Why we need this
                </h3>
                <p className="text-yellow-100/80 text-sm">
                  Safari and iOS require user permission before playing audio. 
                  Enable it once to enjoy uninterrupted audio throughout the site.
                </p>
              </div>
            </div>
          </div>

          <ul className="space-y-2 text-white/80 text-sm">
            <li className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Automatic video playback with sound</span>
            </li>
            <li className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Works across all pages</span>
            </li>
            <li className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>One-time permission</span>
            </li>
          </ul>
        </div>

        {/* Actions */}
        <div className="p-6 pt-0 space-y-3">
          <button
            onClick={handleEnableAudio}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg transition-all transform hover:scale-105 active:scale-95"
          >
            🔊 Enable Audio & Start
          </button>
          
          <button
            onClick={handleDismiss}
            className="w-full bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl font-medium text-sm transition-all"
          >
            Maybe Later
          </button>
        </div>

        <div className="bg-black/20 px-6 py-3 text-center">
          <p className="text-white/50 text-xs">
            You can change this setting anytime in your browser
          </p>
        </div>
      </div>
    </div>
  );
}
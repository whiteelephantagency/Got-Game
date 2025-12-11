// ============================================
// STEP 1: Enhanced AudioContext with playback trigger
// ============================================
// contexts/AudioContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { FC, useRef } from "react";

interface AudioContextType {
  audioEnabled: boolean;
  requestAudioPermission: () => Promise<void>;
  isPermissionGranted: boolean;
  triggerPlayback: () => void; // New function to trigger all media
}

const AudioPermissionContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: ReactNode }) {
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [isPermissionGranted, setIsPermissionGranted] = useState(false);

  useEffect(() => {
    const permissionGranted = localStorage.getItem('audioPermissionGranted');
    if (permissionGranted === 'true') {
      setIsPermissionGranted(true);
      setAudioEnabled(true);
    }
  }, []);

  const triggerPlayback = () => {
    // Find all media elements that want to autoplay
    const videos = document.querySelectorAll('video[data-autoplay="true"]');
    const audios = document.querySelectorAll('audio[data-autoplay="true"]');
    
    videos.forEach(video => {
      const videoElement = video as HTMLVideoElement;
      videoElement.muted = false;
      videoElement.play().catch(e => {
        console.log('Video play failed:', e);
        // Try muted as fallback
        videoElement.muted = true;
        videoElement.play().catch(err => console.log('Muted play also failed:', err));
      });
    });
    
    audios.forEach(audio => {
      const audioElement = audio as HTMLAudioElement;
      audioElement.muted = false;
      audioElement.play().catch(e => console.log('Audio play failed:', e));
    });
  };

  const requestAudioPermission = async () => {
    try {
      // Create AudioContext
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      const audioContext = new AudioContext();
      
      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }
      
      // Play silent buffer
      const buffer = audioContext.createBuffer(1, 1, 22050);
      const source = audioContext.createBufferSource();
      source.buffer = buffer;
      source.connect(audioContext.destination);
      source.start(0);
      
      // Play silent audio element
      const silentAudio = document.createElement('audio');
      silentAudio.src = 'data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//tQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAACAAABhADAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dX//////////////////////////////////////////////////////////////////////////////////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAAAAAAAAAAAAYTs90hvAAAAAAAAAAAAAAAAAAAA//MUZAAAAAGkAAAAAAAAA0gAAAAATEFN//MUZAMAAAGkAAAAAAAAA0gAAAAARTMu//MUZAYAAAGkAAAAAAAAA0gAAAAAOTku//MUZAkAAAGkAAAAAAAAA0gAAAAANVVV';
      const playPromise = silentAudio.play();
      if (playPromise !== undefined) {
        await playPromise;
        silentAudio.pause();
        silentAudio.remove();
      }
      
      localStorage.setItem('audioPermissionGranted', 'true');
      setAudioEnabled(true);
      setIsPermissionGranted(true);
      
      // CRITICAL: Trigger playback in same click handler
      setTimeout(() => triggerPlayback(), 50);
      
    } catch (error) {
      console.error('Failed to unlock audio:', error);
      localStorage.setItem('audioPermissionGranted', 'true');
      setAudioEnabled(true);
      setIsPermissionGranted(true);
      setTimeout(() => triggerPlayback(), 50);
    }
  };

  return (
    <AudioPermissionContext.Provider 
      value={{ 
        audioEnabled, 
        requestAudioPermission, 
        isPermissionGranted,
        triggerPlayback
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

// ============================================
// STEP 2: Updated AlexVideoPlayer
// ============================================
// components/AlexVideoPlayer.tsx


interface AlexVideoPlayerProps {
  src: string;
  onEnded: () => void;
  autoPlay?: boolean;
  delay?: number;
  className?: string;
  showAudioIndicator?: boolean;
}

const AlexVideoPlayer: FC<AlexVideoPlayerProps> = ({
  src,
  onEnded,
  autoPlay = true,
  delay = 0,
  className = "",
  showAudioIndicator = true,
}) => {
  const { audioEnabled } = useAudio();
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const playAttemptedRef = useRef(false);
  
  const isAudioFile = src.endsWith(".mp3") || src.endsWith(".wav") || src.endsWith(".ogg");

  // Attempt autoplay when component mounts or audio is enabled
  useEffect(() => {
    if (autoPlay && !playAttemptedRef.current) {
      const media = isAudioFile ? audioRef.current : videoRef.current;
      if (media && audioEnabled) {
        playAttemptedRef.current = true;
        
        setTimeout(() => {
          media.muted = false;
          media.play().catch(err => {
            console.log("Play attempt failed:", err);
            // Try muted fallback
            media.muted = true;
            media.play().catch(e => console.log("Muted play also failed:", e));
          });
        }, 100);
      }
    }
  }, [autoPlay, audioEnabled, isAudioFile]);

  useEffect(() => {
    if (delay > 0) {
      const timeout = setTimeout(onEnded, delay);
      return () => clearTimeout(timeout);
    }
  }, [delay, onEnded]);

  const handleCanPlay = () => setLoading(false);
  const handleWaiting = () => setLoading(true);
  const handlePlaying = () => setLoading(false);
  
  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement | HTMLAudioElement>) => {
    const media = e.currentTarget;
    if (media.duration) {
      setProgress((media.currentTime / media.duration) * 100);
    }
  };

  return (
    <div className={`relative w-full aspect-video z-10 rounded-xl overflow-hidden shadow-2xl ${className}`}>
      {isAudioFile ? (
        <div className="w-full h-full bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 grid place-items-center pointer-events-none">
            <div className="w-28 h-28 rounded-full bg-black/40 ring-2 ring-[#A757E7] ring-offset-4 ring-offset-black animate-pulse" />
          </div>

          {showAudioIndicator && (
            <div className="relative z-10 flex flex-col items-center">
              <div className="mb-4 text-white/90 text-sm px-3 py-1 bg-black/40 rounded-md">
                Alex is speaking…
              </div>
              <div className="flex items-end justify-center gap-2 h-16">
                {[0, 1, 2, 3, 4].map(i => (
                  <span key={i} className="eqbar" style={{ animationDelay: `${i * 0.05}s` }} />
                ))}
              </div>
            </div>
          )}

          <audio
            ref={audioRef}
            src={src}
            data-autoplay={autoPlay ? "true" : "false"}
            muted={!audioEnabled}
            preload="auto"
            onEnded={() => delay === 0 && onEnded()}
            onCanPlay={handleCanPlay}
            onPlaying={handlePlaying}
            onWaiting={handleWaiting}
            onTimeUpdate={handleTimeUpdate}
            className="hidden"
          />

          <style jsx>{`
            .eqbar {
              display: inline-block;
              width: 8px;
              height: 8px;
              background: #fff;
              border-radius: 2px;
              animation: eqBounce 500ms ease-in-out infinite;
            }
            @keyframes eqBounce {
              0%, 100% { transform: scaleY(0.4); }
              50% { transform: scaleY(2.1); }
            }
          `}</style>
        </div>
      ) : (
        <>
          <video
            ref={videoRef}
            src={src}
            data-autoplay={autoPlay ? "true" : "false"}
            muted={!audioEnabled}
            playsInline
            preload="auto"
            controls={false}
            onEnded={() => delay === 0 && onEnded()}
            onCanPlay={handleCanPlay}
            onPlaying={handlePlaying}
            onWaiting={handleWaiting}
            onTimeUpdate={handleTimeUpdate}
            className="w-full h-full object-cover bg-black"
          />
          
          {!audioEnabled && (
            <div className="absolute top-4 right-4 bg-red-500/90 text-white px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
              </svg>
              Muted
            </div>
          )}
          
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/30 pointer-events-none">
            <div 
              className="h-full bg-[#A757E7] transition-all duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>
        </>
      )}

      {loading && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <div className="text-white text-lg">Loading…</div>
        </div>
      )}
    </div>
  );
};

export default AlexVideoPlayer;
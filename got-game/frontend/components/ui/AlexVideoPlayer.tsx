// "use client";

// import { FC, useEffect, useState } from "react";

// interface AlexVideoPlayerProps {
//   src: string;
//   onEnded: () => void;
//   autoPlay?: boolean;
//   delay?: number;            // optional delay before triggering onEnded
//   className?: string;        // Allow custom styling from parent
//   showControls?: boolean;    // Option to show video controls
//   hideControls?: boolean;    // Option to hide controls completely
//   showAudioIndicator?: boolean; // Show/hide "Alex speaking" UI
// }

// const AlexVideoPlayer: FC<AlexVideoPlayerProps> = ({
//   src,
//   onEnded,
//   autoPlay = true,
//   delay = 0,
//   className = "",
//   showControls = false,
//   hideControls = false,
//   showAudioIndicator = true,
// }) => {
//   const [loading, setLoading] = useState(true);
//   const [progress, setProgress] = useState(0);
//   const isAudioFile =
//     src.endsWith(".mp3") || src.endsWith(".wav") || src.endsWith(".ogg");

//   // optional timed endings (you had this already)
//   useEffect(() => {
//     if (delay > 0) {
//       const timeout = setTimeout(onEnded, delay);
//       return () => clearTimeout(timeout);
//     }
//   }, [delay, onEnded]);

//   // Shared loading handlers
//   const handleCanPlay = () => setLoading(false);
//   const handleWaiting = () => setLoading(true);
//   const handlePlaying = () => setLoading(false);
  
//   // Track video/audio progress
//   const handleTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement | HTMLAudioElement>) => {
//     const media = e.currentTarget;
//     if (media.duration) {
//       setProgress((media.currentTime / media.duration) * 100);
//     }
//   };

//   return (
//     <div
//       className={`relative w-full aspect-video z-10 rounded-xl overflow-hidden shadow-2xl ${className}`}
//       role="region"
//       aria-label={isAudioFile ? "Alex audio player" : "Alex video player"}
//     >
//       {isAudioFile ? (
//         // ===== AUDIO-ONLY MODE (animated) =====
//         <div className="w-full h-full bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 flex flex-col items-center justify-center relative overflow-hidden">
//           {/* Avatar ring */}
//           <div className="absolute inset-0 grid place-items-center pointer-events-none">
//             <div className="w-28 h-28 rounded-full bg-black/40 ring-2 ring-[#A757E7] ring-offset-4 ring-offset-black animate-pulse" />
//           </div>

//           {/* Equalizer */}
//           {showAudioIndicator && (
//             <div className="relative z-10 flex flex-col items-center">
//               <div className="mb-4 text-white/90 text-sm px-3 py-1 bg-black/40 rounded-md"
//                    aria-live="polite">
//                 Alex is speaking…
//               </div>
//               <div className="flex items-end justify-center gap-2 h-16" aria-hidden="true">
//                 <span className="eqbar" />
//                 <span className="eqbar delay-1" />
//                 <span className="eqbar delay-2" />
//                 <span className="eqbar delay-3" />
//                 <span className="eqbar delay-4" />
//               </div>
//             </div>
//           )}

//           {/* Hidden/native audio (can be shown with controls if you want) */}
//           <audio
//             src={src}
//             autoPlay={autoPlay}
//             onEnded={() => delay === 0 && onEnded()}
//             onCanPlay={handleCanPlay}
//             onPlaying={handlePlaying}
//             onWaiting={handleWaiting}
//             onTimeUpdate={handleTimeUpdate}
//             controls={!hideControls && showControls}
//             className={`absolute bottom-4 left-4 right-4 ${hideControls ? "hidden" : "opacity-60"}`}
//           />

//           {/* Styles for EQ */}
//           <style jsx>{`
//             .eqbar {
//               display: inline-block;
//               width: 8px;
//               height: 8px;
//               background: #fff;
//               border-radius: 2px;
//               animation: eqBounce 500ms ease-in-out infinite;
//             }
//             .delay-1 { animation-delay: 0.05s; }
//             .delay-2 { animation-delay: 0.1s; }
//             .delay-3 { animation-delay: 0.15s; }
//             .delay-4 { animation-delay: 0.2s; }
//             @keyframes eqBounce {
//               0%, 100% { transform: scaleY(0.4); }
//               50% { transform: scaleY(2.1); }
//             }
//           `}</style>
//         </div>
//       ) : (
//         // ===== VIDEO MODE =====
//         <>
//           <video
//             src={src}
//             autoPlay={autoPlay}
//             playsInline
//             controls={false}
//             onEnded={() => delay === 0 && onEnded()}
//             onCanPlay={handleCanPlay}
//             onPlaying={handlePlaying}
//             onWaiting={handleWaiting}
//             onTimeUpdate={handleTimeUpdate}
//             className="w-full h-full object-cover bg-black"
//             poster="/images/alex-poster.jpg"
//           />
          
//           {/* Non-interactive progress bar */}
//           <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/30 pointer-events-none">
//             <div 
//               className="h-full bg-[#A757E7] transition-all duration-200"
//               style={{ width: `${progress}%` }}
//               aria-label={`Video progress: ${Math.round(progress)}%`}
//             />
//           </div>
//         </>
//       )}

//       {/* Loading overlay (now wired up) */}
//       <div
//         className={`absolute inset-0 bg-black/50 flex items-center justify-center transition-opacity ${
//           loading ? "opacity-100" : "opacity-0 pointer-events-none"
//         }`}
//         aria-hidden={!loading}
//       >
//         <div className="text-white text-lg">Loading…</div>
//       </div>
//     </div>
//   );
// };

// export default AlexVideoPlayer;








// components/AlexVideoPlayer.tsx
"use client";

// AlexVideoPlayer.tsx
import React, { FC, useRef, useState, useEffect } from "react";
import { useAudio } from "@/hooks/useAudio";  // Import your new hook

// Mock types (assuming you have these defined elsewhere)
type AlexVideoPlayerProps = {
    src: string;
    onEnded: () => void;
    autoPlay?: boolean;
    delay?: number;
    className?: string;
    showAudioIndicator?: boolean;
};

const AlexVideoPlayer: FC<AlexVideoPlayerProps> = ({
  src,
  onEnded,
  autoPlay = true,
  delay = 0,
  className = "",
  showAudioIndicator = true,
}) => {
  // useAudio now gives us the global state
  const { audioEnabled } = useAudio(); 
  
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const playAttemptedRef = useRef(false);

  const isAudioFile = src.endsWith(".mp3") || src.endsWith(".wav") || src.endsWith(".ogg");

  // Key Logic for Autoplay and Unmuting
  useEffect(() => {
    // 1. Check if autoplay is desired AND we haven't tried yet
    if (autoPlay && !playAttemptedRef.current) {
      const media = isAudioFile ? audioRef.current : videoRef.current;
      
      // 2. We only proceed if the media element exists
      if (media) { 
        playAttemptedRef.current = true; // Mark as attempted
        
        // Use a small delay to ensure rendering is complete
        setTimeout(() => {
          // *** THE CORE FIX ***
          // We set the muted property based on the GLOBAL state.
          // If the user has already clicked the global button, audioEnabled is true, 
          // and we attempt to play UNMUTED. This will succeed across all routes.
          media.muted = !audioEnabled; 
          
          media.play().catch(err => {
            console.log(`Play attempt failed (Muted: ${!audioEnabled}):`, err);
            
            // If the initial unmuted play fails, we fall back to muted, 
            // as a final safeguard (e.g., if the user never clicked the global button)
            if (audioEnabled) {
                // If it fails even after audioEnabled is true, it's a critical issue, 
                // but we still try muted fallback.
                media.muted = true; 
                media.play().catch(e => console.log("Muted play also failed:", e));
            }
            
            // If audioEnabled is false, the muted play will naturally happen here.
            
          });
        }, 100);
      }
    }
  }, [autoPlay, audioEnabled, isAudioFile]); // audioEnabled is the crucial dependency!

  // --- (Rest of your original code remains the same) ---
  
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
        // ... (Audio Player UI) ...
        <div className="w-full h-full bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 flex flex-col items-center justify-center relative overflow-hidden">
             {/* ... (UI elements) ... */}
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
              muted={!audioEnabled} // Control muted state with global state
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
            muted={!audioEnabled} // Control muted state with global state
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

          {/* This Muted Indicator is now only a visual reminder */}
          {!audioEnabled && (
            <div className="absolute top-4 right-4 bg-red-500/90 text-white px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
              </svg>
              Muted (Enable Sound to Hear)
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
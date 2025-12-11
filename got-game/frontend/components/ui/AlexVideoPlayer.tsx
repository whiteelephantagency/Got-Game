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

import { FC, useEffect, useState } from "react";
import { useAudio } from "@/contexts/AudioContext"; 

interface AlexVideoPlayerProps {
  src: string;
  onEnded: () => void;
  autoPlay?: boolean;
  delay?: number;
  className?: string;
  showControls?: boolean;
  hideControls?: boolean;
  showAudioIndicator?: boolean;
}

const AlexVideoPlayer: FC<AlexVideoPlayerProps> = ({
  src,
  onEnded,
  autoPlay = true,
  delay = 0,
  className = "",
  showControls = false,
  hideControls = false,
  showAudioIndicator = true,
}) => {
  const { audioEnabled } = useAudio(); // Get audio permission status
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [videoRef, setVideoRef] = useState<HTMLVideoElement | null>(null);
  const [audioRef, setAudioRef] = useState<HTMLAudioElement | null>(null);
  
  const isAudioFile =
    src.endsWith(".mp3") || src.endsWith(".wav") || src.endsWith(".ogg");

  // Auto-play when audio is enabled
  useEffect(() => {
    if (audioEnabled && autoPlay) {
      const media = isAudioFile ? audioRef : videoRef;
      if (media) {
        media.play().catch(err => {
          console.error("Autoplay failed:", err);
        });
      }
    }
  }, [audioEnabled, autoPlay, src, isAudioFile, videoRef, audioRef]);

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
    <div
      className={`relative w-full aspect-video z-10 rounded-xl overflow-hidden shadow-2xl ${className}`}
      role="region"
      aria-label={isAudioFile ? "Alex audio player" : "Alex video player"}
    >
      {isAudioFile ? (
        // ===== AUDIO-ONLY MODE =====
        <div className="w-full h-full bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 grid place-items-center pointer-events-none">
            <div className="w-28 h-28 rounded-full bg-black/40 ring-2 ring-[#A757E7] ring-offset-4 ring-offset-black animate-pulse" />
          </div>

          {showAudioIndicator && (
            <div className="relative z-10 flex flex-col items-center">
              <div className="mb-4 text-white/90 text-sm px-3 py-1 bg-black/40 rounded-md"
                   aria-live="polite">
                Alex is speaking…
              </div>
              <div className="flex items-end justify-center gap-2 h-16" aria-hidden="true">
                <span className="eqbar" />
                <span className="eqbar delay-1" />
                <span className="eqbar delay-2" />
                <span className="eqbar delay-3" />
                <span className="eqbar delay-4" />
              </div>
            </div>
          )}

          <audio
            ref={setAudioRef}
            src={src}
            muted={!audioEnabled} // Mute if audio not enabled
            onEnded={() => delay === 0 && onEnded()}
            onCanPlay={handleCanPlay}
            onPlaying={handlePlaying}
            onWaiting={handleWaiting}
            onTimeUpdate={handleTimeUpdate}
            controls={!hideControls && showControls}
            className={`absolute bottom-4 left-4 right-4 ${hideControls ? "hidden" : "opacity-60"}`}
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
            .delay-1 { animation-delay: 0.05s; }
            .delay-2 { animation-delay: 0.1s; }
            .delay-3 { animation-delay: 0.15s; }
            .delay-4 { animation-delay: 0.2s; }
            @keyframes eqBounce {
              0%, 100% { transform: scaleY(0.4); }
              50% { transform: scaleY(2.1); }
            }
          `}</style>
        </div>
      ) : (
        // ===== VIDEO MODE =====
        <>
          <video
            ref={setVideoRef}
            src={src}
            muted={!audioEnabled} // Mute if audio not enabled
            playsInline
            controls={false}
            onEnded={() => delay === 0 && onEnded()}
            onCanPlay={handleCanPlay}
            onPlaying={handlePlaying}
            onWaiting={handleWaiting}
            onTimeUpdate={handleTimeUpdate}
            className="w-full h-full object-cover bg-black"
            poster="/images/alex-poster.jpg"
          />
          
          {/* Audio status indicator */}
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
              aria-label={`Video progress: ${Math.round(progress)}%`}
            />
          </div>
        </>
      )}

      {loading && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center transition-opacity"
             aria-hidden={!loading}>
          <div className="text-white text-lg">Loading…</div>
        </div>
      )}
    </div>
  );
};

export default AlexVideoPlayer;
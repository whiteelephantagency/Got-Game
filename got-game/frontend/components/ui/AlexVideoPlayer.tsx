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



"use client";

import { FC, useEffect, useState } from "react";

interface AlexVideoPlayerProps {
  src: string;
  onEnded: () => void;
  autoPlay?: boolean;
  delay?: number;            // optional delay before triggering onEnded
  className?: string;        // Allow custom styling from parent
  showControls?: boolean;    // Option to show video controls
  hideControls?: boolean;    // Option to hide controls completely
  showAudioIndicator?: boolean; // Show/hide "Alex speaking" UI
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
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [showInteractionPrompt, setShowInteractionPrompt] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [mediaRef, setMediaRef] = useState<HTMLVideoElement | HTMLAudioElement | null>(null);
  const isAudioFile =
    src.endsWith(".mp3") || src.endsWith(".wav") || src.endsWith(".ogg");

  // optional timed endings
  useEffect(() => {
    if (delay > 0) {
      const timeout = setTimeout(onEnded, delay);
      return () => clearTimeout(timeout);
    }
  }, [delay, onEnded]);

  // Handle autoplay with Safari compatibility
  useEffect(() => {
    if (!mediaRef || !autoPlay) return;

    const tryAutoPlay = async () => {
      try {
        // Unmute first (Safari requirement)
        mediaRef.muted = false;
        mediaRef.volume = 1.0;

        await mediaRef.play();
        setHasInteracted(true);
      } catch (error) {
        // Autoplay blocked - show interaction prompt
        console.log("Autoplay blocked, requesting user interaction");
        setShowInteractionPrompt(true);
      }
    };

    // Small delay to ensure media is ready
    const timeout = setTimeout(tryAutoPlay, 100);
    return () => clearTimeout(timeout);
  }, [mediaRef, autoPlay]);

  // Handle user interaction
  const handleUserInteraction = async () => {
    if (!mediaRef) return;

    try {
      mediaRef.muted = false;
      mediaRef.volume = 1.0;
      await mediaRef.play();
      setHasInteracted(true);
      setShowInteractionPrompt(false);
    } catch (error) {
      console.error("Failed to play after user interaction:", error);
    }
  };

  // Shared loading handlers
  const handleCanPlay = () => setLoading(false);
  const handleWaiting = () => setLoading(true);
  const handlePlaying = () => setLoading(false);

  // Track video/audio progress
  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement | HTMLAudioElement>) => {
    const media = e.currentTarget;
    if (media.duration) {
      setProgress((media.currentTime / media.duration) * 100);
    }
  };

  return (
    <>
      <div
        className={`relative w-full aspect-video z-10 rounded-xl overflow-hidden shadow-2xl ${className}`}
        role="region"
        aria-label={isAudioFile ? "Alex audio player" : "Alex video player"}
      >
        {isAudioFile ? (
          // ===== AUDIO-ONLY MODE (animated) =====
          <div className="w-full h-full bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 flex flex-col items-center justify-center relative overflow-hidden">
            {/* Avatar ring */}
            <div className="absolute inset-0 grid place-items-center pointer-events-none">
              <div className="w-28 h-28 rounded-full bg-black/40 ring-2 ring-[#A757E7] ring-offset-4 ring-offset-black animate-pulse" />
            </div>

            {/* Equalizer */}
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

            {/* Hidden/native audio */}
            <audio
              ref={(el) => setMediaRef(el)}
              src={src}
              autoPlay={false}
              onEnded={() => delay === 0 && onEnded()}
              onCanPlay={handleCanPlay}
              onPlaying={handlePlaying}
              onWaiting={handleWaiting}
              onTimeUpdate={handleTimeUpdate}
              controls={!hideControls && showControls}
              playsInline
              preload="auto"
              className={`absolute bottom-4 left-4 right-4 ${hideControls ? "hidden" : "opacity-60"}`}
            />

            {/* Styles for EQ */}
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
              ref={(el) => setMediaRef(el)}
              src={src}
              autoPlay={false}
              playsInline
              controls={false}
              preload="auto"
              onEnded={() => delay === 0 && onEnded()}
              onCanPlay={handleCanPlay}
              onPlaying={handlePlaying}
              onWaiting={handleWaiting}
              onTimeUpdate={handleTimeUpdate}
              className="w-full h-full object-cover bg-black"
              poster="/images/alex-poster.jpg"
            />

            {/* Non-interactive progress bar */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/30 pointer-events-none">
              <div
                className="h-full bg-[#A757E7] transition-all duration-200"
                style={{ width: `${progress}%` }}
                aria-label={`Video progress: ${Math.round(progress)}%`}
              />
            </div>
          </>
        )}

        {/* Loading overlay */}
        <div
          className={`absolute inset-0 bg-black/50 flex items-center justify-center transition-opacity ${loading ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          aria-hidden={!loading}
        >
          <div className="text-white text-lg">Loading…</div>
        </div>

      </div>

      {/* User Interaction Prompt for Safari - Outside video container */}
      {showInteractionPrompt && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-[9999] animate-fadeIn">
          <div className="bg-gradient-to-br from-[#3a0e66] to-[#1a0f3d] p-8 rounded-3xl shadow-2xl max-w-sm mx-4 text-center border border-purple-400/30 animate-scaleIn">

            <div className="mb-6">
              <div className="w-20 h-20 mx-auto mb-5 rounded-2xl bg-[#A757E7] flex items-center justify-center shadow-xl shadow-purple-900/40 animate-float">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>

              <h3 className="text-2xl font-extrabold text-white mb-3 tracking-wide drop-shadow-lg">
                Let’s keep playing!
              </h3>

              <p className="text-white/80 text-sm">
                Tap below to continue your experience — let’s jump right back in!
              </p>
            </div>

            <button
              onClick={handleUserInteraction}
              className="w-full bg-[#A757E7] hover:bg-[#9b46e3] active:bg-[#8b3fd2] text-white font-semibold py-3 px-6 rounded-xl transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-purple-900/40"
            >
              Let’s Go!
            </button>
          </div>
        </div>

      )}
    </>
  );
};

export default AlexVideoPlayer;
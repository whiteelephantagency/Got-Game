<<<<<<< HEAD
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
  showAudioIndicator?: boolean; // Show/hide “Alex speaking” UI
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
  const isAudioFile =
    src.endsWith(".mp3") || src.endsWith(".wav") || src.endsWith(".ogg");

  // optional timed endings (you had this already)
  useEffect(() => {
    if (delay > 0) {
      const timeout = setTimeout(onEnded, delay);
      return () => clearTimeout(timeout);
    }
  }, [delay, onEnded]);

  // Shared loading handlers
  const handleCanPlay = () => setLoading(false);
  const handleWaiting = () => setLoading(true);
  const handlePlaying = () => setLoading(false);

  return (
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

          {/* Hidden/native audio (can be shown with controls if you want) */}
          <audio
            src={src}
            autoPlay={autoPlay}
            onEnded={() => delay === 0 && onEnded()}
            onCanPlay={handleCanPlay}
            onPlaying={handlePlaying}
            onWaiting={handleWaiting}
            controls={!hideControls && showControls}
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
        <video
          src={src}
          autoPlay={autoPlay}
          playsInline
          controls={!hideControls && showControls}
          onEnded={() => delay === 0 && onEnded()}
          onCanPlay={handleCanPlay}
          onPlaying={handlePlaying}
          onWaiting={handleWaiting}
          className="w-full h-full object-cover bg-black"
          poster="/images/alex-poster.jpg"
        />
      )}

      {/* Loading overlay (now wired up) */}
      <div
        className={`absolute inset-0 bg-black/50 flex items-center justify-center transition-opacity ${
          loading ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden={!loading}
      >
        <div className="text-white text-lg">Loading…</div>
      </div>
    </div>
  );
};

export default AlexVideoPlayer;
=======
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
  showAudioIndicator?: boolean; // Show/hide “Alex speaking” UI
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
  const isAudioFile =
    src.endsWith(".mp3") || src.endsWith(".wav") || src.endsWith(".ogg");

  // optional timed endings (you had this already)
  useEffect(() => {
    if (delay > 0) {
      const timeout = setTimeout(onEnded, delay);
      return () => clearTimeout(timeout);
    }
  }, [delay, onEnded]);

  // Shared loading handlers
  const handleCanPlay = () => setLoading(false);
  const handleWaiting = () => setLoading(true);
  const handlePlaying = () => setLoading(false);

  return (
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

          {/* Hidden/native audio (can be shown with controls if you want) */}
          <audio
            src={src}
            autoPlay={autoPlay}
            onEnded={() => delay === 0 && onEnded()}
            onCanPlay={handleCanPlay}
            onPlaying={handlePlaying}
            onWaiting={handleWaiting}
            controls={!hideControls && showControls}
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
        <video
          src={src}
          autoPlay={autoPlay}
          playsInline
          controls={!hideControls && showControls}
          onEnded={() => delay === 0 && onEnded()}
          onCanPlay={handleCanPlay}
          onPlaying={handlePlaying}
          onWaiting={handleWaiting}
          className="w-full h-full object-cover bg-black"
          poster="/images/alex-poster.jpg"
        />
      )}

      {/* Loading overlay (now wired up) */}
      <div
        className={`absolute inset-0 bg-black/50 flex items-center justify-center transition-opacity ${
          loading ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden={!loading}
      >
        <div className="text-white text-lg">Loading…</div>
      </div>
    </div>
  );
};

export default AlexVideoPlayer;
>>>>>>> b1cd0ffcb9f634563e64bb1812274187a5cfe15f

"use client"

import { FC, useEffect } from "react"

interface AlexVideoPlayerProps {
  src: string
  onEnded: () => void
  autoPlay?: boolean
  delay?: number // optional delay before triggering onEnded
  className?: string // Allow custom styling from parent
  showControls?: boolean // Option to show video controls
}

const AlexVideoPlayer: FC<AlexVideoPlayerProps> = ({
  src,
  onEnded,
  autoPlay = true,
  delay = 0,
  className = "",
  showControls = false,
}) => {
  useEffect(() => {
    if (delay > 0) {
      const timeout = setTimeout(onEnded, delay)
      return () => clearTimeout(timeout)
    }
  }, [delay, onEnded])

  const isAudioFile = src.endsWith('.mp3') || src.endsWith('.wav') || src.endsWith('.ogg');

  return (
    <div className={`relative w-full aspect-video z-10 rounded-xl overflow-hidden shadow-2xl ${className}`}>
      {isAudioFile ? (
        // Audio file - show visual placeholder with waveform animation
        <div className="w-full h-full bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 flex flex-col items-center justify-center relative overflow-hidden">
          {/* Animated background pattern */}
          <div className="absolute inset-0 opacity-20">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 bg-gradient-to-t from-purple-400 to-pink-400 rounded-full animate-pulse"
                style={{
                  left: `${5 + (i * 4.5)}%`,
                  height: `${20 + Math.random() * 60}%`,
                  bottom: '20%',
                  animationDelay: `${i * 0.1}s`,
                  animationDuration: `${1 + Math.random()}s`
                }}
              />
            ))}
          </div>
          
          {/* Audio icon and text */}
          <div className="relative z-10 text-center">
            <div className="text-6xl mb-4 animate-pulse">🎤</div>
            <div className="text-white text-xl font-bold mb-2">Alex Speaking</div>
            <div className="text-purple-300 text-sm">Audio Only</div>
          </div>
          
          {/* Actual audio element (hidden) */}
          <audio
            src={src}
            autoPlay={autoPlay}
            onEnded={() => {
              if (delay === 0) onEnded()
            }}
            controls={showControls}
            className="absolute bottom-4 left-4 right-4 opacity-50"
          />
        </div>
      ) : (
        // Video file - regular video display
        <video
          src={src}
          autoPlay={autoPlay}
          playsInline
          controls={showControls}
          onEnded={() => {
            if (delay === 0) onEnded()
          }}
          className="w-full h-full object-cover bg-black"
          poster="/images/alex-poster.jpg" // Optional poster image
        />
      )}
      
      {/* Loading overlay */}
      <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 transition-opacity" id="loading-overlay">
        <div className="text-white text-lg">Loading...</div>
      </div>
    </div>
  )
}

export default AlexVideoPlayer
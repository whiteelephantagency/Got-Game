"use client"

import { FC, useEffect } from "react"

interface AlexVideoPlayerProps {
  src: string
  onEnded: () => void
  autoPlay?: boolean
  delay?: number // optional delay before triggering onEnded
}

const AlexVideoPlayer: FC<AlexVideoPlayerProps> = ({
  src,
  onEnded,
  autoPlay = true,
  delay = 0,
}) => {
  useEffect(() => {
    if (delay > 0) {
      const timeout = setTimeout(onEnded, delay)
      return () => clearTimeout(timeout)
    }
  }, [delay, onEnded])

  return (
    <div className="relative w-full max-w-4xl aspect-video z-10 rounded-xl overflow-hidden shadow-2xl">
      <video
        src={src}
        autoPlay={autoPlay}
        playsInline
        onEnded={() => {
          if (delay === 0) onEnded()
        }}
        className="w-full h-full object-cover"
      />
    </div>
  )
}

export default AlexVideoPlayer

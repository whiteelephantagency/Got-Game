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
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      <video
        src={src}
        autoPlay={autoPlay}
        playsInline
        onEnded={() => {
          if (delay === 0) onEnded()
        }}
        className="relative z-10 w-[90vw] max-w-[720px] rounded-2xl shadow-2xl"
      />
    </div>
  )
}
 
export default AlexVideoPlayer
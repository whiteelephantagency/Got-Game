"use client"
import { useEffect } from "react"

export default function StatMapTransition({ onEnd }: { onEnd: () => void }) {
  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
      <video
        src="/video/stat-map-transition.mp4" // Put this in public/videos/
        autoPlay
        onEnded={onEnd}
        className="w-full max-w-3xl"
      />
    </div>
  )
}

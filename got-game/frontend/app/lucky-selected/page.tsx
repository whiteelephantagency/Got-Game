// /app/lucky-selected/page.tsx
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function LuckySelectedVideoPage() {
  const router = useRouter()
  const [ended, setEnded] = useState(false)

  useEffect(() => {
    if (ended) {
      router.push("/game/2") // or dynamically decide the next round
    }
  }, [ended, router])

  return (
    <main className="relative min-h-screen flex items-center justify-center bg-black overflow-hidden">
      {/* Background */}
      <Image
        src="/images/lobby-background.jpg"
        alt="Purple Grid Background"
        fill
        className="object-cover opacity-90 z-0"
        priority
      />

      {/* You've Been Selected Video */}
      <div className="relative z-10 w-full max-w-3xl rounded-xl overflow-hidden shadow-xl">
        <video
          src="/video/youve-been-selected.mp4"
          autoPlay
          onEnded={() => setEnded(true)}
          className="w-full h-auto"
        />
      </div>
    </main>
  )
}

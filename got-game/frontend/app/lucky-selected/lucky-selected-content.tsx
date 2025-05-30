"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import AlexVideoPlayer from "@/components/ui/AlexVideoPlayer"
import Image from "next/image"

export function LuckySelectedContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const roundParam = searchParams.get("round")
  const nextRound = roundParam ? Number(roundParam) + 1 : 2

  const [stage, setStage] = useState<"selected" | "hard">("selected")

  const handleVideoEnd = () => {
    if (stage === "selected") {
      setStage("hard")
    } else {
      router.push(`/game/${nextRound}`)
    }
  }

  const videoMap = {
    selected: "/video/youve-been-selected.mp4",
    hard: "/video/alex-warning.mp4",
  }

  return (
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <Image
        src="/images/lobby-background.jpg"
        alt="Background"
        fill
        className="object-cover z-0"
      />

      {/* Video Player */}
      <div className="relative z-10 w-[90vw] max-w-[720px]">
        <AlexVideoPlayer
          src={videoMap[stage]}
          onEnded={handleVideoEnd}
          autoPlay
        />
      </div>
    </main>
  )
}

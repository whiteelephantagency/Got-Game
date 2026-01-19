"use client"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Image from "next/image" // for background image if needed

export default function ReactionVideoPage() {
  const params = useParams()
  const router = useRouter()
  const round = Number(params?.round)
  const nextRound = round + 1

  const [ended, setEnded] = useState(false)

  useEffect(() => {
    if (ended) {
      router.push(`/sorting`)
    }
  }, [ended, router, nextRound])

  return (
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black text-white">
      {/* 🔁 Background image */}
      <Image
        src="/images/lobby-background.jpg" // or your purple grid background image
        alt="Background"
        fill
        className="object-cover z-0 opacity-90"
        priority
      />

      {/* 🎥 Video on top */}
      <div className="relative z-10 w-full max-w-3xl rounded-xl overflow-hidden shadow-2xl">
        <video
          src="/video/easy-round.mp4"
          autoPlay
          onEnded={() => setEnded(true)}
          className="w-full h-auto"
        />
      </div>
    </main>
  )
}

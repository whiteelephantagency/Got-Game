"use client"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function ReactionVideoPage() {
  const params = useParams()
  const router = useRouter()
  const round = Number(params?.round)
  const nextRound = round + 1

  const [ended, setEnded] = useState(false)

  useEffect(() => {
    if (ended) {
      router.push(`/game/${nextRound}`)
    }
  }, [ended, router, nextRound])

  return (
    <main className="min-h-screen flex items-center justify-center bg-black">
      <video
        src="/video/easy-round.mp4" // or `/video/reaction-${round}.mp4`
        autoPlay
        onEnded={() => setEnded(true)}
        className="w-full max-w-3xl rounded-xl shadow-lg"
      />
    </main>
  )
}

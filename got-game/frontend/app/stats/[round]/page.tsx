// app/stats/[round]/page.tsx
"use client"
import { useParams, useRouter } from "next/navigation"
import { useEffect } from "react"

export default function StatMapPage() {
  const params = useParams()
  const router = useRouter()
  const round = params?.round

  // Optional: auto-redirect to next screen after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push(`/game/${Number(round) + 1}`) // Or "/lucky-draw" if it's the last round
    }, 5000)

    return () => clearTimeout(timer)
  }, [router, round])

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-black text-white px-4">
      <h1 className="text-4xl font-bold mb-4">📊 Stats for Round {round}</h1>
      <p className="text-xl mb-6 text-center">Here’s how players answered:</p>

      <div className="bg-purple-700 rounded-lg p-6 w-full max-w-md space-y-3 shadow-lg">
        <p>🅰️ Answer A — 45%</p>
        <p>🅱️ Answer B — 30%</p>
        <p>🇨 Answer C — 15%</p>
        <p>🇩 Answer D — 10%</p>
      </div>

      <p className="mt-6 text-sm opacity-70">Loading next round...</p>
    </main>
  )
}

// /app/stats/[round]/page.tsx
"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect } from "react"

export default function StatMapPage() {
  const params = useParams()
  const router = useRouter()
  const round = Number(params?.round || 1)

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push(`/reaction/${round}`)
    }, 4000)

    return () => clearTimeout(timer)
  }, [router, round])

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-red-900 to-purple-800 text-white relative px-4">
      <h1 className="text-4xl md:text-6xl font-bold mb-8">📊 Stats for Round {round}</h1>

      <div className="grid grid-cols-12 gap-2 max-w-5xl">
        {Array.from({ length: 72 }).map((_, i) => (
          <div
            key={i}
            className="w-6 h-6 md:w-10 md:h-10 bg-lime-400 rounded-md shadow-lg"
            style={{
              opacity: Math.random() > 0.3 ? 1 : 0.2,
              animation: `fadeIn 0.3s ease-in-out ${i * 10}ms forwards`,
            }}
          />
        ))}
      </div>

      <div className="absolute bottom-6 w-full flex justify-between px-10 text-sm text-white/80 font-semibold">
        <div>
          <button className="mr-4">▼ RULES</button>
          <button>▼ FAQ</button>
        </div>
        <div>
          BG MUSIC <button className="ml-2">ON / OFF</button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.5); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </main>
  )
}

// components/ui/StatMap.tsx
"use client"

export default function StatMap({ playerCount, prize, timeLeft }: { playerCount: number, prize: number, timeLeft: number }) {
  return (
    <div className="absolute top-6 left-6 z-20 text-white text-lg font-bold">
      <div className="mb-4">
        PLAYERS {playerCount.toLocaleString()}
      </div>
      <div className="mb-4">
        PRIZE {prize.toLocaleString()}$
      </div>
      <div className="text-right">
        TIMER 00:{timeLeft.toString().padStart(2, "0")}
      </div>
    </div>
  )
}

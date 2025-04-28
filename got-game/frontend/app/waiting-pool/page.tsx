"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Clock, Users, Star } from "lucide-react"

export default function WaitingPool() {
  const router = useRouter()
  const [playerName, setPlayerName] = useState("")
  const [waitTime, setWaitTime] = useState(30)
  const [playersInPool, setPlayersInPool] = useState(5000)

  useEffect(() => {
    // Get player name from localStorage
    const storedName = localStorage.getItem("playerName")
    if (!storedName) {
      router.push("/")
      return
    }
    setPlayerName(storedName)

    // Simulate countdown
    const timer = setInterval(() => {
      setWaitTime((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          // Simulate being selected for the next lucky draw
          router.push("/lucky-draw")
          return 0
        }
        return prev - 1
      })
    }, 1000)

    // Simulate fluctuating player count in pool
    const playerInterval = setInterval(() => {
      setPlayersInPool((prev) => {
        const change = Math.floor(Math.random() * 200) - 100
        return Math.max(1000, prev + change)
      })
    }, 2000)

    return () => {
      clearInterval(timer)
      clearInterval(playerInterval)
    }
  }, [router])

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-black relative overflow-hidden">
      {/* Stars background */}
      {Array.from({ length: 50 }).map((_, i) => (
        <div
          key={i}
          className="star"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 2}s`,
          }}
        />
      ))}

      <div className="w-full max-w-md flex flex-col items-center gap-8 z-10">
        <div className="relative w-full max-w-xs mb-4">
          <Image
            src="/images/logo.png"
            alt="GOT GAME Logo"
            width={500}
            height={200}
            priority
            className="w-full h-auto"
          />
        </div>

        <div className="text-center mb-4">
          <h1 className="text-3xl font-bold text-white glow-text mb-2">WAITING POOL</h1>
          <p className="text-purple-300 text-lg mb-4">Hang tight, {playerName}!</p>
          <p className="text-white">
            You're in the waiting pool. Stay tuned for the next lucky draw where you might get a chance to rejoin the
            game!
          </p>
        </div>

        <div className="w-full bg-gray-900/50 rounded-lg p-6 glow-border mb-4">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-400" />
              <span className="text-white">
                In pool: <span className="text-purple-400 font-bold">{playersInPool.toLocaleString()}</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-purple-400" />
              <span className="text-white">
                Next draw: <span className="text-purple-400 font-bold">{waitTime}s</span>
              </span>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center gap-4">
            <div className="w-24 h-24 rounded-full bg-purple-900/50 flex items-center justify-center animate-pulse-slow">
              <Star className="h-12 w-12 text-purple-300" />
            </div>
            <p className="text-center text-white">
              The next lucky draw is coming up soon. Players will be randomly selected to rejoin the game!
            </p>
          </div>
        </div>

        <div className="text-center text-purple-300 mt-4">
          <p>No one is ever eliminated from GOT GAME!</p>
          <p className="text-sm mt-2">You'll get another chance in the next lucky draw.</p>
        </div>
      </div>
    </main>
  )
}

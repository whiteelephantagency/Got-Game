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
    const storedName = localStorage.getItem("playerName")
    if (!storedName) {
      router.push("/")
      return
    }
    setPlayerName(storedName)

    const timer = setInterval(() => {
      setWaitTime(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          router.push("/lucky-draw")
          return 0
        }
        return prev - 1
      })
    }, 1000)

    const fluctuation = setInterval(() => {
      setPlayersInPool(prev => {
        const change = Math.floor(Math.random() * 200) - 100
        return Math.max(1000, prev + change)
      })
    }, 2000)

    return () => {
      clearInterval(timer)
      clearInterval(fluctuation)
    }
  }, [router])

  return (
    <main className="relative min-h-screen bg-black flex flex-col items-center justify-center p-4 overflow-hidden text-white">
      {/* Stars background */}
      {Array.from({ length: 40 }).map((_, i) => (
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

      <div className="w-full max-w-md z-10 flex flex-col items-center gap-8">
        {/* Logo */}
        <Image
          src="/images/logo.png"
          alt="GOT GAME Logo"
          width={500}
          height={200}
          className="w-full h-auto"
          priority
        />

        <div className="text-center">
          <h1 className="text-3xl font-bold glow-text mb-2">WAITING POOL</h1>
          <p className="text-purple-300 text-lg mb-2">Hang tight, {playerName}!</p>
          <p className="text-white text-sm">You might be selected in the next lucky draw to rejoin the game.</p>
        </div>

        <div className="w-full bg-gray-900/60 rounded-lg p-6 glow-border">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-400" />
              <span className="text-sm text-white">
                In pool: <strong className="text-purple-300">{playersInPool.toLocaleString()}</strong>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-purple-400" />
              <span className="text-sm text-white">
                Next draw in: <strong className="text-purple-300">{waitTime}s</strong>
              </span>
            </div>
          </div>

          <div className="flex flex-col items-center mt-4">
            <div className="w-20 h-20 rounded-full bg-purple-800/40 flex items-center justify-center animate-pulse">
              <Star className="h-10 w-10 text-purple-300" />
            </div>
            <p className="text-sm text-white mt-3 text-center">
              Players are randomly selected to rejoin the game. Stay ready!
            </p>
          </div>
        </div>

        <div className="text-center text-sm text-purple-300 mt-4">
          <p>No one is ever eliminated from <strong>GOT GAME</strong>!</p>
          <p className="mt-1">You’ll get another chance soon.</p>
        </div>
      </div>
    </main>
  )
}

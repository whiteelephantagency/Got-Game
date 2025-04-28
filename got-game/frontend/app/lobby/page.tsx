"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Star, Users, Clock, Trophy } from "lucide-react"

export default function Lobby() {
  const [playerName, setPlayerName] = useState("")
  const [playerCount, setPlayerCount] = useState(0)
  const [countdown, setCountdown] = useState(10)
  const [isStarting, setIsStarting] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Get player name from localStorage
    const storedName = localStorage.getItem("playerName")
    if (!storedName) {
      router.push("/")
      return
    }
    setPlayerName(storedName)

    // Simulate increasing player count
    const interval = setInterval(() => {
      setPlayerCount((prev) => {
        const newCount = prev + Math.floor(Math.random() * 10) + 1
        return newCount > 10000 ? 10000 : newCount
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [router])

  useEffect(() => {
    if (isStarting && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown((prev) => prev - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (isStarting && countdown === 0) {
      router.push("/game/1")
    }
  }, [isStarting, countdown, router])

  const handleStartGame = () => {
    setIsStarting(true)
  }

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

      <div className="w-full max-w-lg flex flex-col items-center gap-6 z-10">
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

        <div className="text-center mb-2">
          <h1 className="text-3xl font-bold text-white glow-text mb-2">GAME LOBBY</h1>
          <p className="text-purple-300">
            Welcome, <span className="font-bold text-white">{playerName}</span>!
          </p>
        </div>

        <div className="w-full bg-gray-900/50 rounded-lg p-6 glow-border">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-400" />
              <span className="text-white">
                Players: <span className="text-purple-400 font-bold">{playerCount.toLocaleString()}</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-purple-400" />
              <span className="text-white">
                Rounds: <span className="text-purple-400 font-bold">10</span>
              </span>
            </div>
          </div>

          <div className="space-y-4 mb-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Star className="h-5 w-5 fill-purple-500 text-purple-300" />
              Game Rules
            </h3>
            <ul className="text-purple-100 space-y-2 list-disc pl-5">
              <li>Answer 10 questions correctly to win</li>
              <li>The faster you answer, the better your chances</li>
              <li>If you get a question wrong, you may get a second chance in the Lucky Draw</li>
              <li>Only a limited number of players advance each round</li>
              <li>Be the last one standing to win the grand prize!</li>
            </ul>
          </div>

          <div className="flex items-center justify-center">
            {isStarting ? (
              <div className="text-center">
                <div className="text-4xl font-bold text-white glow-text mb-2">{countdown}</div>
                <p className="text-purple-300">Game starting soon...</p>
              </div>
            ) : (
              <Button
                onClick={handleStartGame}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white h-12 text-lg font-bold glow-box transition-all duration-300"
              >
                START GAME
              </Button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 text-purple-300 mt-4">
          <Trophy className="h-5 w-5 text-purple-400" />
          <span>Top Prize: $10,000</span>
          <Trophy className="h-5 w-5 text-purple-400" />
        </div>
      </div>
    </main>
  )
}

"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Trophy, Star, Home, Share2 } from "lucide-react"
import confetti from "canvas-confetti"

export default function Win() {
  const router = useRouter()
  const [playerName, setPlayerName] = useState("")

  useEffect(() => {
    // Get player name from localStorage
    const storedName = localStorage.getItem("playerName")
    if (!storedName) {
      router.push("/")
      return
    }
    setPlayerName(storedName)

    // Trigger confetti animation
    const duration = 5 * 1000
    const animationEnd = Date.now() + duration
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min
    }

    const interval: NodeJS.Timeout = setInterval(() => {
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        return clearInterval(interval)
      }

      const particleCount = 50 * (timeLeft / duration)

      // Since particles fall down, start a bit higher than random
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      })
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      })
    }, 250)

    return () => clearInterval(interval)
  }, [router])

  const handlePlayAgain = () => {
    router.push("/")
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
          <div className="flex justify-center mb-4">
            <div className="w-24 h-24 rounded-full bg-yellow-500 flex items-center justify-center glow-box">
              <Trophy className="h-14 w-14 text-white fill-yellow-300" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white glow-text mb-2">WINNER!</h1>
          <p className="text-purple-300 text-xl mb-4">Congratulations, {playerName}!</p>
          <p className="text-white text-lg">You've answered all 10 questions correctly and won the grand prize!</p>
        </div>

        <div className="w-full bg-gray-900/50 rounded-lg p-6 glow-border mb-4">
          <div className="text-center mb-4">
            <div className="text-3xl font-bold text-yellow-400 glow-text">$10,000</div>
            <div className="text-purple-300">Prize Amount</div>
          </div>

          <div className="flex items-center justify-center gap-2 mb-4">
            <Star className="h-5 w-5 fill-yellow-500 text-yellow-300" />
            <Star className="h-5 w-5 fill-yellow-500 text-yellow-300" />
            <Star className="h-5 w-5 fill-yellow-500 text-yellow-300" />
            <Star className="h-5 w-5 fill-yellow-500 text-yellow-300" />
            <Star className="h-5 w-5 fill-yellow-500 text-yellow-300" />
          </div>

          <p className="text-center text-white mb-4">You beat thousands of other players to claim the top prize!</p>

          <div className="flex gap-4">
            <Button className="flex-1 bg-purple-600 hover:bg-purple-700 text-white h-12 font-bold glow-box transition-all duration-300">
              <Share2 className="mr-2 h-5 w-5" />
              SHARE
            </Button>
            <Button className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white h-12 font-bold glow-box transition-all duration-300">
              CLAIM PRIZE
            </Button>
          </div>
        </div>

        <div className="w-full space-y-4">
          <Button
            onClick={handlePlayAgain}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white h-12 text-lg font-bold glow-box transition-all duration-300"
          >
            PLAY AGAIN
          </Button>

          <Button
            onClick={() => router.push("/")}
            variant="outline"
            className="w-full border-purple-500 text-purple-300 h-12 text-lg font-bold hover:bg-purple-900/20 glow-border"
          >
            <Home className="mr-2 h-5 w-5" />
            BACK TO HOME
          </Button>
        </div>
      </div>
    </main>
  )
}

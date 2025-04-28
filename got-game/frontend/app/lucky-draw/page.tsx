"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Star, Users } from "lucide-react"

export default function LuckyDraw() {
  const router = useRouter()
  const [playerName, setPlayerName] = useState("")
  const [isDrawing, setIsDrawing] = useState(true)
  const [isSelected, setIsSelected] = useState(false)
  const [drawComplete, setDrawComplete] = useState(false)
  const [displayedNames, setDisplayedNames] = useState<string[]>([])
  const [remainingSpots, setRemainingSpots] = useState(500)

  // Sample player names for the lucky draw animation
  const sampleNames = [
    "Alex",
    "Jordan",
    "Taylor",
    "Casey",
    "Morgan",
    "Riley",
    "Jamie",
    "Quinn",
    "Avery",
    "Blake",
    "Cameron",
    "Dakota",
    "Emerson",
    "Finley",
    "Harper",
    "Kendall",
    "Logan",
    "Madison",
    "Noah",
    "Olivia",
    "Parker",
    "Rowan",
    "Skyler",
    "Tatum",
    "Zion",
    "Bailey",
    "Charlie",
    "Drew",
  ]

  useEffect(() => {
    // Get player name from localStorage
    const storedName = localStorage.getItem("playerName")
    if (!storedName) {
      router.push("/")
      return
    }
    setPlayerName(storedName)

    // Simulate lucky draw process
    let drawTimer: NodeJS.Timeout

    if (isDrawing) {
      // Rapidly cycle through random names
      drawTimer = setInterval(() => {
        const randomNames = Array.from({ length: 5 }, () => sampleNames[Math.floor(Math.random() * sampleNames.length)])
        setDisplayedNames(randomNames)
        setRemainingSpots((prev) => Math.max(prev - Math.floor(Math.random() * 10), 0))
      }, 200)

      // After 5 seconds, complete the draw
      setTimeout(() => {
        clearInterval(drawTimer)
        setIsDrawing(false)

        // 50% chance of being selected
        const selected = Math.random() > 0.5
        setIsSelected(selected)
        setDrawComplete(true)
      }, 5000)
    }

    return () => {
      if (drawTimer) clearInterval(drawTimer)
    }
  }, [router, isDrawing])

  const handleContinue = () => {
    if (isSelected) {
      // Selected in lucky draw, continue to next round
      router.push("/game/2") // Assuming this is after round 1
    } else {
      // Not selected, go to waiting pool
      router.push("/waiting-pool")
    }
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
          <h1 className="text-3xl font-bold text-white glow-text mb-2">LUCKY DRAW</h1>
          <p className="text-purple-300">Second chance to stay in the game!</p>
        </div>

        <div className="w-full bg-gray-900/50 rounded-lg p-6 glow-border">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-400" />
              <span className="text-white">
                Remaining spots: <span className="text-purple-400 font-bold">{remainingSpots}</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 fill-purple-500 text-purple-300" />
              <span className="text-white">Lucky players get a second chance!</span>
            </div>
          </div>

          <div className="space-y-6 mb-6">
            <div className="bg-black/50 rounded-lg p-4 min-h-[200px] flex flex-col items-center justify-center">
              {isDrawing ? (
                <>
                  <div className="text-xl text-white mb-4">Drawing lucky players...</div>
                  <div className="grid grid-cols-1 gap-2 w-full">
                    {displayedNames.map((name, index) => (
                      <div key={index} className="bg-purple-900/50 p-2 rounded text-center text-white">
                        {name}
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center lucky-draw-animation">
                  <div className="text-2xl font-bold mb-4 glow-text">
                    {isSelected ? (
                      <span className="text-green-400">YOU'VE BEEN SELECTED!</span>
                    ) : (
                      <span className="text-red-400">NOT SELECTED</span>
                    )}
                  </div>
                  <div className="text-xl text-white mb-6">
                    {isSelected ? (
                      <>Congratulations, {playerName}! You get to continue!</>
                    ) : (
                      <>Sorry, {playerName}. Better luck next time!</>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {drawComplete && (
            <Button
              onClick={handleContinue}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white h-12 text-lg font-bold glow-box transition-all duration-300"
            >
              CONTINUE
            </Button>
          )}
        </div>
      </div>
    </main>
  )
}

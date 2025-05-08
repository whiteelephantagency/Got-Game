"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import Image from "next/image"
import { motion } from "framer-motion"
import { rounds } from "../../../lib/round"

const ROWS = 15
const COLUMNS = 20

export default function StatsPage() {
  const router = useRouter()
  const params = useParams()
  const roundNumber = Number(params?.round)

  const roundData = rounds.find((r) => r.id === roundNumber)
  const total = roundData?.stats.totalCorrect || 0
  const safe = roundData?.stats.advancing || 0

  const [dots, setDots] = useState<number[]>([])
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let count = 0
    const interval = setInterval(() => {
      if (count >= total) {
        clearInterval(interval)
        setTimeout(() => {
          router.push(`/game/${roundNumber + 1}`)
        }, 3000)
      } else {
        setDots((prev) => [...prev, count])
        count++
        setProgress(((count + 1) / total) * 100)
        playSound()
      }
    }, 10)
    return () => clearInterval(interval)
  }, [roundNumber, total])

  const playSound = () => {
    const audio = new Audio("/sounds/dot-fill.mp3")
    audio.volume = 0.2
    audio.play()
  }

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-900 to-purple-600 overflow-hidden p-4 w-full max-w-7xl mx-auto">
      {/* Background Image + Particle Effect */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/lobby-background.jpg"
          alt="Grid"
          fill
          className="object-cover opacity-20"
        />
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-purple-400 rounded-full opacity-50 animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDuration: `${1 + Math.random() * 3}s`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Round Heading */}
      <div className="absolute top-10 z-20 text-4xl font-bold text-white tracking-widest">
        ROUND {roundNumber} STATS
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-10 w-full max-w-3xl z-20">
        <div className="h-4 bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-purple-500 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-center text-white mt-2 text-sm">{Math.floor(progress)}% Complete</p>
      </div>

      {/* Grid of Dots */}
      <div className="grid grid-cols-[repeat(20,_minmax(0,_1fr))] gap-1 z-10">
        {Array.from({ length: ROWS * COLUMNS }).map((_, i) => {
          const isCorrect = i < total
          const isAdvancing = i < safe
          const isFilled = dots.includes(i)

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={isFilled ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: i * 0.003, duration: 0.2 }}
              className={`w-5 h-5 rounded-sm ${
                isFilled
                  ? isAdvancing
                    ? "bg-green-400 shadow-[0_0_8px_2px_rgba(0,255,0,0.6)]"
                    : "bg-red-400 shadow-[0_0_8px_2px_rgba(255,0,0,0.6)]"
                  : "bg-gray-600"
              }`}
            />
          )
        })}
      </div>
    </main>
  )
}

'use client'

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function GameVideo({ params }: { params: { round: string } }) {
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push(`/game/${params.round}`)
    }, 5000) // after 5 seconds go to question
    return () => clearTimeout(timer)
  }, [params.round, router])

  return (
    <main className="relative min-h-screen bg-black flex items-center justify-center overflow-hidden">
      {/* Background Grid */}
      <Image
        src="/images/grid-background.jpg"
        alt="Grid Background"
        fill
        className="object-cover z-0"
      />

      {/* Video Frame */}
      <div className="z-10 relative w-[90%] max-w-5xl aspect-video border-8 border-purple-500 bg-black rounded-md overflow-hidden shadow-lg">
        {/* Simulated play icon */}
        <div className="flex items-center justify-center h-full">
          <div className="w-0 h-0 border-l-[30px] border-l-gray-300 border-t-[20px] border-t-transparent border-b-[20px] border-b-transparent" />
        </div>
      </div>

      {/* GOT GAME Logo */}
      <div className="absolute bottom-6 right-6 z-20">
        <Image
          src="/images/gotgamelogo.png"
          alt="Got Game Logo"
          width={120}
          height={60}
        />
      </div>
    </main>
  )
}

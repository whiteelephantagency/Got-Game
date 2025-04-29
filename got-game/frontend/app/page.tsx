'use client'

import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export default function Home() {
  const router = useRouter()

  const handleStart = () => {
    router.push('/lobby')
  }

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center bg-black overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/Background1.jpg" 
          alt="Background"
          fill
          className="object-cover opacity-80"
          priority
        />
      </div>

      {/* Foreground Content */}
      <div className="relative z-10 flex flex-col items-center gap-6 px-4">
        {/* Smaller GOT GAME Logo */}
        <Image
          src="/images/gotgamelogo.png"
          alt="Got Game Logo"
          width={100}
          height={100}
          className="w-auto h-auto animate-pulse"
          priority
        />

        {/* Start Button */}
        <Button
          onClick={handleStart}
          className="mt-4 px-10 py-3 text-xl font-bold bg-[#A757E7] hover:bg-[#8E47D1] rounded-full shadow-md transition-all duration-300"
        >
          START
        </Button>
      </div>
    </main>
  )
}

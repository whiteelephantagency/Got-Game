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

      {/* Foreground Content with Better Spacing */}
      <div className="relative z-10 flex flex-col items-center gap-12 px-8 py-12 max-w-4xl mx-auto">
        
        {/* Enhanced GOT GAME Logo Container */}
        <div className="flex flex-col items-center space-y-8">
          <Image
            src="/images/Gotgamelogo.png"
            alt="Got Game Logo"
            width={120}
            height={120}
            className="w-auto h-auto animate-pulse drop-shadow-2xl"
            priority
          />
          
          {/* Welcome Text with Better Margins */}
          <div className="text-center space-y-4 px-6">
            
          </div>
        </div>

        {/* Start Button with Enhanced Spacing */}
        <div className="mt-8 mb-4">
          <Button
            onClick={handleStart}
            className="px-12 py-4 text-2xl font-bold bg-[#A757E7] hover:bg-[#8E47D1] rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-2 border-transparent hover:border-purple-300"
          >
            START GAME
          </Button>
        </div>

        {/* Additional Bottom Spacing */}
        <div className="text-center font-medium text-white text-sm px-6 mt-8">
          <p>Ready to test your knowledge? Click START GAME to begin!</p>
        </div>

      </div>

      {/* Safe Area for Mobile */}
      <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
      
    </main>
  )
}
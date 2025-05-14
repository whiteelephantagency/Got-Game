// /app/sorting/page.tsx
"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Image from "next/image"

export default function SortingPage() {
  const router = useRouter()
  const [ended, setEnded] = useState(false)

  useEffect(() => {
    if (ended) {
      router.push("/lucky-draw")
    }
  }, [ended, router])

  return (
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black text-white">
      {/* Background */}
      <Image
        src="/images/lobby-background.jpg"
        alt="Background"
        fill
        className="object-cover opacity-90 z-0"
        priority
      />

      {/* Sorting Explanation Video */}
      <div className="relative z-10 w-full max-w-3xl rounded-xl overflow-hidden shadow-2xl">
        <video
          src="/video/sorting-explained.mp4"
          autoPlay
          onEnded={() => setEnded(true)}
          className="w-full h-auto"
        />
      </div>
    </main>
  )
}

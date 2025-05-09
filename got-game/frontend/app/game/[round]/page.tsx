// app/game/[round]/page.tsx
"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import AlexVideoPlayer  from "@/components/ui/AlexVideoPlayer"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Clock, Users, CheckCircle, XCircle } from "lucide-react"
import { questions as question } from "@/lib/questions"
import StatMap from "@/components/ui/StatMap"
import ChatBot from "@/components/ui/ChatBot"


export default function GameRound() {
  const params = useParams()
  const router = useRouter()
  const roundParam = params?.round
  const roundNumber = Number(roundParam)



  const [showIntro, setShowIntro] = useState(true)
  const [isAnswered, setIsAnswered] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [timeLeft, setTimeLeft] = useState(15)
  const [isCorrect, setIsCorrect] = useState(false)
  const [playerCount, setPlayerCount] = useState(2000)
  const [liveCount, setLiveCount] = useState(0)
  const [prize, setPrize] = useState(10000)


  const currentQuestion = question[roundNumber - 1]

 
  // Redirect if the round number is invalid
  useEffect(() => {
    if (!roundNumber || roundNumber < 1 || roundNumber > question.length) {
      router.push("/")
      return
    }
  }, [roundNumber, router])

  useEffect(() => {
    let count = 0
    const interval = setInterval(() => {
      if (count < 2000) {
        count += Math.floor(Math.random() * 50) + 10
        setLiveCount(Math.min(count, 2000))
      } else {
        clearInterval(interval)
      }
    }, 100)
    return () => clearInterval(interval)
  }, [])
  

  // Handle intro video end
  const handleIntroEnded = () => {
    setShowIntro(false)
  }

  // Start countdown timer after intro ends
useEffect(() => {
  if (showIntro || isAnswered) return

  const timer = setInterval(() => {
    setTimeLeft((prev) => {
      if (prev <= 1) {
        clearInterval(timer)
        handleTimeout() // when timer reaches 0
        return 0
      }
      return prev - 1
    })
  }, 1000)

  return () => clearInterval(timer)
}, [showIntro, isAnswered])

  

  // Handle answer selection
  const handleAnswerSelect = (answer: string) => {
    if (isAnswered) return
    setSelectedAnswer(answer)
    setIsAnswered(true)

    const correct = answer === currentQuestion.correctAnswer
    setIsCorrect(correct)

    setTimeout(() => {
      if (correct) {
        if (roundNumber < question.length) {
          router.push(`/stats/${roundNumber}`)
        } else {
          router.push("/win")
        }
      }
       else {
        router.push("/lucky-draw")
      }
    }, 2000)
  }

  const handleTimeout = () => {
    setIsAnswered(true)
    setIsCorrect(false)
  
    setTimeout(() => {
      router.push("/lucky-draw") // or "/timeout" if you want a custom screen
    }, 2000)
  }
  

  // Show the intro video
  if (showIntro) {
    return (
      <main className="relative min-h-screen flex flex-col items-center justify-center bg-black overflow-hidden">
        {/* Live Counter */}
        <div className="absolute top-4 left-4 z-30 text-white space-y-2 font-bold text-sm md:text-base">
          <div>▶ PLAYERS {liveCount.toLocaleString()}</div>
          <div>▶ PRIZE 10,000$</div>
          <div>▶ TIMER 00:{String(timeLeft).padStart(2, "0")}</div>
        </div>

  
        {/* Chat Icon */}
        <div className="absolute top-4 right-4 z-20">
          <button className="relative bg-purple-800 p-2 rounded-full hover:bg-purple-700 shadow-md">
            💬
            <span className="absolute top-0 right-0 h-2 w-2 bg-green-400 rounded-full animate-ping"></span>
          </button>
        </div> 
  
         {/* Video Intro Component */}
      <AlexVideoPlayer src={currentQuestion.introUrl} onEnded={handleIntroEnded} autoPlay />
      </main>
    )
  }
  

  // Main question screen
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center p-4 overflow-hidden bg-gradient-to-br from-purple-900 to-purple-600">

    {/* Background image */}
    <Image
      src="/images/lobby-background.jpg"
      alt="Background"
      fill
      className="object-cover z-0"
    />

    {/* Floating UI */}
   {/*  <div className="absolute top-4 left-4 z-20">
      <div className="bg-purple-900/80 px-4 py-2 rounded-lg text-white font-bold shadow-lg">
        👥 Joined: {liveCount.toLocaleString()}
      </div>
    </div> */}    

    {/* StatMap (consider making this fixed at bottom or top, not inside center card) */}
    <StatMap playerCount={playerCount} prize={prize} timeLeft={timeLeft} />

    {/* ChatBot UI */}
    <ChatBot />

    {/* Join Particles */}
   {/*  {Array.from({ length: 20 }).map((_, i) => (
      <div
        key={i}
        className="absolute w-2 h-2 bg-purple-400 rounded-full opacity-70 animate-ping"
        style={{
          top: `${Math.random() * 70 + 10}%`,
          left: `${Math.random() * 90 + 5}%`,
          animationDuration: `${1 + Math.random() * 2}s`,
          animationDelay: `${Math.random()}s`,
        }}
      />
    ))} */}

    {/* Placeholder video that plays before question */}
    <div className="w-full max-w-3xl aspect-video bg-black rounded-lg mb-10 overflow-hidden shadow-xl z-10">
        <video src={currentQuestion.videoUrl} autoPlay controls className="w-full h-full object-cover" />
      </div>

      {/* Question and Answers */}
      <div className="w-full max-w-3xl z-10 mt-6 rounded-lg bg-purple-900/80 p-6 shadow-2xl">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 text-center uppercase tracking-wide">
          Question {roundNumber}
        </h2>
        <p className="text-white text-lg text-center mb-8">{currentQuestion.question}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentQuestion.options.map((option, index) => (
            <Button
            key={option}
            onClick={() => handleAnswerSelect(option)}
            disabled={isAnswered}
            className={`h-16 text-lg font-medium transition-all duration-300 rounded-xl flex justify-between items-center px-4 ${
              isAnswered
                ? option === currentQuestion.correctAnswer
                  ? "bg-green-600"
                  : option === selectedAnswer
                  ? "bg-red-600"
                  : "bg-purple-700 opacity-70"
                : "bg-purple-700 hover:bg-purple-800"
            }`}
          >
            <span className="text-white font-bold">
              {String.fromCharCode(65 + index)}. {option}
            </span>
          
            {isAnswered && option === currentQuestion.correctAnswer && (
              <CheckCircle className="text-white ml-2 h-5 w-5" />
            )}
            {isAnswered && option !== currentQuestion.correctAnswer && (
              <XCircle className="text-white ml-2 h-5 w-5" />
            )}
          </Button>          
          ))}
        </div>
      </div>

    </main>

  )
}

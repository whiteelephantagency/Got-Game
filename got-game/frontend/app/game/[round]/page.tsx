"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { questions } from "@/lib/questions"
import AlexVideoPlayer from "@/components/ui/AlexVideoPlayer"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import StatMap from "@/components/ui/StatMap"
import ChatBot from "@/components/ui/ChatBot"

export default function GameRound() {
  const params = useParams()
  const router = useRouter()
  const roundParam = params?.round
  const roundNumber = Number(roundParam)
  const currentQuestion = questions[roundNumber - 1]

  const [showIntro, setShowIntro] = useState(true)
  const [isAnswered, setIsAnswered] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [isCorrect, setIsCorrect] = useState(false)
  const [playerCount, setPlayerCount] = useState(2000)
  const [prize, setPrize] = useState(10000)
  const [showReactionVideo, setShowReactionVideo] = useState(false)

  // Video sources for different stages
  const videoSources = [
    currentQuestion.introUrl,
    currentQuestion.reactionUrl,
    currentQuestion.statsCommentUrl,
    currentQuestion.sortingUrl,
    currentQuestion.congratsUrl,
  ]

  const [stage, setStage] = useState(0)

  // Redirect if the round number is invalid
  useEffect(() => {
    if (!roundNumber || roundNumber < 1 || roundNumber > questions.length) {
      router.push("/")
      return
    }
  }, [roundNumber, router])

  // Handle intro video end
  const handleIntroEnded = () => {
    setShowIntro(false)
  }

  // Handle next video stage
  const handleNextStage = () => {
    if (stage < videoSources.length - 1) {
      setStage(stage + 1)
    } else {
      setShowReactionVideo(false)
      if (isCorrect) {
        router.push(`/stats/${roundNumber}`)
      } else {
        router.push("/stats/[round]")
      }
    }
  }

  // Handle answer selection
  const handleAnswerSelect = (answer: string) => {
    if (isAnswered) return
    setSelectedAnswer(answer)
    setIsAnswered(true)

    const correct = answer === currentQuestion.correctAnswer
    setIsCorrect(correct)

    // Show reaction video after selecting an answer
    setTimeout(() => {
      setShowReactionVideo(true)
      setStage(1) // Start from the reaction video
    }, 1000)
  }

  // Show the intro video
  if (showIntro) {
    return (
      <AlexVideoPlayer src={currentQuestion.introUrl} onEnded={handleIntroEnded} autoPlay />
    )
  }

  // Show the reaction video if needed
  if (showReactionVideo) {
    return (
      <AlexVideoPlayer src={videoSources[stage]} onEnded={handleNextStage} autoPlay />
    )
  }

  // Main question screen
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center p-4 overflow-hidden bg-gradient-to-br from-purple-900 to-purple-600">
      <Image
        src="/images/lobby-background.jpg"
        alt="Background"
        fill
        className="object-cover z-0"
      />

      {/* Stat Map */}
      <StatMap playerCount={playerCount} prize={prize} timeLeft={15} />

      {/* Chat Bot */}
      <ChatBot />

      <div className="w-full max-w-4xl z-10 rounded-lg bg-purple-900/80 p-8 shadow-2xl">
        <h2 className="text-3xl font-bold text-white mb-8 text-center glow-text">
          {currentQuestion.question}
        </h2>

        <div className="grid grid-cols-2 gap-6 mb-4">
          {currentQuestion.options.map((option, index) => (
            <Button
              key={option}
              onClick={() => handleAnswerSelect(option)}
              disabled={isAnswered}
              className={`h-20 text-xl font-medium transition-all duration-300 shadow-lg rounded-2xl ${
                selectedAnswer === option
                  ? isCorrect
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-red-600 hover:bg-red-700"
                  : "bg-purple-700 hover:bg-purple-800"
              } ${selectedAnswer === option ? "glow-box" : ""}`}
            >
              <span className="text-white font-bold">
                {String.fromCharCode(65 + index)}. {option}
              </span>
            </Button>
          ))}
        </div>
      </div>
    </main>
  )
}

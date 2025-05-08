// app/game/[round]/page.tsx
"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import AlexQuestions from "@/components/ui/AlexQuestions"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Clock, Users, CheckCircle, XCircle } from "lucide-react"
import StatMap from "@/components/ui/StatMap"
import ChatBot from "@/components/ui/ChatBot"

// Sample questions for the game
const questions = [
  {
    id: 1,
    question: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    correctAnswer: "Mars",
    videoUrl: "/video/question-1.mp4",
    introUrl: "/video/host-alex-question-1.mp4",
  },
  {
    id: 2,
    question: "What is the capital of Japan?",
    options: ["Beijing", "Seoul", "Tokyo", "Bangkok"],
    correctAnswer: "Tokyo",
    videoUrl: "/video/question-2.mp4",
    introUrl: "/video/host-alex-question-2.mp4",
  },
  {
    id: 3,
    question: "Who painted the Mona Lisa?",
    options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"],
    correctAnswer: "Leonardo da Vinci",
    videoUrl: "/video/question-3.mp4",
    introUrl: "/video/host-alex-question-3.mp4",
  },
  {
    id: 4,
    question: "What is the largest ocean on Earth?",
    options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
    correctAnswer: "Pacific Ocean",
    videoUrl: "/video/question-4.mp4",
    introUrl: "/video/host-alex-question-4.mp4",
  },
  {
    id: 5,
    question: "Which element has the chemical symbol 'O'?",
    options: ["Gold", "Oxygen", "Osmium", "Oganesson"],
    correctAnswer: "Oxygen",
    videoUrl: "/video/question-5.mp4",
    introUrl: "/video/host-alex-question-5.mp4",
  },
]

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
  const [prize, setPrize] = useState(10000)

  const currentQuestion = questions[roundNumber - 1]

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

  // Handle answer selection
  const handleAnswerSelect = (answer: string) => {
    if (isAnswered) return
    setSelectedAnswer(answer)
    setIsAnswered(true)

    const correct = answer === currentQuestion.correctAnswer
    setIsCorrect(correct)

    setTimeout(() => {
      if (correct) {
        // Move to next round or win screen
        if (roundNumber < questions.length) {
          router.push(`/game/${roundNumber + 1}`)
        } else {
          router.push("/win")
        }
      } else {
        router.push("/lucky-draw")
      }
    }, 2000)
  }

  // Show the intro video
  if (showIntro) {
    return <AlexQuestions round={roundNumber} onEnded={handleIntroEnded} />
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
      <StatMap playerCount={playerCount} prize={prize} timeLeft={timeLeft} />

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

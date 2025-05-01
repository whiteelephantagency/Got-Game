"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Clock, Users, CheckCircle, XCircle } from "lucide-react"

// Sample questions for the game
const questions = [
  {
    id: 1,
    question: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    correctAnswer: "Mars",
  },
  {
    id: 2,
    question: "What is the capital of Japan?",
    options: ["Beijing", "Seoul", "Tokyo", "Bangkok"],
    correctAnswer: "Tokyo",
  },
  {
    id: 3,
    question: "Who painted the Mona Lisa?",
    options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"],
    correctAnswer: "Leonardo da Vinci",
  },
  {
    id: 4,
    question: "What is the largest ocean on Earth?",
    options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
    correctAnswer: "Pacific Ocean",
  },
  {
    id: 5,
    question: "Which element has the chemical symbol 'O'?",
    options: ["Gold", "Oxygen", "Osmium", "Oganesson"],
    correctAnswer: "Oxygen",
  },
  {
    id: 6,
    question: "What is the largest mammal in the world?",
    options: ["African Elephant", "Blue Whale", "Giraffe", "Polar Bear"],
    correctAnswer: "Blue Whale",
  },
  {
    id: 7,
    question: "Which country is home to the kangaroo?",
    options: ["New Zealand", "South Africa", "Australia", "Brazil"],
    correctAnswer: "Australia",
  },
  {
    id: 8,
    question: "What is the hardest natural substance on Earth?",
    options: ["Gold", "Iron", "Diamond", "Platinum"],
    correctAnswer: "Diamond",
  },
  {
    id: 9,
    question: "Which planet has the most moons?",
    options: ["Jupiter", "Saturn", "Uranus", "Neptune"],
    correctAnswer: "Saturn",
  },
  {
    id: 10,
    question: "What is the smallest prime number?",
    options: ["0", "1", "2", "3"],
    correctAnswer: "2",
  },
]

export default function GameRound() {
  const router = useRouter()
  const params = useParams()
  const roundParam = params?.round
  const roundNumber = Number.parseInt(Array.isArray(roundParam) ? roundParam[0] : roundParam || "1")

  const [timeLeft, setTimeLeft] = useState(15)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [isAnswered, setIsAnswered] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [playerCount, setPlayerCount] = useState(10000)
  const [remainingSpots, setRemainingSpots] = useState(5000)
  const [showVideo, setShowVideo] = useState(true)

  const currentQuestion = questions[roundNumber - 1]

  useEffect(() => {
    if (isNaN(roundNumber) || roundNumber < 1 || roundNumber > questions.length) {
      router.push("/")
      return
    }

    if (showVideo) {
      const videoTimer = setTimeout(() => setShowVideo(false), 5000)
      return () => clearTimeout(videoTimer)
    }

    if (!showVideo && !isAnswered) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            handleTimeout()
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [roundNumber, showVideo, isAnswered, router])

  useEffect(() => {
    if (!showVideo && !isAnswered) {
      const interval = setInterval(() => {
        setPlayerCount((prev) => Math.max(prev - Math.floor(Math.random() * 50), remainingSpots))
        setRemainingSpots((prev) => Math.max(prev - Math.floor(Math.random() * 30), roundNumber === 10 ? 1 : 1000))
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [showVideo, isAnswered, roundNumber, remainingSpots])

  const handleAnswerSelect = (answer: string) => {
    if (isAnswered) return
    setSelectedAnswer(answer)
    setIsAnswered(true)

    const correct = answer === currentQuestion.correctAnswer
    setIsCorrect(correct)

    setTimeout(() => {
      if (correct) {
        if (remainingSpots > 0) {
          if (roundNumber < 10) {
            router.push(`/video/${roundNumber + 1}`)
          } else {
            router.push("/win")
          }
        } else {
          router.push("/waiting-pool")
        }
      } else {
        router.push("/lucky-draw")
      }
    }, 2000)
  }

  const handleTimeout = () => {
    setIsAnswered(true)
    setIsCorrect(false)
    setTimeout(() => router.push("/lucky-draw"), 2000)
  }

  if (showVideo) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black p-4">
        <div className="w-full max-w-4xl">
          <div className="mb-4 flex justify-between text-white">
            <span className="text-purple-400 font-bold">Round {roundNumber}/10</span>
            <span>Loading video...</span>
          </div>
          <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center border-4 border-purple-600">
            <div className="text-center">
              <p className="text-white text-xl mb-2">Video Playing</p>
              <p className="text-purple-400">Pay attention to the details...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black p-4 relative overflow-hidden">
      {Array.from({ length: 30 }).map((_, i) => (
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

      <div className="w-full max-w-2xl z-10">
        <div className="mb-4 flex justify-between items-center">
          <div className="text-purple-400 font-bold text-lg">Round {roundNumber}/10</div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4 text-purple-400" />
              <span className="text-white text-sm">{playerCount.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4 text-purple-400" />
              <span className="text-white text-sm">{timeLeft}s</span>
            </div>
          </div>
        </div>

        <div className="w-full bg-gray-900/70 rounded-lg p-6 mb-4">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">{currentQuestion.question}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {currentQuestion.options.map((option) => (
              <Button
                key={option}
                onClick={() => handleAnswerSelect(option)}
                disabled={isAnswered}
                className={`h-16 text-lg font-medium transition-all duration-300 ${
                  selectedAnswer === option
                    ? isCorrect
                      ? "bg-green-600"
                      : "bg-red-600"
                    : isAnswered && option === currentQuestion.correctAnswer
                    ? "bg-green-600"
                    : "bg-purple-600 hover:bg-purple-700"
                }`}
              >
                {option}
                {isAnswered &&
                  option === selectedAnswer &&
                  (isCorrect ? <CheckCircle className="ml-2 h-5 w-5" /> : <XCircle className="ml-2 h-5 w-5" />)}
                {isAnswered &&
                  option === currentQuestion.correctAnswer &&
                  option !== selectedAnswer && <CheckCircle className="ml-2 h-5 w-5" />}
              </Button>
            ))}
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-purple-300">Remaining spots</span>
              <span className="text-white font-bold">{remainingSpots.toLocaleString()}</span>
            </div>
            <Progress value={(remainingSpots / 10000) * 100} className="h-2 bg-gray-800" />
          </div>
        </div>

        {isAnswered && (
          <div className={`text-center text-lg font-bold ${isCorrect ? "text-green-400" : "text-red-400"}`}>
            {isCorrect ? "Correct! Moving to next round..." : "Wrong answer! Going to Lucky Draw..."}
          </div>
        )}
      </div>
    </main>
  )
}

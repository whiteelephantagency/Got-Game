// app/game/[round]/page.tsx
"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import AlexQuestions from "@/components/ui/AlexQuestions"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Clock, Users } from "lucide-react"

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

  const currentQuestion = questions[roundNumber - 1]

  // Redirect if the round number is invalid
  useEffect(() => {
    if (!roundNumber || roundNumber < 1 || roundNumber > questions.length) {
      router.push("/")
    }
  }, [roundNumber, router])

  const handleIntroEnded = () => {
    setShowIntro(false)
  }

  const handleAnswerSelect = (answer: string) => {
    if (isAnswered) return
    setSelectedAnswer(answer)
    setIsAnswered(true)

    const isCorrect = answer === currentQuestion.correctAnswer

    setTimeout(() => {
      if (isCorrect) {
        router.push(roundNumber < questions.length ? `/game/${roundNumber + 1}` : "/win")
      } else {
        router.push("/lucky-draw")
      }
    }, 2000)
  }

  // Show the intro video before the main question
  if (showIntro) {
    return <AlexQuestions round={roundNumber} onEnded={handleIntroEnded} />
  }

  // Main question screen
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center p-4 overflow-hidden">
      <Image
        src="/images/lobby-background.jpg"
        alt="Background"
        fill
        className="object-cover z-0"
      />

      <div className="w-full max-w-2xl z-10">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          {currentQuestion.question}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {currentQuestion.options.map((option) => (
            <Button
              key={option}
              onClick={() => handleAnswerSelect(option)}
              className="h-16 text-lg font-medium bg-purple-600 hover:bg-purple-700 text-white rounded-lg"
            >
              {option}
            </Button>
          ))}
        </div>
      </div>
    </main>
  )
}

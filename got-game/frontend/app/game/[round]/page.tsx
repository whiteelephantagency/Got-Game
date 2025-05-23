"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle } from "lucide-react"
import { questions } from "@/lib/questions"
import ChatBot from "@/components/ui/ChatBot"
import AlexVideoPlayer from "@/components/ui/AlexVideoPlayer"

export default function GameRound() {
  const params = useParams()
  const router = useRouter()
  const roundNumber = Number(params?.round)

  const [showQuestion, setShowQuestion] = useState(false)
  const [isAnswered, setIsAnswered] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [isCorrect, setIsCorrect] = useState(false)
  const [timeLeft, setTimeLeft] = useState(15)

  const currentQuestion = questions[roundNumber - 1]

  useEffect(() => {
    if (!roundNumber || !currentQuestion) {
      router.push("/")
    }
  }, [roundNumber, router, currentQuestion])

  useEffect(() => {
    if (showQuestion && !isAnswered) {
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
  }, [showQuestion, isAnswered])

  const handleIntroEnded = () => {
    setShowQuestion(true)
  }

  const handleAnswerSelect = (answer: string) => {
    if (isAnswered) return
    setSelectedAnswer(answer)
    setIsAnswered(true)
    const correct = answer === currentQuestion.correctAnswer
    setIsCorrect(correct)

    setTimeout(() => {
      if (correct) {
        router.push(`/stats/${roundNumber}`)
      } else {
        router.push("/lucky-draw")
      }
    }, 2000)
  }

  const handleTimeout = () => {
    setIsAnswered(true)
    setIsCorrect(false)
    setTimeout(() => {
      router.push("/lucky-draw")
    }, 2000)
  }

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-black">
      <Image
        src="/images/lobby-background.jpg"
        alt="Background"
        fill
        className="object-cover z-0"
      />

      <div className="absolute top-6 left-6 z-20 text-white space-y-2 text-sm">
        <div>PLAYERS 2,000</div>
        <div>PRIZE 10,000$</div>
        <div>TIMER 00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}</div>
      </div>

      {/* Layout grid */}
      <div className="relative z-10 grid grid-cols-12 grid-rows-6 gap-4 w-full h-full p-8">
        {/* Video top left */}
        <div className="col-span-6 row-span-3">
          {!showQuestion && (
            <AlexVideoPlayer
              src={currentQuestion.introUrl}
              onEnded={handleIntroEnded}
              autoPlay
            />
          )}
        </div>

        {/* Highscore top right */}
        <div className="col-start-9 col-span-4 row-start-1 row-span-2 text-white p-4 rounded-xl bg-purple-800/80 shadow-xl">
          <h3 className="font-bold text-lg mb-2">HIGHSCORE</h3>
          <ul className="text-sm space-y-1">
            <li>#1 JiveMaster2023</li>
            <li>#2 GrooveKing2023</li>
            <li>#3 BeatWizard2023</li>
            <li>#4 RhythmNinja2023</li>
          </ul>
        </div>

        {/* Question & Answers */}
        {showQuestion && (
          <div className="col-span-6 row-start-4 row-span-3 space-y-4">
            <h2 className="text-white text-xl font-bold">QUESTION {roundNumber}</h2>
            <p className="text-white text-lg">{currentQuestion.question}</p>
            <div className="grid grid-cols-2 gap-4">
              {currentQuestion.options.map((option, index) => (
                <Button
                  key={option}
                  onClick={() => handleAnswerSelect(option)}
                  disabled={isAnswered}
                  className={`h-14 text-base font-semibold transition-all duration-300 rounded-lg px-4 flex justify-between items-center
                    ${
                      isAnswered
                        ? option === currentQuestion.correctAnswer
                          ? "bg-green-600"
                          : option === selectedAnswer
                          ? "bg-red-600"
                          : "bg-purple-700 opacity-70"
                        : "bg-purple-700 hover:bg-purple-800"
                    }`}
                >
                  <span className="text-white">
                    {String.fromCharCode(65 + index)}. {option}
                  </span>
                  {isAnswered && option === currentQuestion.correctAnswer && <CheckCircle className="text-white ml-2 h-5 w-5" />}
                  {isAnswered && option !== currentQuestion.correctAnswer && <XCircle className="text-white ml-2 h-5 w-5" />}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Chat bottom right */}
        <div className="col-start-9 col-span-4 row-start-3 row-span-4">
          <ChatBot />
        </div>
      </div>
    </main>
  )
}

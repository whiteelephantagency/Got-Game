// components/ui/QuestionIntro.tsx
"use client"

import { FC } from "react"

interface QuestionIntroProps {
  round: number
  onEnded: () => void
}

const QuestionIntro: FC<QuestionIntroProps> = ({ round, onEnded }) => {
  const videoUrl = `/video/host-alex-question-${round}.mp4`

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <video
        src={videoUrl}
        autoPlay
        playsInline
        onEnded={onEnded}
        className="relative z-10 w-[90vw] max-w-[720px] rounded-2xl shadow-2xl"
      />
    </div>
  )
}

export default QuestionIntro

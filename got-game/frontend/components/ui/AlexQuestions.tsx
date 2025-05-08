"use client";

import { useEffect, useState } from "react";
import AlexVideoPlayer from "@/components/ui/AlexVideoPlayer";
import { useRouter } from "next/navigation";
import { questions } from "@/lib/questions";

interface AlexQuestionsProps {
  round: number;
  onEnded: () => void;
}

export default function AlexQuestions({ round, onEnded }: AlexQuestionsProps) {
  const router = useRouter();
  const currentQuestion = questions[round - 1];

  const [stage, setStage] = useState("intro");

  useEffect(() => {
    if (!currentQuestion) {
      router.push("/");
      return;
    }
  }, [currentQuestion, router]);

  const handleNextStage = () => {
    switch (stage) {
      case "intro":
        setStage("stats");
        break;
      case "stats":
        setStage("comment");
        break;
      case "comment":
        setStage("sorting");
        break;
      case "sorting":
        setStage("congrats");
        break;
      case "congrats":
        onEnded();
        break;
      default:
        break;
    }
  };

  const videoSources = {
    intro: `/video/alex-intro-${round}.mp4`,
    stats: `/video/alex-react-${round}.mp4`,
    comment: `/video/alex-comment-${round}.mp4`,
    sorting: `/video/alex-sorting-${round}.mp4`,
    congrats: `/video/alex-congrats-${round}.mp4`,
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      <AlexVideoPlayer
        src={videoSources[stage]}
        onEnded={handleNextStage}
        autoPlay
      />
    </div>
  );
}

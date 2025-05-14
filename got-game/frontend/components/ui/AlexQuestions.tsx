"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AlexVideoPlayer from "@/components/ui/AlexVideoPlayer";
import StatMapTransition from "@/components/ui/StatMapTransition"; // ← Add this import
import { questions } from "@/lib/questions";

interface AlexQuestionsProps {
  round: number;
  onEnded: () => void;
}

export default function AlexQuestions({ round, onEnded }: AlexQuestionsProps) {
  const router = useRouter();
  const currentQuestion = questions[round - 1];

  const [stage, setStage] = useState<
    "intro" | "stats" | "statMapTransition" | "comment" | "sorting" | "congrats"
  >("intro");

  useEffect(() => {
    if (!currentQuestion) {
      router.push("/");
      return;
    }
  }, [currentQuestion, router]);

  const handleNextStage = () => {
    if (stage === "intro") {
      setStage("stats");
    } else if (stage === "stats") {
      // 🔁 Show transition video instead of navigating right away
      setStage("statMapTransition");
    } else if (stage === "statMapTransition") {
      router.push(`/stats/${round}`);
    } else if (stage === "comment") {
      setStage("sorting");
    } else if (stage === "sorting") {
      setStage("congrats");
    } else if (stage === "congrats") {
      onEnded();
    }
  };

  const videoSources = {
    intro: currentQuestion.introUrl || `/video/alex-intro-${round}.mp4`,
    stats: currentQuestion.reactionUrl || `/video/alex-react-${round}.mp4`,
    comment: currentQuestion.statsCommentUrl || `/video/alex-comment-${round}.mp4`,
    sorting: currentQuestion.sortingUrl || `/video/alex-sorting-${round}.mp4`,
    congrats: currentQuestion.congratsUrl || `/video/alex-congrats-${round}.mp4`,
  };

  const currentVideo = videoSources[stage as keyof typeof videoSources];

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      {stage === "statMapTransition" ? (
        <StatMapTransition onEnd={handleNextStage} />
      ) : currentVideo ? (
        <AlexVideoPlayer
          src={currentVideo}
          onEnded={handleNextStage}
          autoPlay
        />
      ) : (
        <p className="text-white text-xl">Loading video...</p>
      )}
    </div>
  );
}

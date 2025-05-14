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

  const [stage, setStage] = useState<"intro" | "stats" | "comment" | "sorting" | "congrats">("intro");

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
      // ✅ Redirect to the stat map page after "Let's see the stats!" video
      router.push(`/stats/${round}`);
    } else if (stage === "comment") {
      setStage("sorting");
    } else if (stage === "sorting") {
      setStage("congrats");
    } else if (stage === "congrats") {
      onEnded(); // Final callback
    }
  };

  const videoSources = {
    intro: currentQuestion.introUrl || `/video/alex-intro-${round}.mp4`,
    stats: currentQuestion.reactionUrl || `/video/alex-react-${round}.mp4`,
    comment: currentQuestion.statsCommentUrl || `/video/alex-comment-${round}.mp4`,
    sorting: currentQuestion.sortingUrl || `/video/alex-sorting-${round}.mp4`,
    congrats: currentQuestion.congratsUrl || `/video/alex-congrats-${round}.mp4`,
  };

  const currentVideo = videoSources[stage];

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      {currentVideo ? (
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

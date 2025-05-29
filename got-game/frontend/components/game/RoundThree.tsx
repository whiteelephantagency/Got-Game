"use client";

import { useEffect, useState } from "react";
import AlexVideoPlayer from "@/components/ui/AlexVideoPlayer";
import StatMap from "@/components/ui/StatMap";
import { rounds } from "@/lib/round";

export default function Round3() {
  const [stage, setStage] = useState("video1");
  const [progress, setProgress] = useState(0);
  const [showFinalSplit, setShowFinalSplit] = useState(false);
  const round = rounds[2];

  const handleNext = () => {
    if (stage === "video1") {
      setStage("question");
    } else if (stage === "question") {
      setStage("video2");
    } else if (stage === "video2") {
      setStage("stats1");
    } else if (stage === "stats1") {
      setStage("video3");
    } else if (stage === "video3") {
      setStage("lucky-draw");
    }
  };

  if (stage === "lucky-draw") {
    window.location.href = "/lucky-draw?round=3&comeback=true";
    return null;
  }

  return (
    <main className="min-h-screen bg-black text-white p-4">
      {stage === "video1" && (
        <AlexVideoPlayer src="/video/round3-video1.mp4" onEnded={handleNext} />
      )}

      {stage === "question" && (
        <div className="text-center mt-10">
          <h2 className="text-2xl font-bold mb-4">ROUND 3 QUESTION</h2>
          <p className="text-lg mb-6">Who painted the Mona Lisa?</p>
          <div className="grid grid-cols-2 gap-4 max-w-xl mx-auto">
            <button className="bg-purple-600 p-4 rounded-lg text-left" disabled>
              A. Vincent van Gogh
            </button>
            <button className="bg-purple-600 p-4 rounded-lg text-left" disabled>
              B. Pablo Picasso
            </button>
            <button className="bg-purple-600 p-4 rounded-lg text-left" disabled>
              C. Michelangelo
            </button>
            <button
              className="bg-purple-600 p-4 rounded-lg text-left"
              disabled
            >
              D. Leonardo da Vinci
            </button>
          </div>
        </div>
      )}

      {stage === "video2" && (
        <AlexVideoPlayer src="/video/round3-video2.mp4" onEnded={handleNext} />
      )}

      {stage === "stats1" && (
        <StatMap
          total={3}
          safe={10}
          progress={3}
          showFinalSplit={true}
          onComplete={handleNext}
        />
      )}

      {stage === "video3" && (
        <AlexVideoPlayer src="/video/round3-video3.mp4" onEnded={handleNext} />
      )}
    </main>
  );
}

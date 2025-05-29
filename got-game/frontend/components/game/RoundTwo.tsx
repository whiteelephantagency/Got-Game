"use client";

import { useEffect, useState } from "react";
import AlexVideoPlayer from "@/components/ui/AlexVideoPlayer";
import StatMap from "@/components/ui/StatMap";
import { rounds } from "@/lib/round";

export default function Round2() {
  const [stage, setStage] = useState("video1");
  const [progress, setProgress] = useState(0);
  const [showFinalSplit, setShowFinalSplit] = useState(false);
  const round = rounds[1];

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
      setShowFinalSplit(true);
      setStage("stats2");
    } else if (stage === "stats2") {
      setStage("video4");
    } else if (stage === "video4") {
      setStage("stats3");
    } else if (stage === "stats3") {
      setStage("video5");
    } else if (stage === "video5") {
      setStage("lucky-draw");
    }
  };

  if (stage === "lucky-draw") {
    window.location.href = "/lucky-draw?round=2";
    return null;
  }

  return (
    <main className="min-h-screen bg-black text-white p-4">
      {stage === "video1" && (
        <AlexVideoPlayer src="/video/round2-video1.mp4" onEnded={handleNext} />
      )}

      {stage === "question" && (
        <div className="text-center mt-10">
          <h2 className="text-2xl font-bold mb-4">ROUND 2 QUESTION</h2>
          <p className="text-lg mb-6">Where was Shin Lim, AGT Season 13 Winner, born?</p>
          <div className="grid grid-cols-2 gap-4 max-w-xl mx-auto">
            <button className="bg-purple-600 p-4 rounded-lg text-left" disabled>
              A. Acton, Massachusetts
            </button>
            <button className="bg-purple-600 p-4 rounded-lg text-left" disabled>
              B. Seoul, South Korea
            </button>
            <button className="bg-purple-600 p-4 rounded-lg text-left" disabled>
              C. Singapore
            </button>
            <button
              className="bg-purple-600 p-4 rounded-lg text-left hover:bg-purple-700"
              onClick={handleNext}
            >
              D. Vancouver, British Columbia
            </button>
          </div>
        </div>
      )}

      {stage === "video2" && (
        <AlexVideoPlayer src="/video/round2-video2.mp4" onEnded={handleNext} />
      )}

      {stage === "stats1" && (
        <StatMap
          total={800}
          safe={100}
          progress={800}
          onComplete={handleNext}
        />
      )}

      {stage === "video3" && (
        <AlexVideoPlayer src="/video/round2-video3.mp4" onEnded={handleNext} />
      )}

      {stage === "stats2" && (
        <StatMap
          total={100}
          safe={80}
          progress={100}
          showFinalSplit={true}
          onComplete={handleNext}
        />
      )}

      {stage === "video4" && (
        <AlexVideoPlayer src="/video/round2-video4.mp4" onEnded={handleNext} />
      )}

      {stage === "stats3" && (
        <StatMap
          total={80}
          safe={100}
          progress={20}
          showFinalSplit={true}
          onComplete={handleNext}
        />
      )}

      {stage === "video5" && (
        <AlexVideoPlayer src="/video/round2-video5.mp4" onEnded={handleNext} />
      )}
    </main>
  );
}

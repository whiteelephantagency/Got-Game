"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AlexVideoPlayer from "@/components/ui/AlexVideoPlayer";
import StatMap from "@/components/ui/StatMap";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";
import ChatBox from "@/components/ui/ChatBot";

const QUESTION_1 = {
  question: "Which 70's rock band performed the original version of this song?",
  options: ["The Who", "Chicago", "Journey", "The Eagles"],
  correctAnswer: "Journey",
};

export default function RoundOnePage() {
  const router = useRouter();
  const [stage, setStage] = useState("intro");
  const [selected, setSelected] = useState<string | null>(null);
  const [lockOptions, setLockOptions] = useState(false);
  const [statProgress, setStatProgress] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (stage === "roundStats") {
      let filled = 0;
      interval = setInterval(() => {
        filled++;
        setStatProgress(filled);
        if (filled >= 1470) {
          clearInterval(interval);
          setStage("roundStatsEnd");
        }
      }, 10);
    } else if (stage === "finalStats") {
      let filled = 0;
      interval = setInterval(() => {
        filled++;
        setStatProgress(filled);
        if (filled >= 1000) {
          clearInterval(interval);
          setStage("finalStatsEnd");
        }
      }, 10);
    }
    return () => clearInterval(interval);
  }, [stage]);

  const handleVideoEnd = () => {
    console.log("Video ended, current stage:", stage);
    if (stage === "intro") setStage("question");
    else if (stage === "answerReaction") setStage("roundStats");
    else if (stage === "roundStatsEnd") setStage("finalStats");
    else if (stage === "finalStatsEnd") setStage("sorting");
    else if (stage === "sorting") setStage("wrap");
    else if (stage === "wrap") router.push("/game/2");
  };

  const handleAnswer = (option: string) => {
    if (lockOptions || option !== QUESTION_1.correctAnswer) return;
    setSelected(option);
    setLockOptions(true);
    setTimeout(() => setStage("answerReaction"), 500);
  };

  return (
    <main className="min-h-screen bg-black text-white flex flex-col relative">
      {/* Right sidebar - Game Stats and Chat */}
      <div className="absolute top-6 right-6 z-20 w-80 space-y-0">
        <div className="h-[200px] rounded-xl overflow-hidden bg-[#1c0f32]/70 border border-purple-500 shadow-md flex flex-col justify-center items-center">
          {(stage === "roundStats" || stage === "finalStats") ? (
            <StatMap
              total={1470}
              safe={1000}
              progress={statProgress}
              label={stage === "roundStats" ? "1470" : "1000"}
              showFinalSplit={stage === "finalStats"}
            />
          ) : (
            <div className="p-4 text-center">
              <h3 className="text-lg font-bold">GAME STATS</h3>
              <p className="text-sm text-purple-200">Waiting for stats...</p>
            </div>
          )}
        </div>
        <div className="h-[calc(100vh-250px)] rounded-xl overflow-hidden">
          <ChatBox />
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col items-start justify-start px-4 pt-6 pb-10 pr-96">
        {/* Video Player Section - Bigger size with proper containment */}
        <div className="relative z-10 w-full max-w-4xl">
          <div className="border border-purple-500 rounded-xl p-4 bg-[#1c0f32]/30">
            <div className="w-full h-96 rounded-lg overflow-hidden">
              <AlexVideoPlayer
                src={
                  stage === "intro"
                    ? "/video/alex-intro-1.mp4"
                    : stage === "answerReaction"
                    ? "/video/alex-question1-part2.mp3"
                    : stage === "roundStatsEnd"
                    ? "/video/alex-question1-part3.mp3"
                    : stage === "sorting"
                    ? "/video/alex-sorting-1.mp4"
                    : stage === "wrap"
                    ? "/video/alex-congrats-1.mp4"
                    : "/video/standby.mp4"
                }
                onEnded={handleVideoEnd}
                autoPlay
                key={`${stage}-${Date.now()}`}
              />
              {/* Debug info for video stages */}
              <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                Stage: {stage}
              </div>
            </div>
          </div>
        </div>

        {/* Question Section - Separate bordered area */}
        {stage === "question" && (
          <div className="mt-6 w-full max-w-4xl">
            <div className="border border-purple-500 rounded-xl p-6 bg-[#1c0f32]/20">
              <h2 className="text-white text-2xl font-bold mb-4">QUESTION 1</h2>
              <p className="text-white text-xl mb-6">{QUESTION_1.question}</p>
              <div className="grid grid-cols-2 gap-4">
                {QUESTION_1.options.map((opt, idx) => (
                  <Button
                    key={opt}
                    className={`h-16 text-lg font-semibold transition-all duration-300 rounded-lg px-6 flex justify-between items-center
                      ${
                        selected === opt
                          ? opt === QUESTION_1.correctAnswer
                            ? "bg-green-600"
                            : "bg-red-600"
                          : opt === QUESTION_1.correctAnswer
                          ? "bg-purple-700 hover:bg-purple-800 ring-2 ring-purple-400"
                          : "bg-gray-600 cursor-not-allowed opacity-50"
                      }`}
                    disabled={lockOptions || opt !== QUESTION_1.correctAnswer}
                    onClick={() => handleAnswer(opt)}
                  >
                    <span>
                      {String.fromCharCode(65 + idx)}. {opt}
                    </span>
                    {lockOptions && opt === QUESTION_1.correctAnswer && <CheckCircle className="ml-2" />}
                    {lockOptions && selected === opt && opt !== QUESTION_1.correctAnswer && <XCircle className="ml-2" />}
                  </Button>
                ))}
              </div>
              <div className="mt-4 text-center text-purple-300 text-sm">
                {!lockOptions && "Only the correct answer is selectable"}
                {lockOptions && selected === QUESTION_1.correctAnswer && "Correct! Moving to next stage..."}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
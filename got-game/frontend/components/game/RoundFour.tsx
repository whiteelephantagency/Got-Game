"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AlexVideoPlayer from "@/components/ui/AlexVideoPlayer";
import StatMap from "@/components/ui/StatMap";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";
import ChatBox from "@/components/ui/ChatBot";

const QUESTION_4 = {
  question: "What is the largest ocean on Earth?",
  options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
  correctAnswer: "Pacific Ocean",
};

export default function Round4Page() {
  const router = useRouter();
  const [stage, setStage] = useState("intro");
  const [selected, setSelected] = useState<string | null>(null);
  const [lockOptions, setLockOptions] = useState(false);
  const [statProgress, setStatProgress] = useState(0);
  const [timer, setTimer] = useState(15);
  const [timerActive, setTimerActive] = useState(false);

  // Timer effect for question stage
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (stage === "question" && timerActive && timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            setTimerActive(false);
            setStage("finalStats");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [stage, timerActive, timer]);

  // Stats animation effect
  useEffect(() => {
    if (stage === "finalStats") {
      let filled = 0;
      const interval = setInterval(() => {
        filled++;
        setStatProgress(filled);
        if (filled >= 1) {
          clearInterval(interval);
          setStage("alexVideoPart2");
        }
      }, 1000); // Slower animation to show only 1 player correct
      return () => clearInterval(interval);
    }
  }, [stage]);

  const handleVideoEnd = () => {
    if (stage === "intro") {
      setStage("question");
      setTimerActive(true);
    }
    else if (stage === "alexVideoPart2") {
      // End of Round 4 - navigate to Round 5
      router.push("/game/5");
    }
  };

  const handleAnswer = (option: string) => {
    if (lockOptions || option !== QUESTION_4.correctAnswer) return;
    setSelected(option);
    setLockOptions(true);
    setTimerActive(false); // Stop timer when answered correctly
    setTimeout(() => setStage("finalStats"), 1000);
  };

  // Auto-start timer when question appears
  useEffect(() => {
    if (stage === "question") {
      setTimerActive(true);
    }
  }, [stage]);

  return (
    <main className="min-h-screen bg-black text-white flex flex-col relative">
      {/* Right sidebar - Game Stats and Chat */}
      <div className="absolute top-6 right-6 z-20 w-80 space-y-0">
        <div className="h-[200px] rounded-xl overflow-hidden bg-[#1c0f32]/70 border border-purple-500 shadow-md flex flex-col justify-center items-center">
          {stage === "finalStats" ? (
            <StatMap
              total={1}
              safe={1}
              progress={statProgress}
              label="Only you got it correct!"
              showFinalSplit={false}
            />
          ) : (
            <div className="p-4 text-center">
              <h3 className="text-lg font-bold">GAME STATS</h3>
              <p className="text-sm text-purple-200">
                {stage === "question" ? `⏰ Timer: ${timer}s` : 
                 stage === "finalStats" ? "You're the only winner!" :
                 stage === "alexVideoPart2" ? "Congratulations!" :
                 "Round 4 - Final Challenge"}
              </p>
            </div>
          )}
        </div>
        <div className="h-[calc(100vh-250px)] rounded-xl overflow-hidden">
          <ChatBox />
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col items-start justify-start px-4 pt-6 pb-10 pr-96">
        {/* Video Player Section */}
        <div className="relative z-10 w-full max-w-4xl">
          <div className="border border-purple-500 rounded-xl p-4 bg-[#1c0f32]/30">
            <div className="w-full h-96 rounded-lg overflow-hidden">
              {(stage === "intro" || stage === "alexVideoPart2") && (
                <AlexVideoPlayer
                  src={
                    stage === "intro"
                      ? "/video/round4-intro.mp4"
                      : "/video/round4-video2.mp4"
                  }
                  onEnded={handleVideoEnd}
                  autoPlay
                  key={stage}
                />
              )}
            </div>
          </div>
        </div>

        {/* Question Section */}
        {stage === "question" && (
          <div className="mt-6 w-full max-w-4xl">
            <div className="border border-purple-500 rounded-xl p-6 bg-[#1c0f32]/20">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-white text-2xl font-bold">ROUND 4 QUESTION</h2>
                <div className="text-red-400 text-xl font-bold">
                  ⏰ {timer}s
                </div>
              </div>
              <p className="text-white text-xl mb-6">{QUESTION_4.question}</p>
              <div className="grid grid-cols-2 gap-4">
                {QUESTION_4.options.map((opt, idx) => (
                  <Button
                    key={opt}
                    className={`h-16 text-lg font-semibold transition-all duration-300 rounded-lg px-6 flex justify-between items-center
                      ${
                        selected === opt
                          ? opt === QUESTION_4.correctAnswer
                            ? "bg-green-600"
                            : "bg-red-600"
                          : opt === QUESTION_4.correctAnswer
                          ? "bg-purple-700 hover:bg-purple-800 ring-2 ring-purple-400"
                          : "bg-gray-600 cursor-not-allowed opacity-50"
                      }`}
                    disabled={lockOptions || opt !== QUESTION_4.correctAnswer || timer === 0}
                    onClick={() => handleAnswer(opt)}
                  >
                    <span>
                      {String.fromCharCode(65 + idx)}. {opt}
                    </span>
                    {lockOptions && opt === QUESTION_4.correctAnswer && <CheckCircle className="ml-2" />}
                    {lockOptions && selected === opt && opt !== QUESTION_4.correctAnswer && <XCircle className="ml-2" />}
                  </Button>
                ))}
              </div>
              <div className="mt-4 text-center text-purple-300 text-sm">
                {!lockOptions && timer > 0 && "Only the correct answer is clickable"}
                {!lockOptions && timer === 0 && "Time's up! Moving to results..."}
                {lockOptions && selected === QUESTION_4.correctAnswer && "Correct! You're the winner!"}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
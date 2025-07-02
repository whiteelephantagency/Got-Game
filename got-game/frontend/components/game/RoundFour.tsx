"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AlexVideoPlayer from "@/components/ui/AlexVideoPlayer";
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
  const [timer, setTimer] = useState(15);
  const [timerActive, setTimerActive] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (stage === "question" && timerActive && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            setTimerActive(false);
            setSelected(QUESTION_4.correctAnswer);
            setLockOptions(true);
            setTimeout(() => setStage("alexVideoPart2"), 1000);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [stage, timerActive, timer]);

  const handleVideoEnd = () => {
    if (stage === "intro") {
      setStage("question");
      setTimerActive(true);
    } else if (stage === "alexVideoPart2") {
      router.push("/game/5");
    }
  };

  const handleAnswer = (option: string) => {
    if (lockOptions || option !== QUESTION_4.correctAnswer) return;
    setSelected(option);
    setLockOptions(true);
    setTimerActive(false);
    setTimeout(() => setStage("alexVideoPart2"), 1000);
  };

  useEffect(() => {
    if (stage === "question") {
      setTimerActive(true);
    }
  }, [stage]);

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Top Header */}
      <div className="w-full bg-gradient-to-r from-purple-700 via-indigo-700 to-purple-900 p-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <h1 className="text-2xl font-bold text-white">ROUND 4</h1>
            <div className="text-purple-100">
              {stage === "question"
                ? "One last question before the final!"
                : stage === "alexVideoPart2"
                ? "Finalist Confirmed!"
                : "Ready for your next challenge?"}
            </div>
          </div>
          <div className="flex items-center space-x-4 text-sm">
            <div className="bg-black/30 px-3 py-1 rounded">PLAYERS: 1</div>
            <div className="bg-black/30 px-3 py-1 rounded">PRIZE: Final Spot</div>
            <div className="bg-purple-500/20 px-3 py-1 rounded text-purple-300">ROUND 4</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-12 gap-6 h-[calc(100vh-120px)]">
          {/* Left Column */}
          <div className="col-span-8 space-y-6">
            {/* Video Section */}
            <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-purple-500/50 overflow-hidden shadow-2xl">
              <div className="bg-gradient-to-r from-purple-600/20 to-indigo-600/20 px-4 py-2 border-b border-purple-500/30">
                <h2 className="text-lg font-semibold text-white">Alex - Your Host</h2>
              </div>
              <div className="p-4">
                <div className="w-full h-80 rounded-xl overflow-hidden bg-black">
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

            {/* Question Block */}
            {stage === "question" && (
              <div className="bg-gradient-to-br from-indigo-900/30 to-purple-900/30 rounded-2xl border border-purple-400/50 shadow-xl">
                <div className="bg-gradient-to-r from-purple-500/30 to-indigo-500/30 px-6 py-4 border-b border-purple-400/30 flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-white">ONE LAST STEP</h2>
                  <div className="text-red-400 text-xl font-bold flex items-center">
                    ⏰ {timer}s
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-xl text-white mb-6 leading-relaxed">
                    {QUESTION_4.question}
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    {QUESTION_4.options.map((opt, idx) => (
                      <Button
                        key={opt}
                        className={`h-16 text-lg font-semibold transition-all duration-300 rounded-xl px-6 flex justify-between items-center
                          ${
                            selected === opt
                              ? opt === QUESTION_4.correctAnswer
                                ? "bg-green-600 shadow-lg shadow-green-500/50"
                                : "bg-red-600 shadow-lg shadow-red-500/50"
                              : opt === QUESTION_4.correctAnswer
                              ? "bg-purple-700 hover:bg-purple-800 ring-2 ring-purple-400"
                              : "bg-gray-600 cursor-not-allowed opacity-50"
                          }`}
                        disabled={
                          lockOptions || opt !== QUESTION_4.correctAnswer || timer === 0
                        }
                        onClick={() => handleAnswer(opt)}
                      >
                        <span>
                          {String.fromCharCode(65 + idx)}. {opt}
                        </span>
                        {lockOptions && opt === QUESTION_4.correctAnswer && (
                          <CheckCircle className="ml-2" />
                        )}
                        {lockOptions &&
                          selected === opt &&
                          opt !== QUESTION_4.correctAnswer && <XCircle className="ml-2" />}
                      </Button>
                    ))}
                  </div>
                  <div className="mt-4 text-center text-purple-300 text-sm">
                    {!lockOptions && timer > 0 && "Only the correct answer is clickable"}
                    {!lockOptions && timer === 0 && "Time's up! Advancing..."}
                    {lockOptions &&
                      selected === QUESTION_4.correctAnswer &&
                      "Correct! Advancing to the final!"}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="col-span-4 space-y-6">
            {/* Highscore Panel */}
            <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-purple-500/50 overflow-hidden shadow-2xl">
              <div className="bg-gradient-to-r from-purple-600/30 to-indigo-600/30 px-4 py-3 border-b border-purple-500/30">
                <h3 className="text-lg font-bold text-white">🏆 FINALISTS</h3>
              </div>
              <div className="p-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-2 bg-purple-900/30 rounded-lg border border-purple-400/30">
                    <span className="text-purple-300 font-bold">YOU</span>
                    <span className="text-purple-200">QUALIFIED</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-800/50 rounded-lg">
                    <span className="text-gray-300">OtherPlayer1</span>
                    <span className="text-gray-400">Pending</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Chat Box */}
            <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-purple-500/50 overflow-hidden shadow-2xl flex-1">
              <div className="bg-gradient-to-r from-purple-600/30 to-indigo-600/30 px-4 py-3 border-b border-purple-500/30">
                <h3 className="text-lg font-bold text-white flex items-center">
                  LIVE CHAT
                  <span className="ml-2 w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                </h3>
              </div>
              <div className="h-96">
                <ChatBox />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

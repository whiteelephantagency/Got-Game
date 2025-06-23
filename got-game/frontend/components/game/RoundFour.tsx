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
  const [playerName, setPlayerName] = useState("Player");

  // Get player name from localStorage
  useEffect(() => {
    const name = localStorage.getItem("playerName") || "Player";
    setPlayerName(name);
  }, []);

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

  // Determine if we should show question (affects layout)
  const showQuestion = stage === "question";
  
  // Determine if this is an audio-only stage (none in Round 4)
  const isAudioStage = false;

  return (
    <main className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* 3D Starfield Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="stars-container">
          {[...Array(200)].map((_, i) => (
            <div
              key={i}
              className="star"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        .stars-container {
          position: absolute;
          width: 100%;
          height: 100%;
          perspective: 1000px;
        }
        .star {
          position: absolute;
          width: 2px;
          height: 2px;
          background: white;
          border-radius: 50%;
          animation: twinkle linear infinite;
        }
        .star:nth-child(4n) {
          background: #a855f7;
          box-shadow: 0 0 6px #a855f7;
        }
        .star:nth-child(4n+1) {
          background: #6366f1;
          box-shadow: 0 0 6px #6366f1;
        }
        .star:nth-child(4n+2) {
          background: #fbbf24;
          box-shadow: 0 0 6px #fbbf24;
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0; transform: scale(0.5); }
          50% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>

      {/* Enhanced Top Header */}
      <div className="w-full bg-gradient-to-r from-purple-700 via-indigo-700 to-purple-900 p-6 shadow-2xl backdrop-blur-sm border-b border-purple-400/30 relative z-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-8">
            {/* GOT GAME Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center font-bold text-black text-xl shadow-lg">
                G
              </div>
              <div className="text-2xl font-bold text-white tracking-wider">GOT GAME</div>
            </div>
            <div className="h-8 w-px bg-white/30"></div>
            <h1 className="text-3xl font-bold text-white">🏁 ROUND 4</h1>
            <div className="text-purple-100 text-lg font-medium">
              {stage === "question"
                ? `⏰ ${playerName}'s Final Challenge! (${timer}s)`
                : stage === "alexVideoPart2"
                ? `🎉 ${playerName} Confirmed as Finalist!`
                : `🚀 ${playerName} ready for the final challenge?`}
            </div>
          </div>
          <div className="flex items-center space-x-6 text-lg font-semibold">
            <div className="bg-black/40 px-4 py-2 rounded-xl backdrop-blur-sm border border-white/20">
              👤 PLAYER: {playerName}
            </div>
            <div className="bg-black/40 px-4 py-2 rounded-xl backdrop-blur-sm border border-white/20">
              🏆 PRIZE: Final Spot
            </div>
            <div className="bg-purple-500/30 px-4 py-2 rounded-xl text-purple-200 backdrop-blur-sm border border-purple-400/40">
              🏁 ROUND 4
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6 relative z-10">
        <div className={`grid ${showQuestion ? 'grid-cols-10' : 'grid-cols-12'} gap-6 h-[calc(100vh-140px)]`}>
          
          {/* Left Column */}
          <div className={`${showQuestion ? 'col-span-6' : 'col-span-8'} space-y-6`}>
            
            {/* Alex Video Section */}
            <div className="bg-gradient-to-br from-gray-900/80 to-black/80 rounded-2xl border border-purple-500/50 overflow-hidden shadow-2xl backdrop-blur-sm">
              <div className="bg-gradient-to-r from-purple-600/30 to-indigo-600/30 px-6 py-3 border-b border-purple-500/30 backdrop-blur-sm">
                <h2 className="text-xl font-bold text-white">🎤 Alex - Your Host</h2>
              </div>
              <div className="p-6">
                <div className={`w-full ${showQuestion ? 'h-64' : 'h-96'} rounded-xl overflow-hidden bg-black transition-all duration-500`}>
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
              <div className="bg-gradient-to-br from-indigo-900/80 to-purple-900/80 rounded-2xl border border-purple-400/50 shadow-2xl backdrop-blur-sm">
                <div className="bg-gradient-to-r from-purple-500/40 to-indigo-500/40 px-6 py-4 border-b border-purple-400/30 flex justify-between items-center backdrop-blur-sm">
                  <h2 className="text-2xl font-bold text-white">🏁 ONE LAST STEP</h2>
                  <div className="text-amber-400 text-2xl font-bold flex items-center animate-pulse">
                    ⏰ {timer}s
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-xl text-white mb-6 leading-relaxed font-medium">
                    {QUESTION_4.question}
                  </p>
                  <div className="grid grid-cols-1 gap-4">
                    {QUESTION_4.options.map((opt, idx) => (
                      <Button
                        key={opt}
                        className={`h-16 text-lg font-semibold transition-all duration-500 rounded-xl px-6 flex justify-between items-center transform hover:scale-105
                          ${
                            selected === opt
                              ? opt === QUESTION_4.correctAnswer
                                ? "bg-green-600 shadow-xl shadow-green-500/50 ring-4 ring-green-400 scale-105"
                                : "bg-red-600 shadow-xl shadow-red-500/50 ring-4 ring-red-400 scale-105"
                              : opt === QUESTION_4.correctAnswer
                              ? "bg-purple-700 hover:bg-purple-600 ring-2 ring-purple-400 shadow-lg hover:shadow-purple-500/50 animate-pulse"
                              : "bg-gray-600/50 cursor-not-allowed opacity-40"
                          }`}
                        disabled={
                          lockOptions || opt !== QUESTION_4.correctAnswer || timer === 0
                        }
                        onClick={() => handleAnswer(opt)}
                      >
                        <span className="flex items-center">
                          <span className="bg-white/20 w-8 h-8 rounded-full flex items-center justify-center mr-3 font-bold">
                            {String.fromCharCode(65 + idx)}
                          </span>
                          {opt}
                        </span>
                        {lockOptions && opt === QUESTION_4.correctAnswer && (
                          <CheckCircle className="ml-2 text-green-300" size={24} />
                        )}
                        {lockOptions &&
                          selected === opt &&
                          opt !== QUESTION_4.correctAnswer && <XCircle className="ml-2 text-red-300" size={24} />}
                      </Button>
                    ))}
                  </div>
                  <div className="mt-6 text-center text-purple-300 text-lg font-medium">
                    {!lockOptions && timer > 0 && "✨ Only the correct answer is clickable - find it!"}
                    {!lockOptions && timer === 0 && "⏰ Time's up! Auto-advancing..."}
                    {lockOptions &&
                      selected === QUESTION_4.correctAnswer &&
                      `🎉 Correct! ${playerName} is advancing to the final!`}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column */}
          {showQuestion && (
            <div className="col-span-4 space-y-6">
              
              {/* Finalists Panel */}
              <div className="bg-gradient-to-br from-gray-900/80 to-black/80 rounded-2xl border border-purple-500/50 overflow-hidden shadow-2xl backdrop-blur-sm">
                <div className="bg-gradient-to-r from-purple-600/40 to-indigo-600/40 px-4 py-3 border-b border-purple-500/30 backdrop-blur-sm">
                  <h3 className="text-lg font-bold text-white">🏆 FINALISTS</h3>
                </div>
                <div className="p-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-purple-900/40 rounded-xl border border-purple-400/40 backdrop-blur-sm">
                      <span className="text-purple-200 font-bold text-lg">{playerName}</span>
                      <span className="text-green-400 font-semibold">✅ QUALIFIED</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-800/40 rounded-xl border border-gray-600/30">
                      <span className="text-gray-300">OtherPlayer1</span>
                      <span className="text-amber-400">⏳ Pending</span>
                    </div>
                    <div className="text-center mt-4 p-3 bg-indigo-900/30 rounded-xl">
                      <div className="text-sm text-indigo-300">Final Round</div>
                      <div className="text-lg font-bold text-white">Coming Soon!</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Live Chat */}
              <div className="bg-gradient-to-br from-gray-900/80 to-black/80 rounded-2xl border border-purple-500/50 overflow-hidden shadow-2xl backdrop-blur-sm flex-1">
                <div className="bg-gradient-to-r from-purple-600/40 to-indigo-600/40 px-4 py-3 border-b border-purple-500/30 backdrop-blur-sm">
                  <h3 className="text-lg font-bold text-white flex items-center">
                    💬 LIVE CHAT
                    <span className="ml-2 w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  </h3>
                </div>
                <div className="h-80">
                  <ChatBox />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
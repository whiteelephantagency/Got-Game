"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AlexVideoPlayer from "@/components/ui/AlexVideoPlayer";
import StatMap from "@/components/ui/StatMap";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";
import ChatBox from "@/components/ui/ChatBot";

const QUESTION_5 = {
  question: "Which element has the chemical symbol 'O'?",
  options: ["Gold", "Oxygen", "Osmium", "Oganesson"],
  correctAnswer: "Oxygen",
};

export default function Round5Page() {
  const router = useRouter();
  const [stage, setStage] = useState("intro");
  const [selected, setSelected] = useState<string | null>(null);
  const [lockOptions, setLockOptions] = useState(false);
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
            // Time's up - player wins anyway since only correct answer is clickable
            setSelected(QUESTION_5.correctAnswer);
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
    }
    else if (stage === "alexVideoPart2") {
      setStage("congratulations");
    }
  };

  const handleAnswer = (option: string) => {
    if (lockOptions || option !== QUESTION_5.correctAnswer) return;
    setSelected(option);
    setLockOptions(true);
    setTimerActive(false); // Stop timer when answered
    setTimeout(() => setStage("alexVideoPart2"), 1000);
  };

  // Auto-start timer when question appears
  useEffect(() => {
    if (stage === "question") {
      setTimerActive(true);
    }
  }, [stage]);

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Top Game Header */}
      <div className="w-full bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600 p-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <h1 className="text-2xl font-bold text-white">FINAL ROUND</h1>
            <div className="text-yellow-100">
              {stage === "question" ? "Final Question!" : 
               stage === "alexVideoPart2" ? "You Won!" :
               stage === "congratulations" ? "CHAMPION!" :
               "The Ultimate Challenge"}
            </div>
          </div>
          <div className="flex items-center space-x-4 text-sm">
            <div className="bg-black/30 px-3 py-1 rounded">PLAYERS: 1</div>
            <div className="bg-black/30 px-3 py-1 rounded">PRIZE: $10,000</div>
            <div className="bg-green-500/20 px-3 py-1 rounded text-green-300">FINAL</div>
          </div>
        </div>
      </div>

      {/* Main Game Area */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-12 gap-6 h-[calc(100vh-120px)]">
          
          {/* Left Column - Main Content */}
          <div className="col-span-8 space-y-6">
            
            {/* Alex Video Section */}
            <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-yellow-500/50 overflow-hidden shadow-2xl">
              <div className="bg-gradient-to-r from-yellow-600/20 to-orange-600/20 px-4 py-2 border-b border-yellow-500/30">
                <h2 className="text-lg font-semibold text-white">Alex - Your Host</h2>
              </div>
              <div className="p-4">
                <div className="w-full h-80 rounded-xl overflow-hidden bg-black">
                  {(stage === "intro" || stage === "alexVideoPart2") && (
                    <AlexVideoPlayer
                      src={
                        stage === "intro"
                          ? "/video/round5-intro.mp4"
                          : "/video/round5-win.mp4"
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
              <div className="bg-gradient-to-br from-yellow-900/30 to-orange-900/30 rounded-2xl border border-yellow-400/50 shadow-xl">
                <div className="bg-gradient-to-r from-yellow-500/30 to-orange-500/30 px-6 py-4 border-b border-yellow-400/30 flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-white">FINAL QUESTION</h2>
                  <div className="text-red-400 text-xl font-bold flex items-center">
                    ⏰ {timer}s
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-xl text-white mb-6 leading-relaxed">{QUESTION_5.question}</p>
                  <div className="grid grid-cols-2 gap-4">
                    {QUESTION_5.options.map((opt, idx) => (
                      <Button
                        key={opt}
                        className={`h-16 text-lg font-semibold transition-all duration-300 rounded-xl px-6 flex justify-between items-center
                          ${
                            selected === opt
                              ? opt === QUESTION_5.correctAnswer
                                ? "bg-green-600 shadow-lg shadow-green-500/50"
                                : "bg-red-600 shadow-lg shadow-red-500/50"
                              : opt === QUESTION_5.correctAnswer
                              ? "bg-yellow-700 hover:bg-yellow-600 ring-2 ring-yellow-400 shadow-lg hover:shadow-yellow-500/50"
                              : "bg-gray-600 cursor-not-allowed opacity-50"
                          }`}
                        disabled={lockOptions || opt !== QUESTION_5.correctAnswer || timer === 0}
                        onClick={() => handleAnswer(opt)}
                      >
                        <span>
                          {String.fromCharCode(65 + idx)}. {opt}
                        </span>
                        {lockOptions && opt === QUESTION_5.correctAnswer && <CheckCircle className="ml-2" />}
                        {lockOptions && selected === opt && opt !== QUESTION_5.correctAnswer && <XCircle className="ml-2" />}
                      </Button>
                    ))}
                  </div>
                  <div className="mt-4 text-center text-yellow-300 text-sm">
                    {!lockOptions && timer > 0 && "Only the correct answer is clickable - Win the game!"}
                    {!lockOptions && timer === 0 && "You Win! Moving to celebration..."}
                    {lockOptions && selected === QUESTION_5.correctAnswer && "CORRECT! YOU'RE THE CHAMPION!"}
                  </div>
                </div>
              </div>
            )}

            {/* Congratulations Screen */}
            {stage === "congratulations" && (
              <div className="bg-gradient-to-br from-yellow-600/20 to-orange-600/20 rounded-2xl border border-yellow-400/50 shadow-xl overflow-hidden">
                <div className="relative p-8 text-center">
                  {/* Confetti Animation */}
                  <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {Array.from({ length: 50 }).map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-2 h-2 bg-yellow-400 rounded-full animate-bounce"
                        style={{
                          left: `${Math.random() * 100}%`,
                          top: `${Math.random() * 100}%`,
                          animationDelay: `${Math.random() * 2}s`,
                          animationDuration: `${1 + Math.random()}s`
                        }}
                      />
                    ))}
                  </div>
                  
                  <div className="relative z-10 space-y-6">
                    <h1 className="text-6xl font-bold text-transparent bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text">
                      🎉 CHAMPION! 🎉
                    </h1>
                    <p className="text-2xl text-white">
                      Congratulations! You've won the entire game!
                    </p>
                    <div className="text-4xl font-bold text-green-400">
                      Prize: $10,000!
                    </div>
                    <p className="text-lg text-yellow-200">
                      You've successfully completed all 5 rounds and emerged victorious!
                    </p>
                    <Button
                      onClick={() => router.push("/")}
                      className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white px-8 py-4 text-xl font-bold rounded-xl shadow-lg"
                    >
                      Play Again
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Highscore & Chat */}
          <div className="col-span-4 space-y-6">
            
            {/* Highscore Panel */}
            <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-yellow-500/50 overflow-hidden shadow-2xl">
              <div className="bg-gradient-to-r from-yellow-600/30 to-orange-600/30 px-4 py-3 border-b border-yellow-500/30">
                <h3 className="text-lg font-bold text-white">🏆 HALL OF FAME</h3>
              </div>
              <div className="p-4">
                <div className="space-y-3">
                  {stage === "congratulations" ? (
                    <>
                      <div className="flex justify-between items-center p-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-lg border border-yellow-400/30">
                        <span className="font-bold text-yellow-300">#1 YOU!</span>
                        <span className="text-green-400 font-bold">$10,000</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-gray-800/50 rounded-lg">
                        <span className="text-gray-300">#2 JiveMaster2023</span>
                        <span className="text-gray-400">$5,000</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-gray-800/50 rounded-lg">
                        <span className="text-gray-300">#3 GrooveKing2023</span>
                        <span className="text-gray-400">$2,500</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-gray-800/50 rounded-lg">
                        <span className="text-gray-300">#4 BeatWizard2023</span>
                        <span className="text-gray-400">$1,000</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex justify-between items-center p-2 bg-gray-800/50 rounded-lg">
                        <span className="text-gray-300">#1 JiveMaster2023</span>
                        <span className="text-gray-400">$5,000</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-gray-800/50 rounded-lg">
                        <span className="text-gray-300">#2 GrooveKing2023</span>
                        <span className="text-gray-400">$2,500</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-gray-800/50 rounded-lg">
                        <span className="text-gray-300">#3 BeatWizard2023</span>
                        <span className="text-gray-400">$1,000</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-yellow-900/30 rounded-lg border border-yellow-500/50">
                        <span className="text-yellow-300 font-bold">YOU</span>
                        <span className="text-yellow-400">PLAYING...</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Live Chat */}
            <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-yellow-500/50 overflow-hidden shadow-2xl flex-1">
              <div className="bg-gradient-to-r from-yellow-600/30 to-orange-600/30 px-4 py-3 border-b border-yellow-500/30">
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
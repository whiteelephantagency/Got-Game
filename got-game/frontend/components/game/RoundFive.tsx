"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AlexVideoPlayer from "@/components/ui/AlexVideoPlayer";
import StatMap from "@/components/ui/StatMap";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Trophy, Crown } from "lucide-react";
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
  const [playerName, setPlayerName] = useState("Player");

  // Get player name from localStorage
  useEffect(() => {
    const name = localStorage.getItem("playerName") || "Player";
    setPlayerName(name);
  }, []);

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

  // Determine if we should show question (affects layout)
  const showQuestion = stage === "question";
  
  // Determine if this is an audio-only stage (none in Round 5)
  const isAudioStage = false;

  return (
    <main className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* 3D Starfield Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="stars-container">
          {[...Array(300)].map((_, i) => (
            <div
              key={i}
              className="star"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`
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
          background: #fbbf24;
          box-shadow: 0 0 8px #fbbf24;
        }
        .star:nth-child(4n+1) {
          background: #f97316;
          box-shadow: 0 0 8px #f97316;
        }
        .star:nth-child(4n+2) {
          background: #ef4444;
          box-shadow: 0 0 8px #ef4444;
        }
        .star:nth-child(4n+3) {
          background: #22c55e;
          box-shadow: 0 0 8px #22c55e;
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0; transform: scale(0.5); }
          50% { opacity: 1; transform: scale(1.5); }
        }
      `}</style>

      {/* Enhanced Top Game Header */}
      <div className="w-full bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600 p-6 shadow-2xl backdrop-blur-sm border-b border-yellow-400/30 relative z-10">
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
            <h1 className="text-3xl font-bold text-white flex items-center">
              <Crown className="mr-2" size={32} />
              FINAL ROUND
            </h1>
            <div className="text-yellow-100 text-lg font-medium">
              {stage === "question" ? `🏆 ${playerName}'s Final Question! (${timer}s)` : 
               stage === "alexVideoPart2" ? `🎉 ${playerName} Won!` :
               stage === "congratulations" ? `👑 ${playerName} IS CHAMPION!` :
               `🚀 ${playerName} faces the Ultimate Challenge`}
            </div>
          </div>
          <div className="flex items-center space-x-6 text-lg font-semibold">
            <div className="bg-black/40 px-4 py-2 rounded-xl backdrop-blur-sm border border-white/20">
              👤 PLAYER: {playerName}
            </div>
            <div className="bg-black/40 px-4 py-2 rounded-xl backdrop-blur-sm border border-white/20">
              💰 PRIZE: $10,000
            </div>
            <div className="bg-green-500/30 px-4 py-2 rounded-xl text-green-200 backdrop-blur-sm border border-green-400/40">
              🏆 FINAL
            </div>
          </div>
        </div>
      </div>

      {/* Main Game Area */}
      <div className="max-w-7xl mx-auto p-6 relative z-10">
        <div className={`grid ${(showQuestion || stage === "congratulations") ? 'grid-cols-10' : 'grid-cols-12'} gap-6 h-[calc(100vh-140px)]`}>
          
          {/* Left Column - Main Content */}
          <div className={`${(showQuestion || stage === "congratulations") ? 'col-span-6' : 'col-span-8'} space-y-6`}>
            
            {/* Alex Video Section */}
            <div className="bg-gradient-to-br from-gray-900/80 to-black/80 rounded-2xl border border-yellow-500/50 overflow-hidden shadow-2xl backdrop-blur-sm">
              <div className="bg-gradient-to-r from-yellow-600/30 to-orange-600/30 px-6 py-3 border-b border-yellow-500/30 backdrop-blur-sm">
                <h2 className="text-xl font-bold text-white">🎤 Alex - Your Host</h2>
              </div>
              <div className="p-6">
                <div className={`w-full ${(showQuestion || stage === "congratulations") ? 'h-64' : 'h-96'} rounded-xl overflow-hidden bg-black transition-all duration-500`}>
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
              <div className="bg-gradient-to-br from-yellow-900/80 to-orange-900/80 rounded-2xl border border-yellow-400/50 shadow-2xl backdrop-blur-sm">
                <div className="bg-gradient-to-r from-yellow-500/40 to-orange-500/40 px-6 py-4 border-b border-yellow-400/30 flex justify-between items-center backdrop-blur-sm">
                  <h2 className="text-2xl font-bold text-white flex items-center">
                    <Trophy className="mr-2" />
                    FINAL QUESTION
                  </h2>
                  <div className="text-red-400 text-2xl font-bold flex items-center animate-pulse">
                    ⏰ {timer}s
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-xl text-white mb-6 leading-relaxed font-medium">{QUESTION_5.question}</p>
                  <div className="grid grid-cols-1 gap-4">
                    {QUESTION_5.options.map((opt, idx) => (
                      <Button
                        key={opt}
                        className={`h-16 text-lg font-semibold transition-all duration-500 rounded-xl px-6 flex justify-between items-center transform hover:scale-105
                          ${
                            selected === opt
                              ? opt === QUESTION_5.correctAnswer
                                ? "bg-green-600 shadow-xl shadow-green-500/50 ring-4 ring-green-400 scale-105"
                                : "bg-red-600 shadow-xl shadow-red-500/50 ring-4 ring-red-400 scale-105"
                              : opt === QUESTION_5.correctAnswer
                              ? "bg-yellow-700 hover:bg-yellow-600 ring-2 ring-yellow-400 shadow-lg hover:shadow-yellow-500/50 animate-pulse"
                              : "bg-gray-600/50 cursor-not-allowed opacity-40"
                          }`}
                        disabled={lockOptions || opt !== QUESTION_5.correctAnswer || timer === 0}
                        onClick={() => handleAnswer(opt)}
                      >
                        <span className="flex items-center">
                          <span className="bg-white/20 w-8 h-8 rounded-full flex items-center justify-center mr-3 font-bold">
                            {String.fromCharCode(65 + idx)}
                          </span>
                          {opt}
                        </span>
                        {lockOptions && opt === QUESTION_5.correctAnswer && <CheckCircle className="ml-2 text-green-300" size={24} />}
                        {lockOptions && selected === opt && opt !== QUESTION_5.correctAnswer && <XCircle className="ml-2 text-red-300" size={24} />}
                      </Button>
                    ))}
                  </div>
                  <div className="mt-6 text-center text-yellow-300 text-lg font-medium">
                    {!lockOptions && timer > 0 && "🏆 Only the correct answer is clickable - Win the game!"}
                    {!lockOptions && timer === 0 && "🎉 You Win! Moving to celebration..."}
                    {lockOptions && selected === QUESTION_5.correctAnswer && `🎉 CORRECT! ${playerName} IS THE CHAMPION!`}
                  </div>
                </div>
              </div>
            )}

            {/* Congratulations Screen */}
            {stage === "congratulations" && (
              <div className="bg-gradient-to-br from-yellow-600/30 to-orange-600/30 rounded-2xl border border-yellow-400/50 shadow-2xl overflow-hidden backdrop-blur-sm">
                <div className="relative p-8 text-center">
                  {/* Enhanced Confetti Animation */}
                  <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {Array.from({ length: 100 }).map((_, i) => (
                      <div
                        key={i}
                        className={`absolute w-3 h-3 rounded-full animate-bounce ${
                          i % 4 === 0 ? 'bg-yellow-400' :
                          i % 4 === 1 ? 'bg-orange-400' :
                          i % 4 === 2 ? 'bg-red-400' : 'bg-green-400'
                        }`}
                        style={{
                          left: `${Math.random() * 100}%`,
                          top: `${Math.random() * 100}%`,
                          animationDelay: `${Math.random() * 2}s`,
                          animationDuration: `${0.5 + Math.random()}s`
                        }}
                      />
                    ))}
                  </div>
                  
                  <div className="relative z-10 space-y-6">
                    <div className="flex justify-center items-center space-x-4">
                      <Crown className="text-yellow-400" size={48} />
                      <h1 className="text-6xl font-bold text-transparent bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text">
                        CHAMPION!
                      </h1>
                      <Trophy className="text-yellow-400" size={48} />
                    </div>
                    <p className="text-2xl text-white">
                      🎉 Congratulations {playerName}! You've won the entire game! 🎉
                    </p>
                    <div className="text-5xl font-bold text-green-400 flex items-center justify-center space-x-2">
                      <span>💰</span>
                      <span>Prize: $10,000!</span>
                      <span>💰</span>
                    </div>
                    <p className="text-lg text-yellow-200">
                      You've successfully completed all 5 rounds and emerged victorious!
                    </p>
                    <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 p-4 rounded-xl border border-yellow-400/30">
                      <div className="text-xl font-bold text-yellow-300">🏆 YOUR ACHIEVEMENT 🏆</div>
                      <div className="text-lg text-white mt-2">
                        {playerName} - Official Got Game Champion
                      </div>
                    </div>
                    <Button
                      onClick={() => router.push("/")}
                      className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white px-8 py-4 text-xl font-bold rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300"
                    >
                      🎮 Play Again
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Hall of Fame & Chat */}
          {(showQuestion || stage === "congratulations") && (
            <div className="col-span-4 space-y-6">
              
              {/* Hall of Fame Panel */}
              <div className="bg-gradient-to-br from-gray-900/80 to-black/80 rounded-2xl border border-yellow-500/50 overflow-hidden shadow-2xl backdrop-blur-sm">
                <div className="bg-gradient-to-r from-yellow-600/40 to-orange-600/40 px-4 py-3 border-b border-yellow-500/30 backdrop-blur-sm">
                  <h3 className="text-lg font-bold text-white flex items-center">
                    <Trophy className="mr-2" size={20} />
                    🏆 HALL OF FAME
                  </h3>
                </div>
                <div className="p-4">
                  <div className="space-y-3">
                    {stage === "congratulations" ? (
                      <>
                        <div className="flex justify-between items-center p-3 bg-gradient-to-r from-yellow-500/30 to-orange-500/30 rounded-xl border border-yellow-400/40 backdrop-blur-sm">
                          <span className="font-bold text-yellow-300 flex items-center">
                            <Crown className="mr-2" size={16} />
                            #1 {playerName}!
                          </span>
                          <span className="text-green-400 font-bold">💰 $10,000</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-800/40 rounded-xl border border-gray-600/30">
                          <span className="text-gray-300">#2 JiveMaster2023</span>
                          <span className="text-gray-400">$5,000</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-800/40 rounded-xl border border-gray-600/30">
                          <span className="text-gray-300">#3 GrooveKing2023</span>
                          <span className="text-gray-400">$2,500</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-800/40 rounded-xl border border-gray-600/30">
                          <span className="text-gray-300">#4 BeatWizard2023</span>
                          <span className="text-gray-400">$1,000</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex justify-between items-center p-3 bg-gray-800/40 rounded-xl border border-gray-600/30">
                          <span className="text-gray-300">#1 JiveMaster2023</span>
                          <span className="text-gray-400">$5,000</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-800/40 rounded-xl border border-gray-600/30">
                          <span className="text-gray-300">#2 GrooveKing2023</span>
                          <span className="text-gray-400">$2,500</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-800/40 rounded-xl border border-gray-600/30">
                          <span className="text-gray-300">#3 BeatWizard2023</span>
                          <span className="text-gray-400">$1,000</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-yellow-900/40 rounded-xl border border-yellow-500/50 backdrop-blur-sm">
                          <span className="text-yellow-300 font-bold flex items-center">
                            <Trophy className="mr-2" size={16} />
                            {playerName}
                          </span>
                          <span className="text-yellow-400 font-semibold">🎯 PLAYING...</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Live Chat */}
              <div className="bg-gradient-to-br from-gray-900/80 to-black/80 rounded-2xl border border-yellow-500/50 overflow-hidden shadow-2xl backdrop-blur-sm flex-1">
                <div className="bg-gradient-to-r from-yellow-600/40 to-orange-600/40 px-4 py-3 border-b border-yellow-500/30 backdrop-blur-sm">
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
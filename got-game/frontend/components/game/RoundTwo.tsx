"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AlexVideoPlayer from "@/components/ui/AlexVideoPlayer";
import StatMap from "@/components/ui/StatMap";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";
import ChatBox from "@/components/ui/ChatBot";

const QUESTION_2 = {
  question: "Where was Shin Lim, AGT Season 13 Winner, born?",
  options: ["Acton, Massachusetts", "Seoul, South Korea", "Singapore", "Vancouver, British Columbia"],
  correctAnswer: "Vancouver, British Columbia",
  wrongAnswers: ["Acton, Massachusetts", "Seoul, South Korea", "Singapore"]
};

export default function Round2Page() {
  const router = useRouter();
  const [stage, setStage] = useState("intro");
  const [selected, setSelected] = useState<string | null>(null);
  const [lockOptions, setLockOptions] = useState(false);
  const [statProgress, setStatProgress] = useState(0);
  const [timer, setTimer] = useState(10);
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
            setStage("answerReaction");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [stage, timerActive, timer]);

  // Stats animation effects
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (stage === "incorrectStats") {
      let filled = 0;
      interval = setInterval(() => {
        filled++;
        setStatProgress(filled);
        if (filled >= 800) {
          clearInterval(interval);
          setStage("incorrectStatsEnd");
        }
      }, 5);
    } else if (stage === "correctStats") {
      let filled = 0;
      interval = setInterval(() => {
        filled++;
        setStatProgress(filled);
        if (filled >= 80) {
          clearInterval(interval);
          setStage("alexVideoPart4");
        }
      }, 15);
    } else if (stage === "openSlotsStats") {
      let filled = 0;
      interval = setInterval(() => {
        filled++;
        setStatProgress(filled);
        if (filled >= 20) {
          clearInterval(interval);
          setStage("alexVideoPart5");
        }
      }, 25);
    }
    return () => clearInterval(interval);
  }, [stage]);

  const handleVideoEnd = () => {
    if (stage === "intro") {
      setStage("question");
      setTimerActive(true);
    }
    else if (stage === "answerReaction") setStage("incorrectStats");
    else if (stage === "incorrectStatsEnd") setStage("correctStats");
    else if (stage === "alexVideoPart4") setStage("openSlotsStats");
    else if (stage === "alexVideoPart5") router.push("/lucky-draw?round=2");
  };

  const handleAnswer = (option: string) => {
    if (lockOptions) return;
    
    if (QUESTION_2.wrongAnswers.includes(option)) {
      setSelected(option);
      setLockOptions(true);
      setTimerActive(false);
      setTimeout(() => setStage("answerReaction"), 500);
    }
  };

  // Auto-start timer when question appears
  useEffect(() => {
    if (stage === "question") {
      setTimerActive(true);
    }
  }, [stage]);

  // Determine if we should show question (affects layout)
  const showQuestion = stage === "question";
  
  // Determine if this is an audio-only stage
  const isAudioStage = stage === "answerReaction" || stage === "incorrectStatsEnd";

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
          background: #60a5fa;
          box-shadow: 0 0 6px #60a5fa;
        }
        .star:nth-child(4n+1) {
          background: #34d399;
          box-shadow: 0 0 6px #34d399;
        }
        .star:nth-child(4n+2) {
          background: #f472b6;
          box-shadow: 0 0 6px #f472b6;
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0; transform: scale(0.5); }
          50% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>

      {/* Enhanced Top Game Header */}
      <div className="w-full bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 p-6 shadow-2xl backdrop-blur-sm border-b border-cyan-400/30 relative z-10">
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
            <h1 className="text-3xl font-bold text-white">🎯 ROUND 2</h1>
            <div className="text-cyan-100 text-lg font-medium">
              {stage === "question" ? `⏰ Answer the Question! (${timer}s)` : 
               stage === "answerReaction" ? `❌ Wrong Answer - ${playerName} to Lucky Pool!` :
               stage === "incorrectStats" ? "📊 Moving Incorrect to Lucky Pool" :
               stage === "correctStats" ? "✅ Showing Correct Answers" :
               stage === "openSlotsStats" ? "🎲 Open Slots Available" :
               "🧠 The Knowledge Challenge"}
            </div>
          </div>
          <div className="flex items-center space-x-6 text-lg font-semibold">
            <div className="bg-black/40 px-4 py-2 rounded-xl backdrop-blur-sm border border-white/20">
              👥 PLAYERS: 1,000
            </div>
            <div className="bg-black/40 px-4 py-2 rounded-xl backdrop-blur-sm border border-white/20">
              🎯 TARGET: 100
            </div>
            <div className="bg-cyan-500/30 px-4 py-2 rounded-xl text-cyan-200 backdrop-blur-sm border border-cyan-400/40">
              🔥 ROUND 2
            </div>
          </div>
        </div>
      </div>

      {/* Main Game Area */}
      <div className="max-w-7xl mx-auto p-6 relative z-10">
        <div className={`grid ${showQuestion ? 'grid-cols-10' : 'grid-cols-12'} gap-6 h-[calc(100vh-140px)]`}>
          
          {/* Left Column - Main Content */}
          <div className={`${showQuestion ? 'col-span-6' : 'col-span-8'} space-y-6`}>
            
            {/* Alex Video Section */}
            <div className="bg-gradient-to-br from-gray-900/80 to-black/80 rounded-2xl border border-blue-500/50 overflow-hidden shadow-2xl backdrop-blur-sm">
              <div className="bg-gradient-to-r from-blue-600/30 to-cyan-600/30 px-6 py-3 border-b border-blue-500/30 backdrop-blur-sm">
                <h2 className="text-xl font-bold text-white">🎤 Alex - Your Host</h2>
              </div>
              <div className="p-6">
                <div className={`w-full ${showQuestion ? 'h-64' : 'h-96'} rounded-xl overflow-hidden bg-black transition-all duration-500`}>
                  {(stage === "intro" || 
                    stage === "answerReaction" || 
                    stage === "incorrectStatsEnd" || 
                    stage === "alexVideoPart4" || 
                    stage === "alexVideoPart5") && (
                    <AlexVideoPlayer
                      src={
                        stage === "intro"
                          ? "/video/round2-video1.mp4"
                          : stage === "answerReaction"
                          ? "/video/alex-question2-part2.mp3"
                          : stage === "incorrectStatsEnd"
                          ? "/video/alex-question2-part3.mp3"
                          : stage === "alexVideoPart4"
                          ? "/video/round2-video4.mp4"
                          : "/video/round2-video5.mp4"
                      }
                      onEnded={handleVideoEnd}
                      autoPlay
                      key={stage}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Full-Screen Stats During Audio */}
            {isAudioStage && (
              <div className="bg-gradient-to-br from-purple-900/80 to-blue-900/80 rounded-2xl border border-purple-500/50 shadow-2xl backdrop-blur-sm p-8">
                <div className="text-center space-y-6">
                  <h2 className="text-4xl font-bold text-white">📊 GAME STATS</h2>
                  <div className="text-6xl font-bold text-purple-400">
                    {stage === "answerReaction" ? "❌" : "📈"}
                  </div>
                  <div className="text-2xl text-white">
                    {stage === "answerReaction" ? 
                      `${playerName} got it wrong! Going to Lucky Pool...` :
                      "Processing incorrect answers..."}
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-4">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-4 rounded-full animate-pulse" style={{width: '60%'}}></div>
                  </div>
                </div>
              </div>
            )}

            {/* Question Section */}
            {stage === "question" && (
              <div className="bg-gradient-to-br from-blue-900/80 to-cyan-900/80 rounded-2xl border border-blue-400/50 shadow-2xl backdrop-blur-sm">
                <div className="bg-gradient-to-r from-blue-500/40 to-cyan-500/40 px-6 py-4 border-b border-blue-400/30 flex justify-between items-center backdrop-blur-sm">
                  <h2 className="text-2xl font-bold text-white">❓ QUESTION 2</h2>
                  <div className="text-red-400 text-2xl font-bold flex items-center animate-pulse">
                    ⏰ {timer}s
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-xl text-white mb-6 leading-relaxed font-medium">{QUESTION_2.question}</p>
                  <div className="grid grid-cols-1 gap-4">
                    {QUESTION_2.options.map((opt, idx) => (
                      <Button
                        key={opt}
                        className={`h-16 text-lg font-semibold transition-all duration-500 rounded-xl px-6 flex justify-between items-center transform hover:scale-105
                          ${
                            selected === opt
                              ? QUESTION_2.wrongAnswers.includes(opt)
                                ? "bg-red-600 shadow-xl shadow-red-500/50 ring-4 ring-red-400 scale-105"
                                : "bg-green-600 shadow-xl shadow-green-500/50 ring-4 ring-green-400 scale-105"
                              : opt === QUESTION_2.correctAnswer
                              ? "bg-gray-600 cursor-not-allowed opacity-50"
                              : "bg-blue-700 hover:bg-blue-600 ring-2 ring-blue-400 shadow-lg hover:shadow-blue-500/50 animate-pulse"
                          }`}
                        disabled={lockOptions || opt === QUESTION_2.correctAnswer || timer === 0}
                        onClick={() => handleAnswer(opt)}
                      >
                        <span className="flex items-center">
                          <span className="bg-white/20 w-8 h-8 rounded-full flex items-center justify-center mr-3 font-bold">
                            {String.fromCharCode(65 + idx)}
                          </span>
                          {opt}
                        </span>
                        {lockOptions && selected === opt && QUESTION_2.wrongAnswers.includes(opt) && 
                          <XCircle className="ml-2 text-red-300" size={24} />}
                        {lockOptions && opt === QUESTION_2.correctAnswer && 
                          <CheckCircle className="ml-2 text-green-400" size={24} />}
                      </Button>
                    ))}
                  </div>
                  <div className="mt-6 text-center text-blue-300 text-lg font-medium">
                    {!lockOptions && timer > 0 && "⚠️ Correct answer is disabled - you must choose wrong to continue"}
                    {!lockOptions && timer === 0 && "⏰ Time's up! Moving to results..."}
                    {lockOptions && QUESTION_2.wrongAnswers.includes(selected!) && 
                      `❌ Wrong answer! ${playerName} is going to the Lucky Pool...`}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Game Stats & Chat */}
          {showQuestion && (
            <div className="col-span-4 space-y-6">
              
              {/* Game Stats Panel */}
              <div className="bg-gradient-to-br from-gray-900/80 to-black/80 rounded-2xl border border-blue-500/50 overflow-hidden shadow-2xl backdrop-blur-sm">
                <div className="bg-gradient-to-r from-blue-600/40 to-cyan-600/40 px-4 py-3 border-b border-blue-500/30 backdrop-blur-sm">
                  <h3 className="text-lg font-bold text-white">📊 GAME STATS</h3>
                </div>
                <div className="p-4">
                  {(stage === "incorrectStats" || stage === "correctStats" || stage === "openSlotsStats") ? (
                    <StatMap
                      total={stage === "incorrectStats" ? 800 : stage === "correctStats" ? 100 : 100}
                      safe={stage === "incorrectStats" ? 0 : stage === "correctStats" ? 80 : 100}
                      progress={statProgress}
                      label={
                        stage === "incorrectStats" ? "Moving incorrect answers to LUCKY POOL" :
                        stage === "correctStats" ? "Only 80/100 got it correct" :
                        "20 open slots available"
                      }
                      showFinalSplit={stage === "correctStats" || stage === "openSlotsStats"}
                      fullScreen={false}
                      playerName={playerName}
                      theme={stage === "incorrectStats" ? "elimination" : "advancement"}
                    />
                  ) : (
                    <div className="text-center space-y-4">
                      <div className="text-3xl font-bold text-blue-400">1,000</div>
                      <div className="text-sm text-gray-300">Total Players</div>
                      <div className="text-lg text-blue-200 font-medium">
                        {stage === "question" ? `⏰ Timer: ${timer}s` : 
                         stage === "answerReaction" ? `${playerName} got it wrong! → LUCKY POOL` :
                         stage === "alexVideoPart4" ? "80 correct - 20 spots open" :
                         stage === "alexVideoPart5" ? "Preparing Lucky Draw..." :
                         "Round 2 in progress..."}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Live Chat */}
              <div className="bg-gradient-to-br from-gray-900/80 to-black/80 rounded-2xl border border-blue-500/50 overflow-hidden shadow-2xl backdrop-blur-sm flex-1">
                <div className="bg-gradient-to-r from-blue-600/40 to-cyan-600/40 px-4 py-3 border-b border-blue-500/30 backdrop-blur-sm">
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
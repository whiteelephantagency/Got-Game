"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AlexVideoPlayer from "@/components/ui/AlexVideoPlayer";
import StatMap from "@/components/ui/StatMap";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock } from "lucide-react";
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
  const [showFullScreenStats, setShowFullScreenStats] = useState(false);
  const [currentVideoKey, setCurrentVideoKey] = useState(0);
  const [timer, setTimer] = useState(10);
  const [timerActive, setTimerActive] = useState(false);
  const [playerName, setPlayerName] = useState("Player");
  const [finalistFlash, setFinalistFlash] = useState(false);

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
            setStage("roundStats");
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
    if (stage === "roundStats") {
      setShowFullScreenStats(true);
      
      let filled = 0;
      interval = setInterval(() => {
        filled++;
        setStatProgress(filled);
        if (filled >= 1) {
          clearInterval(interval);
          // Start flashing effect for finalist status
          setFinalistFlash(true);
          setTimeout(() => {
            setShowFullScreenStats(false);
            setStage("alexVideoPart2");
          }, 4000); // Give enough time to read the results
        }
      }, 200); // Slower animation
    }
    return () => clearInterval(interval);
  }, [stage]);

  // Flashing effect for finalist status
  useEffect(() => {
    let flashInterval: NodeJS.Timeout;
    if (finalistFlash) {
      flashInterval = setInterval(() => {
        // This will trigger re-renders and CSS animations
      }, 500);
    }
    return () => clearInterval(flashInterval);
  }, [finalistFlash]);

  const handleVideoEnd = () => {
    if (stage === "intro") {
      setCurrentVideoKey(prev => prev + 1);
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
    setTimeout(() => setStage("roundStats"), 1000);
  };

  // Auto-start timer when question appears
  useEffect(() => {
    if (stage === "question") {
      setTimerActive(true);
    }
  }, [stage]);

  return (
    <main className="min-h-screen bg-black bg-[url('/images/lobby-background.jpg')] bg-cover bg-center bg-no-repeat bg-fixed text-white relative">
      
      {/* Full Screen Stats Overlay */}
      {showFullScreenStats && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-lg"></div>
          
          <div className="relative z-10 bg-gradient-to-br from-purple-900/95 to-blue-900/95 rounded-3xl border border-purple-400/50 shadow-2xl p-12 max-w-6xl mx-4 animate-in zoom-in-95 duration-500">
            <div className="text-center space-y-8">
              <h2 className="text-5xl font-bold text-white mb-8">
                🏁 ROUND 4 RESULTS
              </h2>
              
              <div className="space-y-8">
                <div className="grid grid-cols-3 gap-8 items-center">
                  <div className="text-center">
                    <div className="w-24 h-24 mx-auto bg-blue-500 rounded-full flex items-center justify-center mb-4">
                      <span className="text-3xl font-bold">👥</span>
                    </div>
                    <div className="text-2xl font-bold text-blue-400">10</div>
                    <div className="text-sm text-gray-300">Total Players</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-4xl text-purple-400">→</div>
                    <div className="text-sm text-purple-300 mt-2">Answered Correctly</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-24 h-24 mx-auto bg-green-500 rounded-full flex items-center justify-center mb-4">
                      <span className="text-3xl font-bold">✅</span>
                    </div>
                    <div className="text-3xl font-bold text-green-400">
                      {statProgress.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-300">Correct Answers</div>
                  </div>
                </div>
                
                <div className="bg-gray-800 rounded-full h-8 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-emerald-400 h-full transition-all duration-300 rounded-full flex items-center justify-end pr-4"
                    style={{ width: `${(statProgress / 1) * 100}%` }}
                  >
                    <span className="text-white font-bold text-sm">
                      {statProgress >= 1 ? "Complete!" : `${Math.round((statProgress / 1) * 100)}%`}
                    </span>
                  </div>
                </div>
                
                {statProgress >= 1 && (
                  <div className="space-y-6 animate-in fade-in duration-1000">
                    <div className="text-2xl text-green-400 font-bold">
                      🎉 Only You Got It Right!
                    </div>
                    <div className="text-lg text-yellow-300 animate-pulse">
                      🏆 {playerName} ADVANCES TO THE FINAL! 🏆
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Top Game Header */}
      <div className="w-full bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 p-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <h1 className="text-2xl font-bold text-white">ROUND 4</h1>
            <div className="text-purple-100">
              {stage === "question" ? `Answer the Question! (${timer}s)` : 
               stage === "roundStats" ? "Showing Statistics" :
               stage === "alexVideoPart2" ? "Congratulations!" :
               "The Final Challenge"}
            </div>
          </div>
          <div className="flex items-center space-x-4 text-sm">
            <div className="bg-black/30 px-3 py-1 rounded">PLAYERS: 10</div>
            <div className="bg-black/30 px-3 py-1 rounded">TARGET: 1</div>
            <div className="bg-purple-500/20 px-3 py-1 rounded text-purple-300">ROUND 4</div>
          </div>
        </div>
      </div>

      {/* Main Game Area */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-12 gap-6 min-h-[calc(100vh-120px)]">
          
          {/* Left Column - Main Content */}
          <div className="col-span-8 flex flex-col space-y-6">

            {/* Alex Video Section - Fixed height container */}
            <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-purple-500/50 overflow-hidden shadow-2xl flex-1 flex flex-col">
              <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 px-4 py-2 border-b border-purple-500/30">
                <h2 className="text-lg font-semibold text-white">Alex - Your Host</h2>
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <div className="w-full rounded-xl overflow-hidden bg-black flex-1 min-h-0">
                  {(stage === "intro" || stage === "alexVideoPart2") && (
                    <AlexVideoPlayer
                      src={
                        stage === "intro"
                          ? "/video/round4-intro.mp4"
                          : "/video/round4-video2.mp4"
                      }
                      onEnded={handleVideoEnd}
                      autoPlay
                      key={`video-${stage}-${currentVideoKey}`}
                      className="w-full h-full object-cover"
                      hideControls={true}
                      showAudioIndicator={false}
                    />
                  )}
                  
                  {/* Show placeholder during non-video stages */}
                  {stage === "question" && (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-900/20 to-blue-900/20">
                      <div className="text-center space-y-4">
                        <div className="text-3xl">🏁</div>
                        <div className="text-xl font-semibold text-purple-300">
                          Final Question!
                        </div>
                        <div className="text-sm text-gray-400">
                          Time is ticking: {timer}s
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Show placeholder during stats stage */}
                  {stage === "roundStats" && (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-900/20 to-blue-900/20">
                      <div className="text-center space-y-4">
                        <div className="text-3xl">🏆</div>
                        <div className="text-xl font-semibold text-purple-300">
                          Calculating Final Results...
                        </div>
                        <div className="text-sm text-gray-400">
                          Check the full screen for detailed results!
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Question Section - Only shown when stage is "question" */}
            {stage === "question" && (
              <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 rounded-2xl border border-purple-400/50 shadow-xl">
                <div className="bg-gradient-to-r from-purple-500/30 to-blue-500/30 px-6 py-4 border-b border-purple-400/30 flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-white">QUESTION 4</h2>
                  <div className="text-red-400 text-xl font-bold flex items-center">
                    <Clock className="mr-2" /> {timer}s
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-xl text-white mb-6 leading-relaxed">{QUESTION_4.question}</p>
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
                              ? "bg-purple-700 hover:bg-purple-600 ring-2 ring-purple-400 shadow-lg hover:shadow-purple-500/50"
                              : "bg-gray-600/50 cursor-not-allowed opacity-60"
                          }`}
                        disabled={lockOptions || opt !== QUESTION_4.correctAnswer || timer === 0}
                        onClick={() => handleAnswer(opt)}
                      >
                        <span>
                          {String.fromCharCode(65 + idx)}. {opt}
                        </span>
                        {lockOptions && opt === QUESTION_4.correctAnswer && <CheckCircle className="ml-2 text-green-300" />}
                      </Button>
                    ))}
                  </div>
                  <div className="mt-4 text-center text-purple-300 text-sm">
                    {!lockOptions && timer > 0 && "✨ Only the correct answer is clickable - find it!"}
                    {!lockOptions && timer === 0 && "⏰ Time's up! Auto-advancing..."}
                    {lockOptions && selected === QUESTION_4.correctAnswer && `🎉 Correct! ${playerName} is advancing to the final!`}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Game Stats & Chat */}
          <div className="col-span-4 space-y-6">
            
            {/* Game Stats Panel */}
            <div className={`bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-purple-500/50 overflow-hidden shadow-2xl transition-all duration-500 ${
              finalistFlash ? 'animate-pulse ring-4 ring-yellow-400/50 shadow-yellow-400/50' : ''
            }`}>
              <div className={`bg-gradient-to-r from-purple-600/30 to-blue-600/30 px-4 py-3 border-b border-purple-500/30 ${
                finalistFlash ? 'bg-gradient-to-r from-yellow-600/50 to-orange-600/50' : ''
              }`}>
                <h3 className="text-lg font-bold text-white">📊 GAME STATS</h3>
              </div>
              <div className="p-4">
                {/* Basic game info - before and during question */}
                {(stage === "intro" || stage === "question") && (
                  <div className="text-center space-y-4">
                    <div className="text-lg font-bold text-purple-400 mb-3">Round 4 Info</div>
                    
                    <div className="bg-blue-600/20 rounded-lg p-3 border border-blue-500/30">
                      <div className="flex justify-between items-center">
                        <span className="text-blue-300 text-sm">👥 Total Players</span>
                        <span className="text-blue-400 font-bold">10</span>
                      </div>
                      <div className="text-xs text-blue-200 mt-1">final competitors</div>
                    </div>
                    
                    <div className="bg-purple-600/20 rounded-lg p-3 border border-purple-500/30">
                      <div className="flex justify-between items-center">
                        <span className="text-purple-300 text-sm">🏆 Finalist Spots</span>
                        <span className="text-purple-400 font-bold">1</span>
                      </div>
                      <div className="text-xs text-purple-200 mt-1">advance to final</div>
                    </div>
                    
                    <div className="bg-yellow-600/20 rounded-lg p-3 border border-yellow-500/30">
                      <div className="flex justify-between items-center">
                        <span className="text-yellow-300 text-sm">🎯 Your Status</span>
                        <span className="text-yellow-400 font-bold">COMPETING</span>
                      </div>
                      <div className="text-xs text-yellow-200 mt-1">final challenge</div>
                    </div>
                    
                    <div className="text-center text-sm text-gray-400 mt-3">
                      {stage === "question" ? `Timer: ${timer}s remaining` : 
                       "Round 4 - The Final Challenge"}
                    </div>
                  </div>
                )}
                
                {/* During stats animations */}
                {stage === "roundStats" && (
                  <StatMap
                    total={10}
                    safe={1}
                    progress={statProgress}
                    label="1 correct answer - FINALIST!"
                    showFinalSplit={false}
                  />
                )}
                
                {/* After stats - show finalist celebration */}
                {stage === "alexVideoPart2" && (
                  <div className="space-y-4">
                    <div className="text-center mb-4">
                      <div className="text-lg font-bold text-yellow-400 mb-2 animate-pulse">🏆 FINALIST! 🏆</div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className={`bg-green-600/20 rounded-lg p-3 border border-green-500/30 ${
                        finalistFlash ? 'animate-pulse bg-yellow-600/30 border-yellow-500/50' : ''
                      }`}>
                        <div className="flex justify-between items-center">
                          <span className="text-green-300 text-sm">🎉 Final Result</span>
                          <span className="text-green-400 font-bold">QUALIFIED</span>
                        </div>
                        <div className="text-xs text-green-200 mt-1">{playerName} advances!</div>
                      </div>
                      
                      <div className="bg-purple-600/20 rounded-lg p-3 border border-purple-500/30">
                        <div className="flex justify-between items-center">
                          <span className="text-purple-300 text-sm">🏁 Next Stage</span>
                          <span className="text-purple-400 font-bold">THE FINAL</span>
                        </div>
                        <div className="text-xs text-purple-200 mt-1">ultimate challenge awaits</div>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-3 border-t border-yellow-500/30">
                      <div className={`bg-yellow-500/20 rounded-lg p-3 border border-yellow-400/50 ${
                        finalistFlash ? 'animate-pulse' : ''
                      }`}>
                        <div className="flex items-center justify-center space-x-2">
                          <span className="text-yellow-400">🏆</span>
                          <span className="text-yellow-300 font-semibold">FINALIST STATUS</span>
                        </div>
                        <div className="text-xs text-yellow-200 text-center mt-1">
                          You made it to the end!
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Live Chat */}
            <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-purple-500/50 overflow-hidden shadow-2xl flex-1">
              <div className="bg-gradient-to-r from-purple-600/30 to-blue-600/30 px-4 py-3 border-b border-purple-500/30">
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
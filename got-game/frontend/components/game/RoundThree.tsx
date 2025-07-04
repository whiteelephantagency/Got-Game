"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AlexVideoPlayer from "@/components/ui/AlexVideoPlayer";
import StatMap from "@/components/ui/StatMap";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, Lock } from "lucide-react";
import ChatBox from "@/components/ui/ChatBot";

const QUESTION_3 = {
  question: "Who painted the Mona Lisa?",
  options: ["Vincent van Gogh", "Pablo Picasso", "Michelangelo", "Leonardo da Vinci"],
  correctAnswer: "Leonardo da Vinci"
};

// Random names for lucky draw
const LUCKY_POOL_NAMES = [
  "PlayerXYZ", "GamerABC", "QuizMaster99", "SmartCookie", "BrainTeaser",
  "WisdomSeeker", "ThinkTank"
];

export default function Round3Page() {
  const router = useRouter();
  const [stage, setStage] = useState("intro");
  const [statProgress, setStatProgress] = useState(0);
  const [showFullScreenStats, setShowFullScreenStats] = useState(false);
  const [showLuckyDraw, setShowLuckyDraw] = useState(false);
  const [currentVideoKey, setCurrentVideoKey] = useState(0);
  const [timer, setTimer] = useState(10);
  const [timerActive, setTimerActive] = useState(false);
  const [playerName, setPlayerName] = useState("Player");
  const [drawnNames, setDrawnNames] = useState<string[]>([]);
  const [currentDrawnName, setCurrentDrawnName] = useState("");

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
    if (stage === "roundStats") {
      setShowFullScreenStats(true);
      
      let filled = 0;
      interval = setInterval(() => {
        filled++;
        setStatProgress(filled);
        if (filled >= 3) {
          clearInterval(interval);
          setTimeout(() => {
            setShowFullScreenStats(false);
            setStage("alexVideoPart3");
          }, 4000); // Give enough time to read the results
        }
      }, 200); // Slower animation
    }
    return () => clearInterval(interval);
  }, [stage]);

  // Lucky Draw animation - SIMPLIFIED VERSION (NO AUDIO)
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (stage === "luckyDraw") {
      setShowLuckyDraw(true);
      setDrawnNames([]); // Clear previous names
      setCurrentDrawnName(""); // Clear current name
      let drawCount = 0;
      
      interval = setInterval(() => {
        if (drawCount < 6) {
          // Draw random names for first 6 (indices 0-5)
          const randomName = LUCKY_POOL_NAMES[drawCount % LUCKY_POOL_NAMES.length];
          setCurrentDrawnName(randomName);
          setDrawnNames(prev => [...prev, randomName]);
          drawCount++;
        } else if (drawCount === 6) {
          // Draw player name as 7th (final) name - this is the FINAL draw
          setCurrentDrawnName(playerName);
          setDrawnNames(prev => [...prev, playerName]);
          
          // IMPORTANT: Clear the interval immediately after setting the 7th name
          clearInterval(interval);
          
          // Wait a moment then transition to next stage
          setTimeout(() => {
            setShowLuckyDraw(false);
            setStage("alexVideoPart5");
          }, 3000);
        }
      }, 1500);
    }
    
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [stage, playerName]); // Removed suspenseAudioPlayed dependency

  const handleVideoEnd = () => {
    if (stage === "intro") {
      setCurrentVideoKey(prev => prev + 1);
      setStage("question");
      setTimerActive(true);
    }
    else if (stage === "answerReaction") {
      setCurrentVideoKey(prev => prev + 1);
      setStage("roundStats");
    }
    else if (stage === "alexVideoPart3") {
      setCurrentVideoKey(prev => prev + 1);
      setStage("luckyDraw");
    }
    else if (stage === "alexVideoPart5") {
      // End of Round 3
      router.push("/game/4");
    }
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
                🎯 ROUND 3 RESULTS
              </h2>
              
              <div className="space-y-8">
                <div className="grid grid-cols-3 gap-8 items-center">
                  <div className="text-center">
                    <div className="w-24 h-24 mx-auto bg-blue-500 rounded-full flex items-center justify-center mb-4">
                      <span className="text-3xl font-bold">👥</span>
                    </div>
                    <div className="text-2xl font-bold text-blue-400">100</div>
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
                    style={{ width: `${(statProgress / 3) * 100}%` }}
                  >
                    <span className="text-white font-bold text-sm">
                      {statProgress >= 3 ? "Complete!" : `${Math.round((statProgress / 3) * 100)}%`}
                    </span>
                  </div>
                </div>
                
                {statProgress >= 3 && (
                  <div className="space-y-6 animate-in fade-in duration-1000">
                    <div className="text-2xl text-green-400 font-bold">
                      🎉 Only 3 Players Got It Right!
                    </div>
                    <div className="text-lg text-yellow-300">
                      7 spots open from Lucky Pool to reach 10 total!
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lucky Draw Overlay */}
      {showLuckyDraw && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-lg"></div>
          
          <div className="relative z-10 bg-gradient-to-br from-yellow-900/95 to-orange-900/95 rounded-3xl border border-yellow-400/50 shadow-2xl p-12 max-w-6xl mx-4 animate-in zoom-in-95 duration-500">
            <div className="text-center space-y-8">
              <h2 className="text-5xl font-bold text-white mb-8">
                🎲 LUCKY DRAW
              </h2>
              
              <div className="space-y-6">
                <div className="text-3xl font-bold text-yellow-400">
                  Drawing 7 Lucky Winners...
                </div>
                
                <div className="bg-black/30 rounded-2xl p-6 min-h-[200px] flex items-center justify-center">
                  <div className="text-4xl font-bold text-white animate-pulse">
                    {currentDrawnName || "Starting Draw..."}
                  </div>
                </div>
                
                <div className="text-xl text-yellow-300">
                  {drawnNames.length} / 7 Names Drawn
                </div>
                
                {drawnNames.length >= 7 && drawnNames[6] === playerName && (
                  <div className="text-2xl text-green-400 font-bold animate-pulse">
                    🎉 {playerName} is BACK IN THE GAME! 🎉
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
            <h1 className="text-2xl font-bold text-white">ROUND 3</h1>
            <div className="text-purple-100">
              {stage === "question" ? "Question Locked - Lucky Pool Player" : 
               stage === "answerReaction" ? "Waiting in Lucky Pool..." :
               stage === "roundStats" ? "Showing Statistics" :
               stage === "luckyDraw" ? "Lucky Draw in Progress" :
               "The Final Challenge"}
            </div>
          </div>
          <div className="flex items-center space-x-4 text-sm">
            <div className="bg-black/30 px-3 py-1 rounded">PLAYERS: 100</div>
            <div className="bg-black/30 px-3 py-1 rounded">TARGET: 10</div>
            <div className="bg-purple-500/20 px-3 py-1 rounded text-purple-300">ROUND 3</div>
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
                  {(stage === "intro" || 
                    stage === "answerReaction" || 
                    stage === "alexVideoPart3" ||
                    stage === "alexVideoPart5") && (
                    <AlexVideoPlayer
                      src={
                        stage === "intro"
                          ? "/video/round3-video1.mp4"
                          : stage === "answerReaction"
                          ? "/video/alex-question3-part2.mp3"
                          : stage === "alexVideoPart3"
                          ? "/video/round3-video3.mp4"
                          : "/video/round3-video5.mp4"
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
                        <div className="text-3xl">🔒</div>
                        <div className="text-xl font-semibold text-purple-300">
                          Question Locked
                        </div>
                        <div className="text-sm text-gray-400">
                          You're in the Lucky Pool
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Show placeholder during stats and draw stages */}
                  {(stage === "roundStats" || stage === "luckyDraw") && (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-900/20 to-blue-900/20">
                      <div className="text-center space-y-4">
                        <div className="text-3xl">
                          {stage === "roundStats" ? "🎯" : "🎲"}
                        </div>
                        <div className="text-xl font-semibold text-purple-300">
                          {stage === "roundStats" ? "Calculating Results..." : "Lucky Draw in Progress..."}
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

            {/* Question Section - Blurred and disabled for lucky pool player */}
            {stage === "question" && (
              <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 rounded-2xl border border-purple-400/50 shadow-xl relative overflow-hidden">
                {/* Blur Overlay Effect */}
                <div className="absolute inset-0 bg-black/30 backdrop-blur-sm z-10 flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <Lock className="w-12 h-12 text-purple-400 mx-auto animate-pulse" />
                    <div className="text-xl font-bold text-purple-300">🔒 LOCKED</div>
                    <div className="text-sm text-purple-200">{playerName} in Lucky Pool</div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-purple-500/30 to-blue-500/30 px-6 py-4 border-b border-purple-400/30 flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-white">QUESTION 3</h2>
                  <div className="text-red-400 text-xl font-bold flex items-center">
                    <Clock className="mr-2" /> {timer}s
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-xl text-white mb-6 leading-relaxed">{QUESTION_3.question}</p>
                  <div className="grid grid-cols-2 gap-4">
                    {QUESTION_3.options.map((opt, idx) => (
                      <Button
                        key={opt}
                        className="h-16 text-lg font-semibold transition-all duration-300 rounded-xl px-6 flex justify-between items-center bg-gray-600/50 cursor-not-allowed opacity-60"
                        disabled={true}
                      >
                        <span>
                          {String.fromCharCode(65 + idx)}. {opt}
                        </span>
                        {opt === QUESTION_3.correctAnswer && <CheckCircle className="ml-2 text-green-400/50" />}
                      </Button>
                    ))}
                  </div>
                  <div className="mt-4 text-center text-purple-300 text-sm">
                    🔒 Lucky Pool players cannot answer this question
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Game Stats & Chat */}
          <div className="col-span-4 space-y-6">
            
            {/* Game Stats Panel */}
            <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-purple-500/50 overflow-hidden shadow-2xl">
              <div className="bg-gradient-to-r from-purple-600/30 to-blue-600/30 px-4 py-3 border-b border-purple-500/30">
                <h3 className="text-lg font-bold text-white">📊 GAME STATS</h3>
              </div>
              <div className="p-4">
                {/* Basic game info - before and during question */}
                {(stage === "intro" || stage === "question" || stage === "answerReaction") && (
                  <div className="text-center space-y-4">
                    <div className="text-lg font-bold text-purple-400 mb-3">Round 3 Info</div>
                    
                    <div className="bg-blue-600/20 rounded-lg p-3 border border-blue-500/30">
                      <div className="flex justify-between items-center">
                        <span className="text-blue-300 text-sm">👥 Total Players</span>
                        <span className="text-blue-400 font-bold">100</span>
                      </div>
                      <div className="text-xs text-blue-200 mt-1">competing this round</div>
                    </div>
                    
                    <div className="bg-purple-600/20 rounded-lg p-3 border border-purple-500/30">
                      <div className="flex justify-between items-center">
                        <span className="text-purple-300 text-sm">🎯 Target for Next Round</span>
                        <span className="text-purple-400 font-bold">10</span>
                      </div>
                      <div className="text-xs text-purple-200 mt-1">spots available</div>
                    </div>
                    
                    <div className="bg-yellow-600/20 rounded-lg p-3 border border-yellow-500/30">
                      <div className="flex justify-between items-center">
                        <span className="text-yellow-300 text-sm">🍀 Player Status</span>
                        <span className="text-yellow-400 font-bold">LUCKY POOL</span>
                      </div>
                      <div className="text-xs text-yellow-200 mt-1">awaiting draw</div>
                    </div>
                    
                    <div className="text-center text-sm text-gray-400 mt-3">
                      {stage === "question" ? `Timer: ${timer}s remaining` : 
                       stage === "answerReaction" ? "Waiting for results..." :
                       "Round 3 in progress..."}
                    </div>
                  </div>
                )}
                
                {/* During stats animations */}
                {stage === "roundStats" && (
                  <StatMap
                    total={100}
                    safe={3}
                    progress={statProgress}
                    label="3 correct answers, 7 lucky draw spots"
                    showFinalSplit={false}
                  />
                )}
                
                {/* After stats - show updated results */}
                {(stage === "alexVideoPart3" || stage === "luckyDraw") && (
                  <div className="space-y-4">
                    <div className="text-center mb-4">
                      <div className="text-lg font-bold text-purple-400 mb-2">Round 3 Results</div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="bg-green-600/20 rounded-lg p-3 border border-green-500/30">
                        <div className="flex justify-between items-center">
                          <span className="text-green-300 text-sm">✅ Correct Answers</span>
                          <span className="text-green-400 font-bold">3</span>
                        </div>
                        <div className="text-xs text-green-200 mt-1">out of 100 players</div>
                      </div>
                      
                      <div className="bg-orange-600/20 rounded-lg p-3 border border-orange-500/30">
                        <div className="flex justify-between items-center">
                          <span className="text-orange-300 text-sm">🎲 Lucky Draw Spots</span>
                          <span className="text-orange-400 font-bold">7</span>
                        </div>
                        <div className="text-xs text-orange-200 mt-1">available from lucky pool</div>
                      </div>
                      
                      <div className="bg-purple-600/20 rounded-lg p-3 border border-purple-500/30">
                        <div className="flex justify-between items-center">
                          <span className="text-purple-300 text-sm">🍀 Your Status</span>
                          <span className="text-purple-400 font-bold">
                            {stage === "luckyDraw" && drawnNames.includes(playerName) ? "SELECTED!" : "LUCKY POOL"}
                          </span>
                        </div>
                        <div className="text-xs text-purple-200 mt-1">
                          {stage === "luckyDraw" && drawnNames.includes(playerName) ? "back in the game!" : "awaiting draw results"}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* After lucky draw complete */}
                {stage === "alexVideoPart5" && (
                  <div className="space-y-4">
                    <div className="text-center mb-4">
                      <div className="text-lg font-bold text-purple-400 mb-2">Lucky Draw Complete</div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="bg-green-600/20 rounded-lg p-3 border border-green-500/30">
                        <div className="flex justify-between items-center">
                          <span className="text-green-300 text-sm">🎉 Final Result</span>
                          <span className="text-green-400 font-bold">SELECTED</span>
                        </div>
                        <div className="text-xs text-green-200 mt-1">{playerName} is back!</div>
                      </div>
                      
                      <div className="bg-blue-600/20 rounded-lg p-3 border border-blue-500/30">
                        <div className="flex justify-between items-center">
                          <span className="text-blue-300 text-sm">🎯 Total Advancing</span>
                          <span className="text-blue-400 font-bold">10</span>
                        </div>
                        <div className="text-xs text-blue-200 mt-1">3 correct + 7 lucky</div>
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
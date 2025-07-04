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

// Random names for lucky draw
const RANDOM_NAMES = [
  "Alex Johnson", "Maria Garcia", "David Chen", "Sarah Wilson", "Mike Rodriguez",
  "Emily Davis", "Chris Lee", "Ashley Brown", "Jason Kim", "Jessica Martinez",
  "Ryan Thompson", "Amanda White", "Kevin Liu", "Rachel Green", "Tom Anderson",
  "Lisa Zhang", "Mark Taylor", "Nicole Wang", "Steve Clark", "Jennifer Adams"
];

export default function Round2Page() {
  const router = useRouter();
  const [stage, setStage] = useState("intro");
  const [selected, setSelected] = useState<string | null>(null);
  const [lockOptions, setLockOptions] = useState(false);
  const [statProgress, setStatProgress] = useState(0);
  const [showFullScreenStats, setShowFullScreenStats] = useState(false);
  const [showLuckyDraw, setShowLuckyDraw] = useState(false);
  const [currentVideoKey, setCurrentVideoKey] = useState(0);
  const [timer, setTimer] = useState(10);
  const [timerActive, setTimerActive] = useState(false);
  const [playerName, setPlayerName] = useState("Player");
  const [questionFlash, setQuestionFlash] = useState(false);
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
        if (filled >= 80) {
          clearInterval(interval);
          setTimeout(() => {
            setShowFullScreenStats(false);
            setStage("roundStatsCommentary");
          }, 4000); // Keep on screen much longer - 4 seconds to read
        }
      }, 50); // Much slower animation - 50ms intervals instead of 15ms
    } else if (stage === "openSlotsStats") {
      setShowFullScreenStats(true);
      
      let filled = 0;
      interval = setInterval(() => {
        filled++;
        setStatProgress(filled);
        if (filled >= 20) {
          clearInterval(interval);
          setTimeout(() => {
            setShowFullScreenStats(false);
            setStage("alexVideoPart5");
          }, 3000); // Also longer display time
        }
      }, 100); // Slower animation for open slots too
    }
    return () => clearInterval(interval);
  }, [stage]);

  // Lucky Draw animation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (stage === "luckyDraw") {
      setShowLuckyDraw(true);
      const shuffledNames = [...RANDOM_NAMES].sort(() => Math.random() - 0.5);
      let nameIndex = 0;
      let drawCount = 0;
      
      interval = setInterval(() => {
        if (drawCount < 20) {
          const name = shuffledNames[nameIndex % shuffledNames.length];
          setCurrentDrawnName(name);
          setDrawnNames(prev => [...prev, name]);
          nameIndex++;
          drawCount++;
        } else {
          clearInterval(interval);
          setTimeout(() => {
            setShowLuckyDraw(false);
            setStage("alexVideoPart6");
          }, 2000);
        }
      }, 500);
    }
    return () => clearInterval(interval);
  }, [stage]);

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
    else if (stage === "roundStatsCommentary") {
      setShowFullScreenStats(false);
      setCurrentVideoKey(prev => prev + 1);
      setStage("alexVideoPart4");
    }
    else if (stage === "alexVideoPart4") {
      setCurrentVideoKey(prev => prev + 1);
      setStage("openSlotsStats");
    }
    else if (stage === "alexVideoPart5") {
      setCurrentVideoKey(prev => prev + 1);
      setStage("luckyDraw");
    }
    else if (stage === "alexVideoPart6") {
      // End of Round 2 - continue to Round 3
      router.push("/game/3");
    }
  };

  const handleAnswer = (option: string) => {
    if (lockOptions || timer === 0) return;
    
    if (QUESTION_2.wrongAnswers.includes(option)) {
      setSelected(option);
      setLockOptions(true);
      setTimerActive(false);
      setQuestionFlash(true);
      
      // Flash effect
      setTimeout(() => setQuestionFlash(false), 200);
      setTimeout(() => setQuestionFlash(true), 400);
      setTimeout(() => setQuestionFlash(false), 600);
      
      setTimeout(() => setStage("answerReaction"), 1000);
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
                {stage === "roundStats" ? "🎯 ROUND 2 RESULTS" : "📊 OPEN SLOTS"}
              </h2>
              
              {stage === "roundStats" && (
                <div className="space-y-8">
                  <div className="grid grid-cols-3 gap-8 items-center">
                    <div className="text-center">
                      <div className="w-24 h-24 mx-auto bg-blue-500 rounded-full flex items-center justify-center mb-4">
                        <span className="text-3xl font-bold">👥</span>
                      </div>
                      <div className="text-2xl font-bold text-blue-400">1,000</div>
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
                      style={{ width: `${(statProgress / 80) * 100}%` }}
                    >
                      <span className="text-white font-bold text-sm">
                        {statProgress >= 80 ? "Complete!" : `${Math.round((statProgress / 80) * 100)}%`}
                      </span>
                    </div>
                  </div>
                  
                  {statProgress >= 80 && (
                    <div className="space-y-6 animate-in fade-in duration-1000">
                      <div className="text-2xl text-green-400 font-bold">
                        🎉 Only 80 Players Got It Right!
                      </div>
                      <div className="text-lg text-red-300">
                        You got it wrong... but don't give up hope!
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {stage === "openSlotsStats" && (
                <div className="space-y-8">
                  <div className="grid grid-cols-3 gap-8 items-center">
                    <div className="text-center">
                      <div className="w-24 h-24 mx-auto bg-orange-500 rounded-full flex items-center justify-center mb-4">
                        <span className="text-3xl font-bold">🎯</span>
                      </div>
                      <div className="text-2xl font-bold text-orange-400">100</div>
                      <div className="text-sm text-gray-300">Target Players</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-4xl text-purple-400">-</div>
                      <div className="text-sm text-purple-300 mt-2">Open Slots</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="w-24 h-24 mx-auto bg-yellow-500 rounded-full flex items-center justify-center mb-4">
                        <span className="text-3xl font-bold">🎲</span>
                      </div>
                      <div className="text-3xl font-bold text-yellow-400">
                        {statProgress.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-300">Available Spots</div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-800 rounded-full h-8 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-yellow-500 to-orange-400 h-full transition-all duration-300 rounded-full flex items-center justify-end pr-4"
                      style={{ width: `${(statProgress / 20) * 100}%` }}
                    >
                      <span className="text-white font-bold text-sm">
                        {statProgress >= 20 ? "Complete!" : `${Math.round((statProgress / 20) * 100)}%`}
                      </span>
                    </div>
                  </div>
                  
                  {statProgress >= 20 && (
                    <div className="space-y-6 animate-in fade-in duration-1000">
                      <div className="text-2xl text-yellow-400 font-bold">
                        🎲 20 Spots Available for Lucky Draw!
                      </div>
                    </div>
                  )}
                </div>
              )}
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
                  Drawing 20 Lucky Winners...
                </div>
                
                <div className="bg-black/30 rounded-2xl p-6 min-h-[200px] flex items-center justify-center">
                  <div className="text-4xl font-bold text-white animate-pulse">
                    {currentDrawnName || "Starting Draw..."}
                  </div>
                </div>
                
                <div className="text-xl text-yellow-300">
                  {drawnNames.length} / 20 Names Drawn
                </div>
                
                {drawnNames.length >= 20 && (
                  <div className="text-2xl text-red-400 font-bold animate-pulse">
                    Sorry {playerName}, you weren't selected...
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
            <h1 className="text-2xl font-bold text-white">ROUND 2</h1>
            <div className="text-purple-100">
              {stage === "question" ? `Answer the Question! (${timer}s)` : 
               stage === "answerReaction" ? "Calculating Results..." :
               stage === "roundStats" ? "Showing Statistics" :
               stage === "roundStatsCommentary" ? "Analyzing Results" :
               stage === "openSlotsStats" ? "Open Slots Available" :
               stage === "luckyDraw" ? "Lucky Draw in Progress" :
               "The Knowledge Challenge"}
            </div>
          </div>
          <div className="flex items-center space-x-4 text-sm">
            <div className="bg-black/30 px-3 py-1 rounded">PLAYERS: 1,000</div>
            <div className="bg-black/30 px-3 py-1 rounded">TARGET: 100</div>
            <div className="bg-purple-500/20 px-3 py-1 rounded text-purple-300">ROUND 2</div>
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
                    stage === "roundStatsCommentary" ||
                    stage === "alexVideoPart4" || 
                    stage === "alexVideoPart5" ||
                    stage === "alexVideoPart6") && (
                    <AlexVideoPlayer
                      src={
                        stage === "intro"
                          ? "/video/round2-video1.mp4"
                          : stage === "answerReaction"
                          ? "/video/alex-question2-part2.mp3"
                          : stage === "roundStatsCommentary"
                          ? "/video/alex-question2-part3.mp3"
                          : stage === "alexVideoPart4"
                          ? "/video/round2-video4.mp4"
                          : stage === "alexVideoPart5"
                          ? "/video/round2-video5.mp4"
                          : "/video/alex-question2-part6.mp3"
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
                        <div className="text-3xl">🧠</div>
                        <div className="text-xl font-semibold text-purple-300">
                          Answer the Question!
                        </div>
                        <div className="text-sm text-gray-400">
                          Time is ticking: {timer}s
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Show placeholder during stats stages */}
                  {(stage === "roundStats" || stage === "openSlotsStats" || stage === "luckyDraw") && (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-900/20 to-blue-900/20">
                      <div className="text-center space-y-4">
                        <div className="text-3xl">
                          {stage === "roundStats" ? "🎯" : stage === "openSlotsStats" ? "🎲" : "🍀"}
                        </div>
                        <div className="text-xl font-semibold text-purple-300">
                          {stage === "roundStats" ? "Calculating Results..." : 
                           stage === "openSlotsStats" ? "Counting Open Slots..." :
                           "Lucky Draw in Progress..."}
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
              <div className={`bg-gradient-to-br from-purple-900/30 to-blue-900/30 rounded-2xl border border-purple-400/50 shadow-xl transition-all duration-200 ${
                questionFlash ? 'bg-red-500/50 border-red-500' : ''
              }`}>
                <div className="bg-gradient-to-r from-purple-500/30 to-blue-500/30 px-6 py-4 border-b border-purple-400/30 flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-white">QUESTION 2</h2>
                  <div className="text-red-400 text-xl font-bold flex items-center">
                    ⏰ {timer}s
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-xl text-white mb-6 leading-relaxed">{QUESTION_2.question}</p>
                  <div className="grid grid-cols-2 gap-4">
                    {QUESTION_2.options.map((opt, idx) => (
                      <Button
                        key={opt}
                        className={`h-16 text-lg font-semibold transition-all duration-300 rounded-xl px-6 flex justify-between items-center
                          ${
                            selected === opt
                              ? QUESTION_2.wrongAnswers.includes(opt)
                                ? "bg-red-600 shadow-lg shadow-red-500/50"
                                : "bg-green-600 shadow-lg shadow-green-500/50"
                              : opt === QUESTION_2.correctAnswer
                              ? "bg-gray-600 cursor-not-allowed opacity-50"
                              : "bg-purple-700 hover:bg-purple-600 ring-2 ring-purple-400 shadow-lg hover:shadow-purple-500/50"
                          }`}
                        disabled={lockOptions || opt === QUESTION_2.correctAnswer || timer === 0}
                        onClick={() => handleAnswer(opt)}
                      >
                        <span>
                          {String.fromCharCode(65 + idx)}. {opt}
                        </span>
                        {lockOptions && selected === opt && QUESTION_2.wrongAnswers.includes(opt) && <XCircle className="ml-2" />}
                        {lockOptions && opt === QUESTION_2.correctAnswer && <CheckCircle className="ml-2" />}
                      </Button>
                    ))}
                  </div>
                  <div className="mt-4 text-center text-purple-300 text-sm">
                    {!lockOptions && timer > 0 && "Only wrong answers are clickable"}
                    {!lockOptions && timer === 0 && "Time's up! Moving to results..."}
                    {lockOptions && QUESTION_2.wrongAnswers.includes(selected!) && "Wrong answer! Moving to next stage..."}
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
                    <div className="text-lg font-bold text-purple-400 mb-3">Round 2 Info</div>
                    
                    <div className="bg-blue-600/20 rounded-lg p-3 border border-blue-500/30">
                      <div className="flex justify-between items-center">
                        <span className="text-blue-300 text-sm">👥 Total Players</span>
                        <span className="text-blue-400 font-bold">1,000</span>
                      </div>
                      <div className="text-xs text-blue-200 mt-1">competing this round</div>
                    </div>
                    
                    <div className="bg-purple-600/20 rounded-lg p-3 border border-purple-500/30">
                      <div className="flex justify-between items-center">
                        <span className="text-purple-300 text-sm">🎯 Target for Round 3</span>
                        <span className="text-purple-400 font-bold">100</span>
                      </div>
                      <div className="text-xs text-purple-200 mt-1">spots available</div>
                    </div>
                    
                    <div className="text-center text-sm text-gray-400 mt-3">
                      {stage === "question" ? `Timer: ${timer}s remaining` : 
                       stage === "answerReaction" ? "Calculating results..." :
                       "Round 2 in progress..."}
                    </div>
                  </div>
                )}
                
                {/* During stats animations - only show StatMap during active animation */}
                {(stage === "roundStats" || stage === "openSlotsStats") && (
                  <StatMap
                    total={stage === "openSlotsStats" ? 100 : 1000}
                    safe={stage === "openSlotsStats" ? 80 : 80}
                    progress={stage === "openSlotsStats" ? statProgress : 80}
                    label={stage === "roundStats" ? "80 correct answers" : "20 open slots for lucky draw"}
                    showFinalSplit={stage === "openSlotsStats"}
                  />
                )}
                
                {/* After first stats - show updated results */}
                {(stage === "roundStatsCommentary" || stage === "alexVideoPart4") && (
                  <div className="space-y-4">
                    <div className="text-center mb-4">
                      <div className="text-lg font-bold text-purple-400 mb-2">Round 2 Results</div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="bg-green-600/20 rounded-lg p-3 border border-green-500/30">
                        <div className="flex justify-between items-center">
                          <span className="text-green-300 text-sm">✅ Correct Answers</span>
                          <span className="text-green-400 font-bold">80</span>
                        </div>
                        <div className="text-xs text-green-200 mt-1">out of 1,000 players</div>
                      </div>
                      
                      <div className="bg-purple-600/20 rounded-lg p-3 border border-purple-500/30">
                        <div className="flex justify-between items-center">
                          <span className="text-purple-300 text-sm">🎯 Target for Round 3</span>
                          <span className="text-purple-400 font-bold">100</span>
                        </div>
                        <div className="text-xs text-purple-200 mt-1">spots needed</div>
                      </div>
                      
                      <div className="bg-red-600/20 rounded-lg p-3 border border-red-500/30">
                        <div className="flex justify-between items-center">
                          <span className="text-red-300 text-sm">❌ Your Status</span>
                          <span className="text-red-400 font-bold">LUCKY POOL</span>
                        </div>
                        <div className="text-xs text-red-200 mt-1">awaiting lucky draw</div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* After open slots - show different states based on stage */}
                {stage === "alexVideoPart5" && (
                  <div className="space-y-4">
                    <div className="text-center mb-4">
                      <div className="text-lg font-bold text-purple-400 mb-2">Lucky Draw Status</div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="bg-orange-600/20 rounded-lg p-3 border border-orange-500/30">
                        <div className="flex justify-between items-center">
                          <span className="text-orange-300 text-sm">🎲 Open Slots</span>
                          <span className="text-orange-400 font-bold">20</span>
                        </div>
                        <div className="text-xs text-orange-200 mt-1">available for draw</div>
                      </div>
                      
                      <div className="bg-purple-600/20 rounded-lg p-3 border border-purple-500/30">
                        <div className="flex justify-between items-center">
                          <span className="text-purple-300 text-sm">🍀 Your Status</span>
                          <span className="text-purple-400 font-bold">LUCKY POOL</span>
                        </div>
                        <div className="text-xs text-purple-200 mt-1">awaiting lucky draw</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* During lucky draw - keep showing lucky pool status */}
                {stage === "luckyDraw" && (
                  <div className="space-y-4">
                    <div className="text-center mb-4">
                      <div className="text-lg font-bold text-purple-400 mb-2">Lucky Draw in Progress</div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="bg-yellow-600/20 rounded-lg p-3 border border-yellow-500/30">
                        <div className="flex justify-between items-center">
                          <span className="text-yellow-300 text-sm">🎲 Drawing Names</span>
                          <span className="text-yellow-400 font-bold">{drawnNames.length}/20</span>
                        </div>
                        <div className="text-xs text-yellow-200 mt-1">names being selected</div>
                      </div>
                      
                      <div className="bg-purple-600/20 rounded-lg p-3 border border-purple-500/30">
                        <div className="flex justify-between items-center">
                          <span className="text-purple-300 text-sm">🍀 Your Status</span>
                          <span className="text-purple-400 font-bold">LUCKY POOL</span>
                        </div>
                        <div className="text-xs text-purple-200 mt-1">waiting for results...</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Only after lucky draw is complete - show final result */}
                {stage === "alexVideoPart6" && (
                  <div className="space-y-4">
                    <div className="text-center mb-4">
                      <div className="text-lg font-bold text-purple-400 mb-2">Lucky Draw Complete</div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="bg-orange-600/20 rounded-lg p-3 border border-orange-500/30">
                        <div className="flex justify-between items-center">
                          <span className="text-orange-300 text-sm">🎲 Draw Results</span>
                          <span className="text-orange-400 font-bold">COMPLETE</span>
                        </div>
                        <div className="text-xs text-orange-200 mt-1">20 players selected</div>
                      </div>
                      
                      <div className="bg-purple-600/20 rounded-lg p-3 border border-purple-500/30">
                        <div className="flex justify-between items-center">
                          <span className="text-purple-300 text-sm">🍀 Your Status</span>
                          <span className="text-purple-400 font-bold">LUCKY POOL</span>
                        </div>
                        <div className="text-xs text-purple-200 mt-1">not selected this round</div>
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
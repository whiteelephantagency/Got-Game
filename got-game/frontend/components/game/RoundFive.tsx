"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AlexVideoPlayer from "@/components/ui/AlexVideoPlayer";
import StatMap from "@/components/ui/StatMap";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, Trophy, Crown } from "lucide-react";
import ChatBox from "@/components/ui/ChatBot";

// const QUESTION_5 = {
//   question: "Which element has the chemical symbol 'O'?",
//   options: ["Gold", "Oxygen", "Osmium", "Oganesson"],
//   correctAnswer: "Oxygen",
// };

const QUESTION_5 = {
  question: "Which host of AGT was also the original host of “Who Wants to Be a Millionaire?",
  options: ["Nick Cannon", "Jerry Springer", "Regis Philbin", "Terry Crews"],
  correctAnswer: "Regis Philbin",
};

export default function Round5Page() {
  const router = useRouter();
  const [stage, setStage] = useState("intro");
  const [selected, setSelected] = useState<string | null>(null);
  const [lockOptions, setLockOptions] = useState(false);
  const [statProgress, setStatProgress] = useState(0);
  const [showFullScreenStats, setShowFullScreenStats] = useState(false);
  const [showCongratulations, setShowCongratulations] = useState(false);
  const [currentVideoKey, setCurrentVideoKey] = useState(0);
  const [timer, setTimer] = useState(10);
  const [timerActive, setTimerActive] = useState(false);
  const [playerName, setPlayerName] = useState("Player");
  const [championFlash, setChampionFlash] = useState(false);

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
          setChampionFlash(true);
          setTimeout(() => {
            setShowFullScreenStats(false);
            setStage("alexVideoPart2");
          }, 4000);
        }
      }, 200);
    }
    return () => clearInterval(interval);
  }, [stage]);

  // Champion flashing effect
  useEffect(() => {
    let flashInterval: NodeJS.Timeout;
    if (championFlash) {
      flashInterval = setInterval(() => {
        // This will trigger re-renders and CSS animations
      }, 500);
    }
    return () => clearInterval(flashInterval);
  }, [championFlash]);

  const handleVideoEnd = () => {
    if (stage === "intro") {
      setCurrentVideoKey(prev => prev + 1);
      setStage("questionRelatedVideo");
      setTimerActive(true);
    } else if (stage === "questionRelatedVideo") {
      setCurrentVideoKey(prev => prev + 1);
      setStage("question");
      setTimerActive(true);
    }
    else if (stage === "alexVideoPart2") {
      setCurrentVideoKey(prev => prev + 1);
      setStage("congratulations");
      setShowCongratulations(true);
    }
  };

  const handleAnswer = (option: string) => {
    if (lockOptions || option !== QUESTION_5.correctAnswer) return;
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-lg"></div>

          <div className="relative z-10 bg-gradient-to-br from-yellow-900/95 to-orange-900/95 rounded-3xl border border-yellow-400/50 shadow-2xl p-16 max-w-6xl mx-auto animate-in zoom-in-95 duration-500">
            <div className="text-center space-y-12">
              <h2 className="text-6xl font-bold text-white mb-12 animate-pulse">
                🏆 FINAL ROUND RESULTS 🏆
              </h2>

              <div className="space-y-12">
                <div className="grid grid-cols-3 gap-12 items-center">
                  <div className="text-center space-y-6">
                    <div className="w-32 h-32 mx-auto bg-yellow-500 rounded-full flex items-center justify-center animate-pulse">
                      <span className="text-4xl font-bold">👤</span>
                    </div>
                    <div className="text-3xl font-bold text-yellow-400">1</div>
                    <div className="text-lg text-gray-300">Final Player</div>
                  </div>

                  <div className="text-center space-y-4">
                    <div className="text-6xl text-orange-400 animate-bounce">🏆</div>
                    <div className="text-lg text-orange-300 mt-4">CHAMPION!</div>
                  </div>

                  <div className="text-center space-y-6">
                    <div className="w-32 h-32 mx-auto bg-green-500 rounded-full flex items-center justify-center animate-spin">
                      <span className="text-4xl font-bold">✅</span>
                    </div>
                    <div className="text-4xl font-bold text-green-400 animate-pulse">
                      {statProgress.toLocaleString()}
                    </div>
                    <div className="text-lg text-gray-300">Correct Answer</div>
                  </div>
                </div>

                <div className="bg-gray-800 rounded-full h-12 overflow-hidden mx-8">
                  <div
                    className="bg-gradient-to-r from-yellow-500 to-orange-400 h-full transition-all duration-300 rounded-full flex items-center justify-end pr-6 animate-pulse"
                    style={{ width: `${(statProgress / 1) * 100}%` }}
                  >
                    <span className="text-white font-bold text-lg">
                      {statProgress >= 1 ? "CHAMPION!" : `${Math.round((statProgress / 1) * 100)}%`}
                    </span>
                  </div>
                </div>

                {statProgress >= 1 && (
                  <div className="space-y-8 animate-in fade-in duration-1000">
                    <div className="text-4xl text-yellow-400 font-bold animate-bounce">
                      🎉 {playerName} IS THE CHAMPION! 🎉
                    </div>
                    <div className="text-3xl text-green-300 animate-pulse">
                      💰 PRIZE: $10,000! 💰
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Congratulations Full Screen Overlay */}
      {showCongratulations && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[url('/images/Background_7.jpg')] bg-cover bg-center p-6">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-lg"></div>

          <div className="relative z-10 text-center space-y-12 max-w-5xl mx-auto py-12">
            {/* GOT GAME Logo */}
            <div className="flex justify-center mb-8">
              <img
                src="/images/Gotgamelogo.png"
                alt="Got Game Logo"
                className="h-24 w-auto animate-pulse"
              />
            </div>

            {/* YOU WIN Text */}
            <h1 className="text-8xl font-black text-white drop-shadow-2xl tracking-wider animate-pulse">
              YOU WIN
            </h1>

            {/* Prize Money Box */}
            <div className="bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 px-16 py-8 rounded-3xl border-4 border-white shadow-2xl mx-auto max-w-2xl">
              <div className="text-7xl font-black text-transparent bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500 bg-clip-text drop-shadow-lg">
                100,000$
              </div>
            </div>

            {/* Congratulations Text */}
            <p className="text-3xl text-white font-bold drop-shadow-lg">
              🎉 Congratulations {playerName}! 🎉
            </p>

            <p className="text-xl text-white/90 drop-shadow-lg max-w-3xl mx-auto px-6">
              You've successfully completed all 5 rounds and emerged victorious!
            </p>

            {/* Official Champion Badge */}
            <div className="bg-gradient-to-r from-yellow-500/90 to-orange-500/90 p-8 rounded-2xl border-2 border-yellow-300 backdrop-blur-sm max-w-2xl mx-auto">
              <div className="text-2xl font-bold text-white drop-shadow-lg">🏆 OFFICIAL CHAMPION 🏆</div>
              <div className="text-xl text-white mt-4 drop-shadow-lg">
                {playerName} - Got Game Winner
              </div>
            </div>

            {/* Play Again Button */}
            <div className="pt-8">
              <Button
                onClick={() => router.push("/")}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-16 py-6 text-2xl font-bold rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300 border-2 border-white/30"
              >
                🎮 Start Game
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Top Game Header */}
      <div className={`w-full bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600 p-6 shadow-lg transition-all duration-500 ${championFlash ? 'animate-pulse' : ''
        }`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center px-4">
          <div className="flex items-center space-x-8">
            <h1 className="text-3xl font-bold text-white flex items-center">
              <Crown className="mr-3 animate-pulse" />
              FINAL ROUND
            </h1>
            <div className="text-yellow-100 text-lg">
              {stage === "question" ? `Ultimate Question! (${timer}s)` :
                stage === "roundStats" ? "Calculating Final Results..." :
                  stage === "alexVideoPart2" ? "Victory Celebration!" :
                    stage === "congratulations" ? "CHAMPION CROWNED!" :
                      "The Ultimate Challenge"}
            </div>
          </div>
          <div className="flex items-center space-x-6 text-lg">
            <div className="bg-black/30 px-4 py-2 rounded">PLAYERS: 1</div>
            <div className="bg-black/30 px-4 py-2 rounded">PRIZE: $10,000</div>
            <div className={`bg-yellow-500/20 px-4 py-2 rounded text-yellow-300 ${championFlash ? 'animate-pulse' : ''
              }`}>FINAL ROUND</div>
          </div>
        </div>
      </div>

      {/* Main Game Area */}
      <div className="max-w-7xl mx-auto p-8">
        <div className="grid grid-cols-12 gap-8 min-h-[calc(100vh-140px)]">

          {/* Left Column - Main Content */}
          <div className="col-span-8 flex flex-col space-y-8">

            {/* Alex Video Section - Fixed height container */}
            <div className={`bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-yellow-500/50 overflow-hidden shadow-2xl flex-1 flex flex-col transition-all duration-500 ${championFlash ? 'ring-4 ring-yellow-400/50 shadow-yellow-400/50' : ''
              }`}>
              <div className={`bg-gradient-to-r from-yellow-600/20 to-orange-600/20 px-6 py-4 border-b border-yellow-500/30 ${championFlash ? 'bg-gradient-to-r from-yellow-600/50 to-orange-600/50' : ''
                }`}>
                <h2 className="text-xl font-semibold text-white">Alex - Your Host</h2>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <div className="w-full rounded-xl overflow-hidden bg-black flex-1 min-h-0">
                  {(stage === "intro" || stage === "alexVideoPart2" || stage === "questionRelatedVideo") && (
                    <AlexVideoPlayer
                      src={
                        stage === "intro"
                          ? "/video/round5-intro.mp4"
                          : stage === "questionRelatedVideo" 
                          ? "/video/round5-questionVideo.mp4"
                          : "/video/round5-win.mp4"
                      }
                      onEnded={handleVideoEnd}
                      autoPlay
                      key={`video-${stage}-${currentVideoKey}`}
                      className="w-full h-full object-cover"
                    />
                  )}

                  {/* Show placeholder during non-video stages */}
                  {stage === "question" && (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-yellow-900/20 to-orange-900/20">
                      <div className="text-center space-y-6 p-8">
                        <div className="text-4xl animate-bounce">🏆</div>
                        <div className="text-2xl font-semibold text-yellow-300 animate-pulse">
                          Final Question!
                        </div>
                        <div className="text-lg text-gray-400">
                          Win the championship: {timer}s
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Show placeholder during stats stage */}
                  {stage === "roundStats" && (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-yellow-900/20 to-orange-900/20">
                      <div className="text-center space-y-6 p-8">
                        <div className="text-4xl animate-spin">🏆</div>
                        <div className="text-2xl font-semibold text-yellow-300 animate-pulse">
                          Crowning the Champion...
                        </div>
                        <div className="text-lg text-gray-400">
                          Check the full screen for the results!
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Question Section - Only shown when stage is "question" */}
            {stage === "question" && (
              <div className="bg-gradient-to-br from-yellow-900/30 to-orange-900/30 rounded-2xl border border-yellow-400/50 shadow-xl">
                <div className="bg-gradient-to-r from-yellow-500/30 to-orange-500/30 px-8 py-6 border-b border-yellow-400/30 flex justify-between items-center">
                  <h2 className="text-3xl font-bold text-white flex items-center animate-pulse">
                    <Trophy className="mr-3" />
                    FINAL QUESTION
                  </h2>
                  <div className="text-red-400 text-2xl font-bold flex items-center animate-pulse">
                    <Clock className="mr-2" /> {timer}s
                  </div>
                </div>
                <div className="p-8">
                  <p className="text-2xl text-white mb-8 leading-relaxed animate-pulse">{QUESTION_5.question}</p>
                  <div className="grid grid-cols-2 gap-6">
                    {QUESTION_5.options.map((opt, idx) => (
                      <Button
                        key={opt}
                        className={`h-20 text-xl font-semibold transition-all duration-500 rounded-xl px-8 flex justify-between items-center transform hover:scale-105
                          ${selected === opt
                            ? opt === QUESTION_5.correctAnswer
                              ? "bg-green-600 shadow-xl shadow-green-500/50 ring-4 ring-green-400 scale-105 animate-pulse"
                              : "bg-red-600 shadow-xl shadow-red-500/50 ring-4 ring-red-400 scale-105"
                            : opt === QUESTION_5.correctAnswer
                              ? "bg-yellow-700 hover:bg-yellow-600 ring-2 ring-yellow-400 shadow-lg hover:shadow-yellow-500/50 animate-pulse"
                              : "bg-gray-600/50 cursor-not-allowed opacity-60"
                          }`}
                        disabled={lockOptions || opt !== QUESTION_5.correctAnswer || timer === 0}
                        onClick={() => handleAnswer(opt)}
                      >
                        <span className="text-lg">
                          {String.fromCharCode(65 + idx)}. {opt}
                        </span>
                        {lockOptions && opt === QUESTION_5.correctAnswer && <CheckCircle className="ml-3 text-green-300 animate-bounce" />}
                      </Button>
                    ))}
                  </div>
                  <div className="mt-6 text-center text-yellow-300 text-lg animate-pulse">
                    {!lockOptions && timer > 0 && "🏆 Only the correct answer is clickable - Win the championship!"}
                    {!lockOptions && timer === 0 && "🎉 Time's up! You're the champion!"}
                    {lockOptions && selected === QUESTION_5.correctAnswer && `🎉 CORRECT! ${playerName} IS THE CHAMPION!`}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Game Stats & Chat */}
          <div className="col-span-4 space-y-8">

            {/* Game Stats Panel */}
            <div className={`bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-yellow-500/50 overflow-hidden shadow-2xl transition-all duration-500 ${championFlash ? 'animate-pulse ring-4 ring-yellow-400/50 shadow-yellow-400/50' : ''
              }`}>
              <div className={`bg-gradient-to-r from-yellow-600/30 to-orange-600/30 px-6 py-4 border-b border-yellow-500/30 ${championFlash ? 'bg-gradient-to-r from-yellow-600/50 to-orange-600/50' : ''
                }`}>
                <h3 className="text-xl font-bold text-white">📊 FINAL STATS</h3>
              </div>
              <div className="p-6">
                {/* Basic game info - before and during question */}
                {(stage === "intro" || stage === "question") && (
                  <div className="text-center space-y-6">
                    <div className="text-xl font-bold text-yellow-400 mb-4 animate-pulse">Final Round</div>

                    <div className="bg-yellow-600/20 rounded-lg p-4 border border-yellow-500/30">
                      <div className="flex justify-between items-center">
                        <span className="text-yellow-300">👤 Final Player</span>
                        <span className="text-yellow-400 font-bold">1</span>
                      </div>
                      <div className="text-sm text-yellow-200 mt-2">ultimate challenger</div>
                    </div>

                    <div className="bg-green-600/20 rounded-lg p-4 border border-green-500/30">
                      <div className="flex justify-between items-center">
                        <span className="text-green-300">💰 Prize Money</span>
                        <span className="text-green-400 font-bold">$10,000</span>
                      </div>
                      <div className="text-sm text-green-200 mt-2">championship prize</div>
                    </div>

                    <div className="bg-orange-600/20 rounded-lg p-4 border border-orange-500/30">
                      <div className="flex justify-between items-center">
                        <span className="text-orange-300">🏆 Your Status</span>
                        <span className="text-orange-400 font-bold">FINALIST</span>
                      </div>
                      <div className="text-sm text-orange-200 mt-2">championship round</div>
                    </div>

                    <div className="text-center text-lg text-gray-400 mt-4">
                      {stage === "question" ? `Timer: ${timer}s remaining` :
                        "Final Round - Win the Championship!"}
                    </div>
                  </div>
                )}

                {/* During stats animations */}
                {stage === "roundStats" && (
                  <StatMap
                    total={1}
                    safe={1}
                    progress={statProgress}
                    label="CHAMPION!"
                    showFinalSplit={false}
                    fullScreen={false}
                    playerName={playerName}
                    theme="final"
                  />
                )}

                {/* After stats - show champion celebration */}
                {(stage === "alexVideoPart2" || stage === "congratulations") && (
                  <div className="space-y-6">
                    <div className="text-center mb-6">
                      <div className={`text-xl font-bold text-yellow-400 mb-3 ${championFlash ? 'animate-pulse' : ''
                        }`}>🏆 CHAMPION! 🏆</div>
                    </div>

                    <div className="space-y-4">
                      <div className={`bg-green-600/20 rounded-lg p-4 border border-green-500/30 ${championFlash ? 'animate-pulse bg-yellow-600/30 border-yellow-500/50' : ''
                        }`}>
                        <div className="flex justify-between items-center">
                          <span className="text-green-300">🎉 Final Result</span>
                          <span className="text-green-400 font-bold">WINNER!</span>
                        </div>
                        <div className="text-sm text-green-200 mt-2">{playerName} is champion!</div>
                      </div>

                      <div className={`bg-yellow-600/20 rounded-lg p-4 border border-yellow-500/30 ${championFlash ? 'animate-pulse' : ''
                        }`}>
                        <div className="flex justify-between items-center">
                          <span className="text-yellow-300">💰 Prize Won</span>
                          <span className="text-yellow-400 font-bold">$10,000</span>
                        </div>
                        <div className="text-sm text-yellow-200 mt-2">championship prize</div>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-yellow-500/30">
                      <div className={`bg-yellow-500/20 rounded-lg p-4 border border-yellow-400/50 ${championFlash ? 'animate-pulse' : ''
                        }`}>
                        <div className="flex items-center justify-center space-x-3">
                          <Crown className="text-yellow-400 animate-bounce" />
                          <span className="text-yellow-300 font-semibold">OFFICIAL CHAMPION</span>
                        </div>
                        <div className="text-sm text-yellow-200 text-center mt-2">
                          Got Game Winner!
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Live Chat */}
            <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-yellow-500/50 overflow-hidden shadow-2xl flex-1">
              <div className="bg-gradient-to-r from-yellow-600/30 to-orange-600/30 px-6 py-4 border-b border-yellow-500/30">
                <h3 className="text-xl font-bold text-white flex items-center">
                  LIVE CHAT
                  <span className="ml-3 w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                </h3>
              </div>
              <div className="h-96">
                <ChatBox theme="gold" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AlexVideoPlayer from "@/components/ui/AlexVideoPlayer";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, Lock } from "lucide-react";
import ChatBox from "@/components/ui/ChatBot";

const QUESTION_3 = {
  question: "Who painted the Mona Lisa?",
  options: ["Vincent van Gogh", "Pablo Picasso", "Michelangelo", "Leonardo da Vinci"],
  correctAnswer: "Leonardo da Vinci"
};

const LUCKY_POOL_NAMES = [
  "PlayerXYZ", "GamerABC", "QuizMaster99", "SmartCookie", "BrainTeaser",
  "WisdomSeeker", "ThinkTank", "MindBender", "QuestionKing"
];

export default function Round3Page() {
  const router = useRouter();
  const [stage, setStage] = useState("intro");
  const [statProgress, setStatProgress] = useState(0);
  const [timer, setTimer] = useState(10);
  const [timerActive, setTimerActive] = useState(false);
  const [drawnNames, setDrawnNames] = useState<string[]>([]);
  const [currentDrawnName, setCurrentDrawnName] = useState("");
  const [isPlayerDrawn, setIsPlayerDrawn] = useState(false);
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

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (stage === "roundStats") {
      let filled = 0;
      interval = setInterval(() => {
        filled++;
        setStatProgress(filled);
        if (filled >= 3) {
          clearInterval(interval);
          setStage("alexVideoPart3");
        }
      }, 200);
    }
    return () => clearInterval(interval);
  }, [stage]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (stage === "luckyDraw") {
      let drawCount = 0;
      const availableNames = LUCKY_POOL_NAMES.filter(name => name !== playerName);

      interval = setInterval(() => {
        if (drawCount < 6) {
          const randomName = availableNames[Math.floor(Math.random() * availableNames.length)];
          setCurrentDrawnName(randomName);
          setDrawnNames(prev => [...prev, randomName]);
          drawCount++;
        } else if (drawCount === 6) {
          setCurrentDrawnName(playerName);
          setDrawnNames(prev => [...prev, playerName]);
          setIsPlayerDrawn(true);
          drawCount++;
        } else {
          clearInterval(interval);
          setTimeout(() => setStage("luckyDrawEnd"), 2000);
        }
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [stage, playerName]);

  const handleVideoEnd = () => {
    if (stage === "intro") {
      setStage("question");
      setTimerActive(true);
    }
    else if (stage === "answerReaction") {
      setStage("roundStats");
    }
    else if (stage === "alexVideoPart3") {
      router.push("/lucky-draw?round=3&comeback=true");
    }
  };

  useEffect(() => {
    if (stage === "question") {
      setTimerActive(true);
    }
  }, [stage]);

  // Determine if we should show question (affects layout)
  const showQuestion = stage === "question";
  
  // Determine if this is an audio-only stage
  const isAudioStage = stage === "answerReaction";

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
          background: #ec4899;
          box-shadow: 0 0 6px #ec4899;
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0; transform: scale(0.5); }
          50% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>

      {/* Enhanced Top Game Header */}
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
            <h1 className="text-3xl font-bold text-white">🎲 ROUND 3</h1>
            <div className="text-purple-100 text-lg font-medium">
              {stage === "question"
                ? `🎯 ${playerName} in the Lucky Pool!`
                : stage === "answerReaction"
                ? `⏳ ${playerName} waiting in Pool...`
                : stage === "alexVideoPart3"
                ? "🎲 Get ready for the Lucky Draw..."
                : stage === "roundStats"
                ? "📊 Only 3 got it right!"
                : "🍀 Lucky Pool Round"}
            </div>
          </div>
          <div className="flex items-center space-x-6 text-lg font-semibold">
            <div className="bg-black/40 px-4 py-2 rounded-xl backdrop-blur-sm border border-white/20">
              👥 PLAYERS: 10
            </div>
            <div className="bg-black/40 px-4 py-2 rounded-xl backdrop-blur-sm border border-white/20">
              🎯 3 Safe / 7 Lucky
            </div>
            <div className="bg-purple-500/30 px-4 py-2 rounded-xl text-purple-200 backdrop-blur-sm border border-purple-400/40">
              🍀 LUCKY POOL
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
            <div className="bg-gradient-to-br from-gray-900/80 to-black/80 rounded-2xl border border-purple-500/50 overflow-hidden shadow-2xl backdrop-blur-sm">
              <div className="bg-gradient-to-r from-purple-600/30 to-indigo-600/30 px-6 py-3 border-b border-purple-500/30 backdrop-blur-sm">
                <h2 className="text-xl font-bold text-white">🎤 Alex - Your Host</h2>
              </div>
              <div className="p-6">
                <div className={`w-full ${showQuestion ? 'h-64' : 'h-96'} rounded-xl overflow-hidden bg-black relative transition-all duration-500`}>
                  {(stage === "intro" || stage === "answerReaction" || stage === "alexVideoPart3") && (
                    <AlexVideoPlayer
                      src={
                        stage === "intro"
                          ? "/video/round3-video1.mp4"
                          : stage === "answerReaction"
                          ? "/video/alex-question3-part2.mp3"
                          : "/video/round3-video3.mp4"
                      }
                      onEnded={handleVideoEnd}
                      autoPlay
                      key={stage}
                    />
                  )}
                  <div className="absolute top-2 left-2 bg-black/70 text-white text-xs p-2 rounded backdrop-blur-sm">
                    Stage: {stage}
                  </div>
                </div>
              </div>
            </div>

            {/* Full-Screen Stats During Audio */}
            {isAudioStage && (
              <div className="bg-gradient-to-br from-purple-900/80 to-indigo-900/80 rounded-2xl border border-purple-500/50 shadow-2xl backdrop-blur-sm p-8">
                <div className="text-center space-y-6">
                  <h2 className="text-4xl font-bold text-white">🍀 LUCKY POOL STATUS</h2>
                  <div className="text-6xl font-bold text-purple-400">
                    ⏳
                  </div>
                  <div className="text-2xl text-white">
                    {playerName} is locked in the Lucky Pool...
                  </div>
                  <div className="text-lg text-purple-200">
                    Waiting for other players to finish answering
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-4">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-4 rounded-full animate-pulse" style={{width: '70%'}}></div>
                  </div>
                </div>
              </div>
            )}

            {/* Round Stats Display */}
            {stage === "roundStats" && (
              <div className="bg-gradient-to-br from-indigo-900/80 to-purple-900/80 rounded-2xl border border-indigo-500/50 shadow-2xl backdrop-blur-sm p-8">
                <div className="text-center space-y-6">
                  <h2 className="text-4xl font-bold text-white">📊 ROUND 3 RESULTS</h2>
                  <div className="text-6xl font-bold text-indigo-400">
                    3️⃣
                  </div>
                  <div className="text-2xl text-white">
                    Only 3 players got it correct!
                  </div>
                  <div className="text-lg text-indigo-200">
                    Drawing 7 lucky players to advance...
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-4">
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-4 rounded-full animate-pulse" style={{width: `${(statProgress / 3) * 100}%`}}></div>
                  </div>
                </div>
              </div>
            )}

            {/* Locked Question Block */}
            {stage === "question" && (
              <div className="bg-gradient-to-br from-indigo-900/60 to-purple-900/60 rounded-2xl border border-purple-400/50 shadow-2xl backdrop-blur-sm relative overflow-hidden">
                {/* Lock Overlay Effect */}
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] z-10 flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <Lock className="w-16 h-16 text-purple-400 mx-auto animate-pulse" />
                    <div className="text-2xl font-bold text-purple-300">🔒 LOCKED</div>
                    <div className="text-lg text-purple-200">{playerName} is in Lucky Pool</div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-purple-500/40 to-indigo-500/40 px-6 py-4 border-b border-purple-400/30 flex justify-between items-center backdrop-blur-sm">
                  <h2 className="text-2xl font-bold text-white">🍀 LUCKY POOL - QUESTION LOCKED</h2>
                  <div className="text-purple-400 text-2xl font-bold flex items-center animate-pulse">
                    <Clock className="mr-2" /> {timer}s
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-xl text-white mb-6 font-medium opacity-50">{QUESTION_3.question}</p>
                  <div className="grid grid-cols-1 gap-4">
                    {QUESTION_3.options.map((opt, idx) => (
                      <Button
                        key={opt}
                        className="h-16 text-lg font-semibold rounded-xl px-6 flex justify-between items-center bg-gray-600/50 cursor-not-allowed opacity-40"
                        disabled={true}
                      >
                        <span className="flex items-center">
                          <span className="bg-white/10 w-8 h-8 rounded-full flex items-center justify-center mr-3 font-bold">
                            {String.fromCharCode(65 + idx)}
                          </span>
                          {opt}
                        </span>
                        {opt === QUESTION_3.correctAnswer && <CheckCircle className="ml-2 text-green-400/50" />}
                      </Button>
                    ))}
                  </div>
                  <div className="mt-6 text-center text-purple-300 text-lg font-medium">
                    🔒 {playerName} is in the Lucky Pool - This question is locked
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Game Stats & Chat */}
          {showQuestion && (
            <div className="col-span-4 space-y-6">
              
              {/* Game Stats Panel */}
              <div className="bg-gradient-to-br from-gray-900/80 to-black/80 rounded-2xl border border-purple-500/50 overflow-hidden shadow-2xl backdrop-blur-sm">
                <div className="bg-gradient-to-r from-purple-600/40 to-indigo-600/40 px-4 py-3 border-b border-purple-500/30 backdrop-blur-sm">
                  <h3 className="text-lg font-bold text-white">📊 GAME STATS</h3>
                </div>
                <div className="p-4">
                  <div className="text-center space-y-4">
                    <div className="text-3xl font-bold text-purple-400">🍀</div>
                    <div className="text-lg text-white font-medium">{playerName} Status</div>
                    <div className="text-sm text-purple-200">
                      {stage === "question" ? `⏰ Timer: ${timer}s` : 
                       stage === "answerReaction" ? "🔒 Locked. Waiting..." :
                       stage === "alexVideoPart3" ? "🎲 Preparing Lucky Draw..." :
                       stage === "roundStats" ? "📊 Only 3 correct!" :
                       "🍀 In the Lucky Pool"}
                    </div>
                    <div className="bg-purple-500/20 p-3 rounded-lg">
                      <div className="text-sm text-purple-300">Lucky Pool Player</div>
                      <div className="text-xs text-purple-400">Question locked - awaiting draw</div>
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
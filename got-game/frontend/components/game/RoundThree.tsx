"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import AlexVideoPlayer from "@/components/ui/AlexVideoPlayer";
import StatMap from "@/components/ui/StatMap";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, Lock } from "lucide-react";
import ChatBox from "@/components/ui/ChatBot";

const QUESTION_3 = {
  question: "Who painted the Mona Lisa?",
  options: ["Vincent van Gogh", "Pablo Picasso", "Michelangelo", "Leonardo da Vinci"],
  correctAnswer: "Leonardo da Vinci",
};

// Random names for lucky draw
const LUCKY_POOL_NAMES = [
  "PlayerXYZ",
  "GamerABC",
  "QuizMaster99",
  "SmartCookie",
  "BrainTeaser",
  "WisdomSeeker",
  "ThinkTank",
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

  /* ------------ SFX (identical pattern to Round 2) ------------ */
  const whooshRef = useRef<HTMLAudioElement | null>(null);
  const loopRef   = useRef<HTMLAudioElement | null>(null);
  const chimeRef  = useRef<HTMLAudioElement | null>(null);
  const crowdRef  = useRef<HTMLAudioElement | null>(null);
  const [audioPrimed, setAudioPrimed] = useState(false);

  // preload like Round 2
  useEffect(() => {
    whooshRef.current = new Audio("/sfx/whoosh.wav");

    loopRef.current = new Audio("/sfx/fill-loop.wav");
    if (loopRef.current) {
      loopRef.current.loop = true;
      loopRef.current.volume = 0.25;
    }

    chimeRef.current = new Audio("/sfx/chime.wav");
    if (chimeRef.current) chimeRef.current.volume = 0.7;

    crowdRef.current = new Audio("/sfx/crowd-cheer.wav");
    if (crowdRef.current) crowdRef.current.volume = 0.65;

    return () => {
      [whooshRef.current, loopRef.current, chimeRef.current, crowdRef.current].forEach((a) => {
        if (!a) return;
        a.pause();
        a.currentTime = 0;
      });
    };
  }, []);

  // prime on first gesture
  const primeAudio = async () => {
    if (audioPrimed) return;
    try {
      await whooshRef.current?.play();
      whooshRef.current?.pause();
      if (whooshRef.current) whooshRef.current.currentTime = 0;
      setAudioPrimed(true);
    } catch { /* ignore */ }
  };
  /* ------------------------------------------------------------ */

  // Get player name
  useEffect(() => {
    const name = localStorage.getItem("playerName") || "Player";
    setPlayerName(name);
  }, []);

  // Timer
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (stage === "question" && timerActive && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            setTimerActive(false);
            setStage("answerReaction");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [stage, timerActive, timer]);

  // STAT MAP animation + AUDIO (whoosh -> loop while filling -> chime)
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (stage === "roundStats") {
      setShowFullScreenStats(true);
      setStatProgress(0);

      // SFX same as Round 2
      whooshRef.current?.play().catch(() => {});
      if (loopRef.current) {
        loopRef.current.currentTime = 0;
        loopRef.current.play().catch(() => {});
      }

      let filled = 0;
      interval = setInterval(() => {
        filled++;
        setStatProgress(filled);
        if (filled >= 3) {
          if (interval) clearInterval(interval);
          loopRef.current?.pause();
          chimeRef.current?.play().catch(() => {});
          setTimeout(() => {
            setShowFullScreenStats(false);
            setStage("alexVideoPart3");
          }, 1200);
        }
      }, 200);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [stage]);

  // Lucky Draw animation (with light SFX)
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (stage === "luckyDraw") {
      setShowLuckyDraw(true);
      setDrawnNames([]);
      setCurrentDrawnName("");

      if (loopRef.current) {
        loopRef.current.currentTime = 0;
        loopRef.current.play().catch(() => {});
      }

      let drawCount = 0;
      interval = setInterval(() => {
        if (drawCount < 6) {
          const randomName = LUCKY_POOL_NAMES[drawCount % LUCKY_POOL_NAMES.length];
          setCurrentDrawnName(randomName);
          setDrawnNames((prev) => [...prev, randomName]);
          drawCount++;
          whooshRef.current?.play().catch(() => {}); // tick per reveal
        } else if (drawCount === 6) {
          setCurrentDrawnName(playerName);
          setDrawnNames((prev) => [...prev, playerName]);
          if (interval) clearInterval(interval);

          loopRef.current?.pause();
          chimeRef.current?.play().catch(() => {});
          crowdRef.current?.play().catch(() => {});

          setTimeout(() => {
            setShowLuckyDraw(false);
            setStage("alexVideoPart5");
          }, 3000);
        }
      }, 1500);
    }
    return () => {
      if (interval) clearInterval(interval);
      loopRef.current?.pause();
    };
  }, [stage, playerName]);

  const handleVideoEnd = () => {
    if (stage === "intro") {
      setCurrentVideoKey((p) => p + 1);
      setStage("question");
      setTimerActive(true);
    } else if (stage === "answerReaction") {
      setCurrentVideoKey((p) => p + 1);
      setStage("roundStats");
    } else if (stage === "alexVideoPart3") {
      setCurrentVideoKey((p) => p + 1);
      setStage("luckyDraw");
    } else if (stage === "alexVideoPart5") {
      router.push("/game/4");
    }
  };

  useEffect(() => {
    if (stage === "question") setTimerActive(true);
  }, [stage]);

  return (
    // prime on first tap so autoplay policies don't block stat-map audio
    <main
      className="min-h-screen bg-black bg-[url('/images/lobby-background.jpg')] bg-cover bg-center bg-no-repeat bg-fixed text-white relative"
      onPointerDown={primeAudio}
    >
      {/* Full Screen Stats Overlay */}
      {showFullScreenStats && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-lg" />

          <div className="relative z-10 bg-gradient-to-br from-purple-900/95 to-blue-900/95 rounded-3xl border border-purple-400/50 shadow-2xl p-16 max-w-6xl mx-auto animate-in zoom-in-95 duration-500">
            <div className="text-center space-y-12">
              <h2 className="text-6xl font-bold text-white mb-12">ROUND 3 RESULTS</h2>

              <div className="space-y-12">
                <div className="grid grid-cols-3 gap-12 items-center">
                  <div className="text-center space-y-6">
                    <div className="w-32 h-32 mx-auto bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-4xl font-bold">👥</span>
                    </div>
                    <div className="text-3xl font-bold text-blue-400">100</div>
                    <div className="text-lg text-gray-300">Total Players</div>
                  </div>

                  <div className="text-center space-y-4">
                    <div className="text-6xl text-purple-400">→</div>
                    <div className="text-lg text-purple-300 mt-4">Answered Correctly</div>
                  </div>

                  <div className="text-center space-y-6">
                    <div className="w-32 h-32 mx-auto bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-4xl font-bold">✅</span>
                    </div>
                    <div className="text-4xl font-bold text-green-400">{statProgress.toLocaleString()}</div>
                    <div className="text-lg text-gray-300">Correct Answers</div>
                  </div>
                </div>

                <div className="bg-gray-800 rounded-full h-12 overflow-hidden mx-8">
                  <div
                    className="bg-gradient-to-r from-green-500 to-emerald-400 h-full transition-all duration-300 rounded-full flex items-center justify-end pr-6"
                    style={{ width: `${(statProgress / 3) * 100}%` }}
                  >
                    <span className="text-white font-bold text-lg">
                      {statProgress >= 3 ? "Complete!" : `${Math.round((statProgress / 3) * 100)}%`}
                    </span>
                  </div>
                </div>

                {statProgress >= 3 && (
                  <div className="space-y-8 animate-in fade-in duration-1000">
                    <div className="text-3xl text-green-400 font-bold">Only 3 Players Got It Right!</div>
                    <div className="text-xl text-yellow-300">7 spots open from Lucky Pool to reach 10 total!</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lucky Draw Overlay */}
      {showLuckyDraw && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-lg" />

          <div className="relative z-10 bg-gradient-to-br from-yellow-900/95 to-orange-900/95 rounded-3xl border border-yellow-400/50 shadow-2xl p-16 max-w-6xl mx-auto animate-in zoom-in-95 duration-500">
            <div className="text-center space-y-12">
              <h2 className="text-6xl font-bold text-white mb-12">LUCKY DRAW</h2>

              <div className="space-y-8">
                <div className="text-4xl font-bold text-yellow-400">Drawing 7 Lucky Winners...</div>

                <div className="bg-black/30 rounded-2xl p-12 min-h-[250px] flex items-center justify-center">
                  <div className="text-5xl font-bold text-white animate-pulse">{currentDrawnName || "Starting Draw..."}</div>
                </div>

                <div className="text-2xl text-yellow-300">{drawnNames.length} / 7 Names Drawn</div>

                {drawnNames.length >= 7 && drawnNames[6] === playerName && (
                  <div className="text-3xl text-green-400 font-bold animate-pulse">{playerName} is BACK IN THE GAME!</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Top Game Header */}
      <div className="w-full bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 p-6 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-4">
          <div className="flex items-center space-x-8">
            <h1 className="text-3xl font-bold text-white">ROUND 3</h1>
            <div className="text-purple-100 text-lg">
              {stage === "question"
                ? "Question Locked - Lucky Pool Player"
                : stage === "answerReaction"
                ? "Waiting in Lucky Pool..."
                : stage === "roundStats"
                ? "Showing Statistics"
                : stage === "luckyDraw"
                ? "Lucky Draw in Progress"
                : "The Final Challenge"}
            </div>
          </div>
          <div className="flex items-center space-x-6 text-lg">
            <div className="bg-black/30 px-4 py-2 rounded">PLAYERS: 100</div>
            <div className="bg-black/30 px-4 py-2 rounded">TARGET: 10</div>
            <div className="bg-purple-500/20 px-4 py-2 rounded text-purple-300">ROUND 3</div>
          </div>
        </div>
      </div>

      {/* Main Game Area */}
      <div className="max-w-7xl mx-auto p-8">
        <div className="grid grid-cols-12 gap-8 min-h-[calc(100vh-140px)]">
          {/* Left Column - Main Content */}
          <div className="col-span-8 flex flex-col space-y-8">
            {/* Alex Video Section */}
            <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-purple-500/50 overflow-hidden shadow-2xl flex-1 flex flex-col">
              <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 px-6 py-4 border-b border-purple-500/30">
                <h2 className="text-xl font-semibold text-white">Alex - Your Host</h2>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <div className="w-full rounded-xl overflow-hidden bg-black flex-1 min-h-0">
                  {(stage === "intro" || stage === "answerReaction" || stage === "alexVideoPart3" || stage === "alexVideoPart5") && (
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
                    />
                  )}

                  {stage === "question" && (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-900/20 to-blue-900/20">
                      <div className="text-center space-y-6 p-8">
                        <div className="text-4xl">🔒</div>
                        <div className="text-2xl font-semibold text-purple-300">Question Locked</div>
                        <div className="text-lg text-gray-400">You're in the Lucky Pool</div>
                      </div>
                    </div>
                  )}

                  {(stage === "roundStats" || stage === "luckyDraw") && (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-900/20 to-blue-900/20">
                      <div className="text-center space-y-6 p-8">
                        <div className="text-4xl">{stage === "roundStats" ? "🎯" : "🎲"}</div>
                        <div className="text-2xl font-semibold text-purple-300">
                          {stage === "roundStats" ? "Calculating Results..." : "Lucky Draw in Progress..."}
                        </div>
                        <div className="text-lg text-gray-400">Check the full screen for detailed results!</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Question Section - Locked */}
            {stage === "question" && (
              <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 rounded-2xl border border-purple-400/50 shadow-xl relative overflow-hidden">
                <div className="absolute inset-0 bg-black/30 backdrop-blur-sm z-10 flex items-center justify-center">
                  <div className="text-center space-y-6 p-8">
                    <Lock className="w-16 h-16 text-purple-400 mx-auto animate-pulse" />
                    <div className="text-2xl font-bold text-purple-300">🔒 LOCKED</div>
                    <div className="text-lg text-purple-200">{playerName} in Lucky Pool</div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-500/30 to-blue-500/30 px-8 py-6 border-b border-purple-400/30 flex justify-between items-center">
                  <h2 className="text-3xl font-bold text-white">QUESTION 3</h2>
                  <div className="text-red-400 text-2xl font-bold flex items-center">
                    <Clock className="mr-2" /> {timer}s
                  </div>
                </div>
                <div className="p-8">
                  <p className="text-2xl text-white mb-8 leading-relaxed">{QUESTION_3.question}</p>
                  <div className="grid grid-cols-2 gap-6">
                    {QUESTION_3.options.map((opt, idx) => (
                      <Button
                        key={opt}
                        className="h-20 text-xl font-semibold transition-all duration-300 rounded-xl px-8 flex justify-between items-center bg-gray-600/50 cursor-not-allowed opacity-60"
                        disabled
                      >
                        <span className="text-lg">
                          {String.fromCharCode(65 + idx)}. {opt}
                        </span>
                        {opt === QUESTION_3.correctAnswer && <CheckCircle className="ml-3 text-green-400/50" />}
                      </Button>
                    ))}
                  </div>
                  <div className="mt-6 text-center text-purple-300 text-lg">🔒 Lucky Pool players cannot answer this question</div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Stats & Chat */}
          <div className="col-span-4 space-y-8">
            <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-purple-500/50 overflow-hidden shadow-2xl">
              <div className="bg-gradient-to-r from-purple-600/30 to-blue-600/30 px-6 py-4 border-b border-purple-500/30">
                <h3 className="text-xl font-bold text-white">📊 GAME STATS</h3>
              </div>
              <div className="p-6">
                {(stage === "intro" || stage === "question" || stage === "answerReaction") && (
                  <div className="text-center space-y-6">
                    <div className="text-xl font-bold text-purple-400 mb-4">Round 3 Info</div>

                    <div className="bg-blue-600/20 rounded-lg p-4 border border-blue-500/30">
                      <div className="flex justify-between items-center">
                        <span className="text-blue-300">👥 Total Players</span>
                        <span className="text-blue-400 font-bold">100</span>
                      </div>
                      <div className="text-sm text-blue-200 mt-2">competing this round</div>
                    </div>

                    <div className="bg-purple-600/20 rounded-lg p-4 border border-purple-500/30">
                      <div className="flex justify-between items-center">
                        <span className="text-purple-300">🎯 Target for Next Round</span>
                        <span className="text-purple-400 font-bold">10</span>
                      </div>
                      <div className="text-sm text-purple-200 mt-2">spots available</div>
                    </div>

                    <div className="bg-yellow-600/20 rounded-lg p-4 border border-yellow-500/30">
                      <div className="flex justify-between items-center">
                        <span className="text-yellow-300">🍀 Player Status</span>
                        <span className="text-yellow-400 font-bold">LUCKY POOL</span>
                      </div>
                      <div className="text-sm text-yellow-200 mt-2">awaiting draw</div>
                    </div>

                    <div className="text-center text-lg text-gray-400 mt-4">
                      {stage === "question" ? `Timer: ${timer}s remaining` : stage === "answerReaction" ? "Waiting for results..." : "Round 3 in progress..."}
                    </div>
                  </div>
                )}

                {stage === "roundStats" && (
                  <StatMap
                    total={100}
                    safe={3}
                    progress={statProgress}
                    label="3 correct answers, 7 lucky draw spots"
                    showFinalSplit={false}
                    fullScreen={false}
                    playerName={playerName}
                    theme="purple"
                  />
                )}

                {(stage === "alexVideoPart3" || stage === "luckyDraw") && (
                  <div className="space-y-6">
                    <div className="text-center mb-6">
                      <div className="text-xl font-bold text-purple-400 mb-3">Round 3 Results</div>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-green-600/20 rounded-lg p-4 border border-green-500/30">
                        <div className="flex justify-between items-center">
                          <span className="text-green-300">✅ Correct Answers</span>
                          <span className="text-green-400 font-bold">3</span>
                        </div>
                        <div className="text-sm text-green-200 mt-2">out of 100 players</div>
                      </div>

                      <div className="bg-orange-600/20 rounded-lg p-4 border border-orange-500/30">
                        <div className="flex justify-between items-center">
                          <span className="text-orange-300">🎲 Lucky Draw Spots</span>
                          <span className="text-orange-400 font-bold">7</span>
                        </div>
                        <div className="text-sm text-orange-200 mt-2">available from lucky pool</div>
                      </div>

                      <div className="bg-purple-600/20 rounded-lg p-4 border border-purple-500/30">
                        <div className="flex justify-between items-center">
                          <span className="text-purple-300">🍀 Your Status</span>
                          <span className="text-purple-400 font-bold">
                            {stage === "luckyDraw" && drawnNames.includes(playerName) ? "SELECTED!" : "LUCKY POOL"}
                          </span>
                        </div>
                        <div className="text-sm text-purple-200 mt-2">
                          {stage === "luckyDraw" && drawnNames.includes(playerName) ? "back in the game!" : "awaiting draw results"}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {stage === "alexVideoPart5" && (
                  <div className="space-y-6">
                    <div className="text-center mb-6">
                      <div className="text-xl font-bold text-purple-400 mb-3">Lucky Draw Complete</div>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-green-600/20 rounded-lg p-4 border border-green-500/30">
                        <div className="flex justify-between items-center">
                          <span className="text-green-300">🎉 Final Result</span>
                          <span className="text-green-400 font-bold">SELECTED</span>
                        </div>
                        <div className="text-sm text-green-200 mt-2">{playerName} is back!</div>
                      </div>

                      <div className="bg-blue-600/20 rounded-lg p-4 border border-blue-500/30">
                        <div className="flex justify-between items-center">
                          <span className="text-blue-300">🎯 Total Advancing</span>
                          <span className="text-blue-400 font-bold">10</span>
                        </div>
                        <div className="text-sm text-blue-200 mt-2">3 correct + 7 lucky</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Live Chat */}
            <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-purple-500/50 overflow-hidden shadow-2xl flex-1">
              <div className="bg-gradient-to-r from-purple-600/30 to-blue-600/30 px-6 py-4 border-b border-purple-500/30">
                <h3 className="text-xl font-bold text-white flex items-center">
                  LIVE CHAT <span className="ml-3 w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                </h3>
              </div>
              <div className="h-96">
                <ChatBox theme="purple" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

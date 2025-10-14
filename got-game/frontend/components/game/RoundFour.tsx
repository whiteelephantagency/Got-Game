"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import AlexVideoPlayer from "@/components/ui/AlexVideoPlayer";
import StatMap from "@/components/ui/StatMap";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock } from "lucide-react";
import ChatBox from "@/components/ui/ChatBot";
import Image from "next/image";

// const QUESTION_4 = {
//   question: "What is the largest ocean on Earth?",
//   options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
//   correctAnswer: "Pacific Ocean",
// };
const QUESTION_4 = {
  question: "How old is Baby Dev, the youngest contestant ever to appear on AGT?",
  options: ["5 Years", "4 Years", "3 Years", "2 Years"],
  correctAnswer: "2 Years",
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

  /* ------------ SFX (same behavior as R2/R3) ------------ */
  const whooshRef = useRef<HTMLAudioElement | null>(null);
  const loopRef = useRef<HTMLAudioElement | null>(null);
  const chimeRef = useRef<HTMLAudioElement | null>(null);
  const [audioPrimed, setAudioPrimed] = useState(false);

  // Ensure the <audio> elements are loaded and ready
  useEffect(() => {
    whooshRef.current?.load?.();
    loopRef.current?.load?.();
    chimeRef.current?.load?.();
  }, []);

  // Prime audio on first user gesture (works even if user never clicks an answer)
  useEffect(() => {
    if (audioPrimed) return;
    const unlock = async () => {
      try {
        // play-pause a silent start to satisfy autoplay policies
        const a = whooshRef.current;
        if (a) {
          const prev = a.volume;
          a.volume = 0;
          await a.play();
          a.pause();
          a.currentTime = 0;
          a.volume = prev;
        }
        setAudioPrimed(true);
      } catch {
        // ignore
      } finally {
        window.removeEventListener("pointerdown", unlock);
        window.removeEventListener("keydown", unlock);
      }
    };
    window.addEventListener("pointerdown", unlock, { once: true });
    window.addEventListener("keydown", unlock, { once: true });
    return () => {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
    };
  }, [audioPrimed]);

  const primeAudio = () => {
    // also call this in onPointerDown of <main> and on correct answer click
    if (audioPrimed) return;
    const el = whooshRef.current;
    if (!el) return;
    el.volume = 0;
    el.play().then(() => {
      el.pause();
      el.currentTime = 0;
      el.volume = 1;
      setAudioPrimed(true);
    }).catch(() => { });
  };
  /* ------------------------------------------------------ */

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
            setStage("roundStats");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => { if (interval) clearInterval(interval); };
  }, [stage, timerActive, timer]);

  // STAT MAP animation + AUDIO (whoosh -> loop during fill -> chime)
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

    if (stage === "roundStats") {
      setShowFullScreenStats(true);
      setStatProgress(0);

      // play whoosh
      whooshRef.current?.play().catch(() => { });
      // start loop
      if (loopRef.current) {
        loopRef.current.currentTime = 0;
        loopRef.current.loop = true;
        loopRef.current.volume = 0.25;
        loopRef.current.play().catch(() => { });
      }

      let filled = 0;
      interval = setInterval(() => {
        filled++;
        setStatProgress(filled);
        if (filled >= 1) {
          if (interval) clearInterval(interval);
          // stop loop, play chime
          loopRef.current?.pause();
          loopRef.current && (loopRef.current.currentTime = 0);
          chimeRef.current?.play().catch(() => { });
          setFinalistFlash(true);
          setTimeout(() => {
            setShowFullScreenStats(false);
            setStage("alexVideoPart2");
          }, 4000);
        }
      }, 200);
    }

    return () => {
      if (interval) clearInterval(interval);
      loopRef.current?.pause();
    };
  }, [stage]);

  // Flash pulse keeper (no logic, keeps animations lively)
  useEffect(() => {
    let flashInterval: ReturnType<typeof setInterval> | null = null;
    if (finalistFlash) {
      flashInterval = setInterval(() => { }, 500);
    }
    return () => { if (flashInterval) clearInterval(flashInterval); };
  }, [finalistFlash]);

  const handleVideoEnd = () => {
    if (stage === "intro") {
      setCurrentVideoKey((prev) => prev + 1);
      setStage("questionRelatedVideo");
      setTimerActive(true);
    } else if (stage === 'questionRelatedVideo') {
      setCurrentVideoKey((prev) => prev + 1);
      setStage("question");
      setTimerActive(true);
    }
    else if (stage === "alexVideoPart2") {
      router.push("/game/5");
    }
  };

  const handleAnswer = (option: string) => {
    primeAudio(); // guarantee unlock
    if (lockOptions || option !== QUESTION_4.correctAnswer) return;
    setSelected(option);
    setLockOptions(true);
    setTimerActive(false);
    setTimeout(() => setStage("roundStats"), 1000);
  };

  useEffect(() => {
    if (stage === "question") setTimerActive(true);
  }, [stage]);

  return (
    <main
      className="min-h-screen bg-black bg-[url('/images/lobby-background.jpg')] bg-cover bg-center bg-no-repeat bg-fixed text-white relative"
      onPointerDown={primeAudio}
    >
      {/* Hidden audio elements */}
      <div className="absolute -left-[9999px] -top-[9999px] w-0 h-0 overflow-hidden" aria-hidden>
        <audio ref={whooshRef} src="/sfx/whoosh.mp3" preload="auto" />
        <audio ref={loopRef} src="/sfx/fill-loop.mp3" preload="auto" />
        <audio ref={chimeRef} src="/sfx/chime.mp3" preload="auto" />
      </div>

      {/* Full Screen Stats Overlay */}
      {showFullScreenStats && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-lg"></div>

          <div className="relative z-10 bg-gradient-to-br from-purple-900/95 to-blue-900/95 rounded-3xl border border-purple-400/50 shadow-2xl p-16 max-w-6xl mx-auto animate-in zoom-in-95 duration-500">
            <div className="text-center space-y-12">
              <h2 className="text-6xl font-bold text-white mb-12">ROUND 4 RESULTS</h2>

              <div className="space-y-12">
                <div className="grid grid-cols-3 gap-12 items-center">
                  <div className="text-center space-y-6">
                    <div className="w-32 h-32 mx-auto bg-white rounded-full flex items-center justify-center">
                      <span className="text-4xl font-bold">👥</span>
                    </div>
                    <div className="text-3xl font-bold text-blue-400">10</div>
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
                    <div className="text-4xl font-bold text-green-400">
                      {statProgress.toLocaleString()}
                    </div>
                    <div className="text-lg text-gray-300">Correct Answers</div>
                  </div>
                </div>

                <div className="bg-gray-800 rounded-full h-12 overflow-hidden mx-8">
                  <div
                    className="bg-gradient-to-r from-green-500 to-emerald-400 h-full transition-all duration-300 rounded-full flex items-center justify-end pr-6"
                    style={{ width: `${(statProgress / 1) * 100}%` }}
                  >
                    <span className="text-white font-bold text-lg">
                      {statProgress >= 1 ? "Complete!" : `${Math.round((statProgress / 1) * 100)}%`}
                    </span>
                  </div>
                </div>

                {statProgress >= 1 && (
                  <div className="space-y-8 animate-in fade-in duration-1000">
                    <div className="text-3xl text-green-400 font-bold">Only You Got It Right!</div>
                    <div className="text-2xl text-yellow-300 animate-pulse">
                      {playerName} ADVANCES TO THE FINAL!
                    </div>
                  </div>
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
            <Image
              width={100}
              height={50}
              alt="logo"
              src={'/images/Gotgamelogo.png'}
            />
            {/* <div className="text-purple-100 text-lg">
              {stage === "question" ? `Answer the Question! (${timer}s)` :
               stage === "roundStats" ? "Showing Statistics" :
               stage === "alexVideoPart2" ? "Congratulations!" :
               "The Final Challenge"}
            </div> */}
          </div>
          <h3 className="flex items-center space-x-6 text-3xl font-bold text-white">ROUND 4</h3>
          {/* <div className="flex items-center space-x-6 text-lg">
            <div className="bg-black/30 px-4 py-2 rounded">PLAYERS: 10</div>
            <div className="bg-black/30 px-4 py-2 rounded">TARGET: 1</div>
            <div className="bg-purple-500/20 px-4 py-2 rounded text-purple-300">ROUND 4</div>
          </div> */}
        </div>
      </div>

      {/* Main Game Area */}
      <div className="max-w-7xl mx-auto p-8">
        <div className="grid grid-cols-12 gap-8 min-h-[calc(100vh-140px)]">
          {/* Left Column - Main Content */}
          <div className="col-span-8 flex flex-col space-y-8">
            {/* Alex Video */}
            <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-purple-500/50 overflow-hidden shadow-2xl flex-1 flex flex-col">
              <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 px-6 py-4 border-b border-purple-500/30">
                <h2 className="text-xl font-semibold text-white">Alex - Your Host</h2>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <div className="w-full rounded-xl overflow-hidden bg-black flex-1 min-h-0">
                  {(stage === "intro" || stage === "alexVideoPart2" || stage === 'questionRelatedVideo') && (
                    <AlexVideoPlayer
                      src={stage === "intro" ? "/video/round4-intro.mp4" : stage === 'questionRelatedVideo' ? "/video/round4-video2-2.mp4" : "/video/round4-video2.mp4"}
                      onEnded={handleVideoEnd}
                      autoPlay
                      key={`video-${stage}-${currentVideoKey}`}
                      className="w-full h-full object-cover"
                    />
                  )}

                  {stage === "question" && (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-900/20 to-blue-900/20">
                      <div className="text-center space-y-6 p-8">
                        <div className="text-4xl">🏁</div>
                        <div className="text-2xl font-semibold text-purple-300">Final Question!</div>
                        <div className="text-lg text-gray-400">Time is ticking: {timer}s</div>
                      </div>
                    </div>
                  )}

                  {stage === "roundStats" && (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-900/20 to-blue-900/20">
                      <div className="text-center space-y-6 p-8">
                        <div className="text-4xl">🏆</div>
                        <div className="text-2xl font-semibold text-purple-300">Calculating Final Results...</div>
                        <div className="text-lg text-gray-400">Check the full screen for detailed results!</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Question */}
            {stage === "question" && (
              <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 rounded-2xl border border-purple-400/50 shadow-xl">
                <div className="bg-gradient-to-r from-purple-500/30 to-blue-500/30 px-8 py-6 border-b border-purple-400/30 flex justify-between items-center">
                  <h2 className="text-3xl font-bold text-white">QUESTION 4</h2>
                  <div className="text-red-400 text-2xl font-bold flex items-center">
                    <Clock className="mr-2" /> {timer}s
                  </div>
                </div>
                <div className="p-8">
                  <p className="text-2xl text-white mb-8 leading-relaxed">{QUESTION_4.question}</p>
                  <div className="grid grid-cols-2 gap-6">
                    {QUESTION_4.options.map((opt, idx) => (
                      <Button
                        key={opt}
                        className={`h-20 text-xl font-semibold transition-all duration-300 rounded-xl px-8 flex justify-between items-center
                          ${selected === opt
                            ? opt === QUESTION_4.correctAnswer
                              ? "bg-green-600 shadow-lg shadow-green-500/50"
                              : "bg-red-600 shadow-lg shadow-red-500/50"
                            : opt === QUESTION_4.correctAnswer
                              ? "bg-purple-700 hover:bg-purple-600 ring-2 ring-purple-400 shadow-lg hover:shadow-purple-500/50"
                              : "bg-gray-600/50 cursor-not-allowed opacity-60"
                          }`}
                        disabled={lockOptions || opt !== QUESTION_4.correctAnswer || timer === 0}
                        onClick={() => { primeAudio(); handleAnswer(opt); }}
                      >
                        <span className="text-lg">
                          {String.fromCharCode(65 + idx)}. {opt}
                        </span>
                        {lockOptions && opt === QUESTION_4.correctAnswer && <CheckCircle className="ml-3 text-green-300" />}
                      </Button>
                    ))}
                  </div>
                  <div className="mt-6 text-center text-purple-300 text-lg">
                    {!lockOptions && timer > 0 && "Only the correct answer is clickable - find it!"}
                    {!lockOptions && timer === 0 && "Time's up! Auto-advancing..."}
                    {lockOptions && selected === QUESTION_4.correctAnswer && `Correct! ${playerName} is advancing to the final!`}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Game Stats & Chat */}
          <div className="col-span-4 space-y-8">
            {/* Game Stats Panel */}
            <div
              className={`bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-purple-500/50 overflow-hidden shadow-2xl transition-all duration-500 ${finalistFlash ? "animate-pulse ring-4 ring-yellow-400/50 shadow-yellow-400/50" : ""
                }`}
            >
              <div
                className={`bg-gradient-to-r from-purple-600/30 to-blue-600/30 px-6 py-4 border-b border-purple-500/30 ${finalistFlash ? "bg-gradient-to-r from-yellow-600/50 to-orange-600/50" : ""
                  }`}
              >
                <h3 className="text-xl font-bold text-white">GAME STATS</h3>
              </div>
              <div className="p-6">
                {(stage === "intro" || stage === "question") && (
                  <div className="text-center space-y-6">
                    <div className="text-xl font-bold text-purple-400 mb-4">Round 4 Info</div>

                    <div className="bg-blue-600/20 rounded-lg p-4 border border-blue-500/30">
                      <div className="flex justify-between items-center">
                        <span className="text-blue-300">👥 Total Players</span>
                        <span className="text-blue-400 font-bold">10</span>
                      </div>
                      <div className="text-sm text-blue-200 mt-2 text-left">final competitors</div>
                    </div>

                    <div className="bg-purple-600/20 rounded-lg p-4 border border-purple-500/30">
                      <div className="flex justify-between items-center">
                        <span className="text-purple-300">🏆 Finalist Spots</span>
                        <span className="text-purple-400 font-bold">1</span>
                      </div>
                      <div className="text-sm text-purple-200 mt-2 text-left">advance to final</div>
                    </div>

                    <div className="bg-yellow-600/20 rounded-lg p-4 border border-yellow-500/30">
                      <div className="flex justify-between items-center">
                        <span className="text-yellow-300">🎯 Your Status</span>
                        <span className="text-yellow-400 font-bold">COMPETING</span>
                      </div>
                      <div className="text-sm text-yellow-200 mt-2">final challenge</div>
                    </div>

                    <div className="text-center text-lg text-gray-400 mt-4">
                      {/* {stage === "question" ? `Timer: ${timer}s remaining` : "Round 4 - The Final Challenge"} */}
                    </div>
                  </div>
                )}

                {stage === "roundStats" && (
                  <StatMap
                    total={10}
                    safe={1}
                    progress={statProgress}
                    label="1 correct answer - FINALIST!"
                    showFinalSplit={false}
                    fullScreen={false}
                    playerName={playerName}
                    theme="advancement"
                  />
                )}

                {stage === "alexVideoPart2" && (
                  <div className="space-y-6">
                    <div className="text-center mb-6">
                      <div className="text-xl font-bold text-yellow-400 mb-3 animate-pulse">🏆 FINALIST! 🏆</div>
                    </div>

                    <div className="space-y-4">
                      <div
                        className={`bg-green-600/20 rounded-lg p-4 border border-green-500/30 ${finalistFlash ? "animate-pulse bg-yellow-600/30 border-yellow-500/50" : ""
                          }`}
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-green-300">🎉 Final Result</span>
                          <span className="text-green-400 font-bold">QUALIFIED</span>
                        </div>
                        <div className="text-sm text-green-200 mt-2">{playerName} advances!</div>
                      </div>

                      <div className="bg-purple-600/20 rounded-lg p-4 border border-purple-500/30">
                        <div className="flex justify-between items-center">
                          <span className="text-purple-300">🏁 Next Stage</span>
                          <span className="text-purple-400 font-bold">THE FINAL</span>
                        </div>
                        <div className="text-sm text-purple-200 mt-2">ultimate challenge awaits</div>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-yellow-500/30">
                      <div className={`bg-yellow-500/20 rounded-lg p-4 border border-yellow-400/50 ${finalistFlash ? "animate-pulse" : ""}`}>
                        <div className="flex items-center justify-center space-x-3">
                          <span className="text-yellow-400">🏆</span>
                          <span className="text-yellow-300 font-semibold">FINALIST STATUS</span>
                        </div>
                        <div className="text-sm text-yellow-200 text-center mt-2">You made it to the end!</div>
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
                  LIVE CHAT
                  <span className="ml-3 w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
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

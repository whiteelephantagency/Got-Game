"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import AlexVideoPlayer from "@/components/ui/AlexVideoPlayer";
import StatMap from "@/components/ui/StatMap";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";
import ChatBox from "@/components/ui/ChatBot";

/* -------------------------- Round 2 data -------------------------- */

const QUESTION_2 = {
  question: "Where was Shin Lim, AGT Season 13 Winner, born?",
  options: [
    "Acton, Massachusetts",
    "Seoul, South Korea",
    "Singapore",
    "Vancouver, British Columbia",
  ],
  correctAnswer: "Vancouver, British Columbia",
  wrongAnswers: ["Acton, Massachusetts", "Seoul, South Korea", "Singapore"],
};

// Random names for lucky draw
const RANDOM_NAMES = [
  "Alex Johnson", "Maria Garcia", "David Chen", "Sarah Wilson", "Mike Rodriguez",
  "Emily Davis", "Chris Lee", "Ashley Brown", "Jason Kim", "Jessica Martinez",
  "Ryan Thompson", "Amanda White", "Kevin Liu", "Rachel Green", "Tom Anderson",
  "Lisa Zhang", "Mark Taylor", "Nicole Wang", "Steve Clark", "Jennifer Adams",
];

/* -------------------------- Component -------------------------- */

type Stage =
  | "intro" | "question" | "answerReaction"
  | "roundStats" | "roundStatsCommentary"
  | "alexVideoPart4" | "openSlotsStats"
  | "alexVideoPart5" | "luckyDraw" | "alexVideoPart6";

export default function Round2Page() {
  const router = useRouter();

  const [stage, setStage] = useState<Stage>("intro");
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

  /* -------------------------- SFX (same pattern as Round 1) -------------------------- */
  const whooshRef = useRef<HTMLAudioElement | null>(null);
  const loopRef   = useRef<HTMLAudioElement | null>(null);
  const chimeRef  = useRef<HTMLAudioElement | null>(null);
  const crowdRef  = useRef<HTMLAudioElement | null>(null);
  const [audioPrimed, setAudioPrimed] = useState(false);

  // preload SFX
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

  // identical to Round 1: unlock on first user click (we call it inside handleAnswer)
  const primeAudio = async () => {
    if (audioPrimed) return;
    try {
      await whooshRef.current?.play();
      whooshRef.current?.pause();
      if (whooshRef.current) whooshRef.current.currentTime = 0;
      setAudioPrimed(true);
    } catch { /* ignore */ }
  };

  /* -------------------------- Effects -------------------------- */

  // Player name
  useEffect(() => {
    const name = localStorage.getItem("playerName") || "Player";
    setPlayerName(name);
  }, []);

  // Question timer
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
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
    return () => interval && clearInterval(interval);
  }, [stage, timerActive, timer]);

  // Stats animations + SFX (mirrors Round 1)
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;

    if (stage === "roundStats") {
      setShowFullScreenStats(true);

      // SFX: whoosh + start loop
      whooshRef.current?.play().catch(() => {});
      if (loopRef.current) {
        loopRef.current.currentTime = 0;
        loopRef.current.play().catch(() => {});
      }

      setStatProgress(0);
      let filled = 0;
      interval = setInterval(() => {
        filled++;
        setStatProgress(filled);
        if (filled >= 80) {
          clearInterval(interval);
          // SFX: completion chime
          loopRef.current?.pause();
          chimeRef.current?.play().catch(() => {});
          setTimeout(() => {
            setShowFullScreenStats(false);
            setStage("roundStatsCommentary");
          }, 1200);
        }
      }, 50);
    }

    if (stage === "openSlotsStats") {
      setShowFullScreenStats(true);

      // SFX: whoosh + start loop
      whooshRef.current?.play().catch(() => {});
      if (loopRef.current) {
        loopRef.current.currentTime = 0;
        loopRef.current.play().catch(() => {});
      }

      setStatProgress(0);
      let filled = 0;
      interval = setInterval(() => {
        filled++;
        setStatProgress(filled);
        if (filled >= 20) {
          clearInterval(interval);
          // SFX: completion chime (you can add crowd if you want)
          loopRef.current?.pause();
          chimeRef.current?.play().catch(() => {});
          setTimeout(() => {
            setShowFullScreenStats(false);
            setStage("alexVideoPart5");
          }, 1000);
        }
      }, 100);
    }

    return () => interval && clearInterval(interval);
  }, [stage]);

  // Lucky Draw animation
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    if (stage === "luckyDraw") {
      setShowLuckyDraw(true);
      const shuffled = [...RANDOM_NAMES].sort(() => Math.random() - 0.5);
      let idx = 0;
      let count = 0;

      interval = setInterval(() => {
        if (count < 20) {
          const name = shuffled[idx % shuffled.length];
          setCurrentDrawnName(name);
          setDrawnNames((prev) => [...prev, name]);
          idx++;
          count++;
        } else {
          clearInterval(interval);
          setTimeout(() => {
            setShowLuckyDraw(false);
            setStage("alexVideoPart6");
          }, 2000);
        }
      }, 500);
    }
    return () => interval && clearInterval(interval);
  }, [stage]);

  /* -------------------------- Handlers -------------------------- */

  const handleVideoEnd = () => {
    if (stage === "intro") {
      setCurrentVideoKey((p) => p + 1);
      setStage("question");
      setTimerActive(true);
    } else if (stage === "answerReaction") {
      setCurrentVideoKey((p) => p + 1);
      setStage("roundStats");
    } else if (stage === "roundStatsCommentary") {
      setShowFullScreenStats(false);
      setCurrentVideoKey((p) => p + 1);
      setStage("alexVideoPart4");
    } else if (stage === "alexVideoPart4") {
      setCurrentVideoKey((p) => p + 1);
      setStage("openSlotsStats");
    } else if (stage === "alexVideoPart5") {
      setCurrentVideoKey((p) => p + 1);
      setStage("luckyDraw");
    } else if (stage === "alexVideoPart6") {
      router.push("/game/3");
    }
  };

  const handleAnswer = (option: string) => {
    // unlock audio just like Round 1
    primeAudio();

    if (lockOptions || timer === 0) return;

    if (QUESTION_2.wrongAnswers.includes(option)) {
      setSelected(option);
      setLockOptions(true);
      setTimerActive(false);
      setQuestionFlash(true);

      // quick flash
      setTimeout(() => setQuestionFlash(false), 200);
      setTimeout(() => setQuestionFlash(true), 400);
      setTimeout(() => setQuestionFlash(false), 600);

      setTimeout(() => setStage("answerReaction"), 1000);
    }
  };

  // Auto-start timer when question appears
  useEffect(() => {
    if (stage === "question") setTimerActive(true);
  }, [stage]);

  /* -------------------------- Render -------------------------- */

  return (
    <main className="min-h-screen bg-black bg-[url('/images/lobby-background.jpg')] bg-cover bg-center bg-no-repeat bg-fixed text-white relative">

      {/* Full Screen Stats Overlay */}
      {showFullScreenStats && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-lg" />
          <div className="relative z-10 bg-gradient-to-br from-purple-900/95 to-blue-900/95 rounded-3xl border border-purple-400/50 shadow-2xl p-16 max-w-6xl mx-auto animate-in zoom-in-95 duration-500">
            <div className="text-center space-y-12">
              <h2 className="text-6xl font-bold text-white mb-12">
                {stage === "roundStats" ? "ROUND 2 RESULTS" : "OPEN SLOTS"}
              </h2>

              {stage === "roundStats" && (
                <div className="space-y-12">
                  <div className="grid grid-cols-3 gap-12 items-center">
                    <div className="text-center space-y-6">
                      <div className="w-32 h-32 mx-auto bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-4xl font-bold">👥</span>
                      </div>
                      <div className="text-3xl font-bold text-blue-400">1,000</div>
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
                      style={{ width: `${(statProgress / 80) * 100}%` }}
                    >
                      <span className="text-white font-bold text-lg">
                        {statProgress >= 80 ? "Complete!" : `${Math.round((statProgress / 80) * 100)}%`}
                      </span>
                    </div>
                  </div>

                  {statProgress >= 80 && (
                    <div className="space-y-8 animate-in fade-in duration-1000">
                      <div className="text-3xl text-green-400 font-bold">
                        Only 80 Players Got It Right!
                      </div>
                      <div className="text-xl text-red-300">
                        You got it wrong... but don't give up hope!
                      </div>
                    </div>
                  )}
                </div>
              )}

              {stage === "openSlotsStats" && (
                <div className="space-y-12">
                  <div className="grid grid-cols-3 gap-12 items-center">
                    <div className="text-center space-y-6">
                      <div className="w-32 h-32 mx-auto bg-orange-500 rounded-full flex items-center justify-center">
                        <span className="text-4xl font-bold">🎯</span>
                      </div>
                      <div className="text-3xl font-bold text-orange-400">100</div>
                      <div className="text-lg text-gray-300">Target Players</div>
                    </div>

                    <div className="text-center space-y-4">
                      <div className="text-6xl text-purple-400">-</div>
                      <div className="text-lg text-purple-300 mt-4">Open Slots</div>
                    </div>

                    <div className="text-center space-y-6">
                      <div className="w-32 h-32 mx-auto bg-yellow-500 rounded-full flex items-center justify-center">
                        <span className="text-4xl font-bold">🎲</span>
                      </div>
                      <div className="text-4xl font-bold text-yellow-400">
                        {statProgress.toLocaleString()}
                      </div>
                      <div className="text-lg text-gray-300">Available Spots</div>
                    </div>
                  </div>

                  <div className="bg-gray-800 rounded-full h-12 overflow-hidden mx-8">
                    <div
                      className="bg-gradient-to-r from-yellow-500 to-orange-400 h-full transition-all duration-300 rounded-full flex items-center justify-end pr-6"
                      style={{ width: `${(statProgress / 20) * 100}%` }}
                    >
                      <span className="text-white font-bold text-lg">
                        {statProgress >= 20 ? "Complete!" : `${Math.round((statProgress / 20) * 100)}%`}
                      </span>
                    </div>
                  </div>

                  {statProgress >= 20 && (
                    <div className="space-y-8 animate-in fade-in duration-1000">
                      <div className="text-3xl text-yellow-400 font-bold">
                        20 Spots Available for Lucky Draw!
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-lg" />
          <div className="relative z-10 bg-gradient-to-br from-yellow-900/95 to-orange-900/95 rounded-3xl border border-yellow-400/50 shadow-2xl p-16 max-w-6xl mx-auto animate-in zoom-in-95 duration-500">
            <div className="text-center space-y-12">
              <h2 className="text-6xl font-bold text-white mb-12">LUCKY DRAW</h2>

              <div className="space-y-8">
                <div className="text-4xl font-bold text-yellow-400">
                  Drawing 20 Lucky Winners...
                </div>

                <div className="bg-black/30 rounded-2xl p-12 min-h-[250px] flex items-center justify-center">
                  <div className="text-5xl font-bold text-white animate-pulse">
                    {currentDrawnName || "Starting Draw..."}
                  </div>
                </div>

                <div className="text-2xl text-yellow-300">
                  {drawnNames.length} / 20 Names Drawn
                </div>

                {drawnNames.length >= 20 && (
                  <div className="text-3xl text-red-400 font-bold animate-pulse">
                    Sorry {playerName}, you weren't selected...
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
            <h1 className="text-3xl font-bold text-white">ROUND 2</h1>
            <div className="text-purple-100 text-lg">
              {stage === "question" ? `Answer the Question! (${timer}s)` :
               stage === "answerReaction" ? "Calculating Results..." :
               stage === "roundStats" ? "Showing Statistics" :
               stage === "roundStatsCommentary" ? "Analyzing Results" :
               stage === "openSlotsStats" ? "Open Slots Available" :
               stage === "luckyDraw" ? "Lucky Draw in Progress" :
               "The Knowledge Challenge"}
            </div>
          </div>
          <div className="flex items-center space-x-6 text-lg">
            <div className="bg-black/30 px-4 py-2 rounded">PLAYERS: 1,000</div>
            <div className="bg-black/30 px-4 py-2 rounded">TARGET: 100</div>
            <div className="bg-purple-500/20 px-4 py-2 rounded text-purple-300">ROUND 2</div>
          </div>
        </div>
      </div>

      {/* Main Game Area */}
      <div className="max-w-7xl mx-auto p-8">
        <div className="grid grid-cols-12 gap-8 min-h-[calc(100vh-140px)]">
          {/* Left Column */}
          <div className="col-span-8 flex flex-col space-y-8">
            {/* Alex Video */}
            <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-purple-500/50 overflow-hidden shadow-2xl flex-1 flex flex-col">
              <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 px-6 py-4 border-b border-purple-500/30">
                <h2 className="text-xl font-semibold text-white">Alex - Your Host</h2>
              </div>
              <div className="p-6 flex-1 flex flex-col">
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
                    />
                  )}

                  {/* Placeholders */}
                  {stage === "question" && (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-900/20 to-blue-900/20">
                      <div className="text-center space-y-6 p-8">
                        <div className="text-4xl">🧠</div>
                        <div className="text-2xl font-semibold text-purple-300">
                          Answer the Question!
                        </div>
                        <div className="text-lg text-gray-400">
                          Time is ticking: {timer}s
                        </div>
                      </div>
                    </div>
                  )}

                  {(stage === "roundStats" || stage === "openSlotsStats" || stage === "luckyDraw") && (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-900/20 to-blue-900/20">
                      <div className="text-center space-y-6 p-8">
                        <div className="text-4xl">
                          {stage === "roundStats" ? "🎯" : stage === "openSlotsStats" ? "🎲" : "🍀"}
                        </div>
                        <div className="text-2xl font-semibold text-purple-300">
                          {stage === "roundStats" ? "Calculating Results..." :
                           stage === "openSlotsStats" ? "Counting Open Slots..." :
                           "Lucky Draw in Progress..."}
                        </div>
                        <div className="text-lg text-gray-400">
                          Check the full screen for detailed results!
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Question */}
            {stage === "question" && (
              <div
                className={`bg-gradient-to-br from-purple-900/30 to-blue-900/30 rounded-2xl border border-purple-400/50 shadow-xl transition-all duration-200 ${
                  questionFlash ? "bg-red-500/50 border-red-500" : ""
                }`}
              >
                <div className="bg-gradient-to-r from-purple-500/30 to-blue-500/30 px-8 py-6 border-b border-purple-400/30 flex justify-between items-center">
                  <h2 className="text-3xl font-bold text-white">QUESTION 2</h2>
                  <div className="text-red-400 text-2xl font-bold flex items-center">
                    ⏰ {timer}s
                  </div>
                </div>
                <div className="p-8">
                  <p className="text-2xl text-white mb-8 leading-relaxed">{QUESTION_2.question}</p>
                  <div className="grid grid-cols-2 gap-6">
                    {QUESTION_2.options.map((opt, idx) => (
                      <Button
                        key={opt}
                        className={`h-20 text-xl font-semibold transition-all duration-300 rounded-xl px-8 flex justify-between items-center
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
                        <span className="text-lg">
                          {String.fromCharCode(65 + idx)}. {opt}
                        </span>
                        {lockOptions && selected === opt && QUESTION_2.wrongAnswers.includes(opt) && <XCircle className="ml-3" />}
                        {lockOptions && opt === QUESTION_2.correctAnswer && <CheckCircle className="ml-3" />}
                      </Button>
                    ))}
                  </div>
                  <div className="mt-6 text-center text-purple-300 text-lg">
                    {!lockOptions && timer > 0 && "Only wrong answers are clickable"}
                    {!lockOptions && timer === 0 && "Time's up! Moving to results..."}
                    {lockOptions && selected && QUESTION_2.wrongAnswers.includes(selected) && "Wrong answer! Moving to next stage..."}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="col-span-4 space-y-8">
            {/* Game Stats Panel */}
            <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-purple-500/50 overflow-hidden shadow-2xl">
              <div className="bg-gradient-to-r from-purple-600/30 to-blue-600/30 px-6 py-4 border-b border-purple-500/30">
                <h3 className="text-xl font-bold text-white">📊 GAME STATS</h3>
              </div>
              <div className="p-6">
                {(stage === "intro" || stage === "question" || stage === "answerReaction") && (
                  <div className="text-center space-y-6">
                    <div className="text-xl font-bold text-purple-400 mb-4">Round 2 Info</div>

                    <div className="bg-blue-600/20 rounded-lg p-4 border border-blue-500/30">
                      <div className="flex justify-between items-center">
                        <span className="text-blue-300">👥 Total Players</span>
                        <span className="text-blue-400 font-bold">1,000</span>
                      </div>
                      <div className="text-sm text-blue-200 mt-2">competing this round</div>
                    </div>

                    <div className="bg-purple-600/20 rounded-lg p-4 border border-purple-500/30">
                      <div className="flex justify-between items-center">
                        <span className="text-purple-300">🎯 Target for Round 3</span>
                        <span className="text-purple-400 font-bold">100</span>
                      </div>
                      <div className="text-sm text-purple-200 mt-2">spots available</div>
                    </div>

                    <div className="text-center text-lg text-gray-400 mt-4">
                      {stage === "question" ? `Timer: ${timer}s remaining` :
                       stage === "answerReaction" ? "Calculating results..." :
                       "Round 2 in progress..."}
                    </div>
                  </div>
                )}

                {(stage === "roundStats" || stage === "openSlotsStats") && (
                  <StatMap
                    total={stage === "openSlotsStats" ? 100 : 1000}
                    safe={stage === "openSlotsStats" ? 80 : 80}
                    progress={stage === "openSlotsStats" ? statProgress : 80}
                    label={stage === "roundStats" ? "80 correct answers" : "20 open slots for lucky draw"}
                    showFinalSplit={stage === "openSlotsStats"}
                    fullScreen={false}
                    playerName={playerName}
                    theme="default"
                  />
                )}

                {(stage === "roundStatsCommentary" || stage === "alexVideoPart4") && (
                  <div className="space-y-6">
                    <div className="text-center mb-6">
                      <div className="text-xl font-bold text-purple-400 mb-3">Round 2 Results</div>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-green-600/20 rounded-lg p-4 border border-green-500/30">
                        <div className="flex justify-between items-center">
                          <span className="text-green-300">✅ Correct Answers</span>
                          <span className="text-green-400 font-bold">80</span>
                        </div>
                        <div className="text-sm text-green-200 mt-2">out of 1,000 players</div>
                      </div>

                      <div className="bg-purple-600/20 rounded-lg p-4 border border-purple-500/30">
                        <div className="flex justify-between items-center">
                          <span className="text-purple-300">🎯 Target for Round 3</span>
                          <span className="text-purple-400 font-bold">100</span>
                        </div>
                        <div className="text-sm text-purple-200 mt-2">spots needed</div>
                      </div>

                      <div className="bg-red-600/20 rounded-lg p-4 border border-red-500/30">
                        <div className="flex justify-between items-center">
                          <span className="text-red-300">❌ Your Status</span>
                          <span className="text-red-400 font-bold">LUCKY POOL</span>
                        </div>
                        <div className="text-sm text-red-200 mt-2">awaiting lucky draw</div>
                      </div>
                    </div>
                  </div>
                )}

                {stage === "alexVideoPart5" && (
                  <div className="space-y-6">
                    <div className="text-center mb-6">
                      <div className="text-xl font-bold text-purple-400 mb-3">Lucky Draw Status</div>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-orange-600/20 rounded-lg p-4 border border-orange-500/30">
                        <div className="flex justify-between items-center">
                          <span className="text-orange-300">🎲 Open Slots</span>
                          <span className="text-orange-400 font-bold">20</span>
                        </div>
                        <div className="text-sm text-orange-200 mt-2">available for draw</div>
                      </div>

                      <div className="bg-purple-600/20 rounded-lg p-4 border border-purple-500/30">
                        <div className="flex justify-between items-center">
                          <span className="text-purple-300">🍀 Your Status</span>
                          <span className="text-purple-400 font-bold">LUCKY POOL</span>
                        </div>
                        <div className="text-sm text-purple-200 mt-2">awaiting lucky draw</div>
                      </div>
                    </div>
                  </div>
                )}

                {stage === "luckyDraw" && (
                  <div className="space-y-6">
                    <div className="text-center mb-6">
                      <div className="text-xl font-bold text-purple-400 mb-3">Lucky Draw in Progress</div>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-yellow-600/20 rounded-lg p-4 border border-yellow-500/30">
                        <div className="flex justify-between items-center">
                          <span className="text-yellow-300">🎲 Drawing Names</span>
                          <span className="text-yellow-400 font-bold">{drawnNames.length}/20</span>
                        </div>
                        <div className="text-sm text-yellow-200 mt-2">names being selected</div>
                      </div>

                      <div className="bg-purple-600/20 rounded-lg p-4 border border-purple-500/30">
                        <div className="flex justify-between items-center">
                          <span className="text-purple-300">🍀 Your Status</span>
                          <span className="text-purple-400 font-bold">LUCKY POOL</span>
                        </div>
                        <div className="text-sm text-purple-200 mt-2">waiting for results...</div>
                      </div>
                    </div>
                  </div>
                )}

                {stage === "alexVideoPart6" && (
                  <div className="space-y-6">
                    <div className="text-center mb-6">
                      <div className="text-xl font-bold text-purple-400 mb-3">Lucky Draw Complete</div>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-orange-600/20 rounded-lg p-4 border border-orange-500/30">
                        <div className="flex justify-between items-center">
                          <span className="text-orange-300">🎲 Draw Results</span>
                          <span className="text-orange-400 font-bold">COMPLETE</span>
                        </div>
                        <div className="text-sm text-orange-200 mt-2">20 players selected</div>
                      </div>

                      <div className="bg-purple-600/20 rounded-lg p-4 border border-purple-500/30">
                        <div className="flex justify-between items-center">
                          <span className="text-purple-300">🍀 Your Status</span>
                          <span className="text-purple-400 font-bold">LUCKY POOL</span>
                        </div>
                        <div className="text-sm text-purple-200 mt-2">not selected this round</div>
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
                  <span className="ml-3 w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                </h3>
              </div>
              <div className="h-96">
                <ChatBox theme="blue" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

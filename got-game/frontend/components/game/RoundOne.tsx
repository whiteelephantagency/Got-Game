"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import AlexVideoPlayer from "@/components/ui/AlexVideoPlayer";
import StatMap from "@/components/ui/StatMap";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";
import ChatBox from "@/components/ui/ChatBot";
import Image from "next/image";

const QUESTION_1 = {
  question: "Which 70's rock band performed the original version of this song?",
  options: ["The Who", "Chicago", "Journey", "The Eagles"],
  correctAnswer: "Journey",
};

export default function RoundOnePage() {
  const router = useRouter();

  // ---------------- Game state ----------------
  const [stage, setStage] = useState< // stages drive the flow
    | "intro"
    | "questionRelatedVideo"
    | "question"
    | "answerReaction"
    | "roundStats"
    | "roundStatsEnd"
    | "alexVideoPart4"
    | "finalStats"
    | "alexVideoPart5"
  >("intro");
  const [selected, setSelected] = useState<string | null>(null);
  const [lockOptions, setLockOptions] = useState(false);
  const [statProgress, setStatProgress] = useState(0);
  const [showFullScreenStats, setShowFullScreenStats] = useState(false);
  const [currentVideoKey, setCurrentVideoKey] = useState(0);
  const [playerName, setPlayerName] = useState("Player");

  // --------------- Audio SFX ------------------
  const whooshRef = useRef<HTMLAudioElement | null>(null);
  const loopRef = useRef<HTMLAudioElement | null>(null);
  const chimeRef = useRef<HTMLAudioElement | null>(null);
  const crowdRef = useRef<HTMLAudioElement | null>(null);
  const [audioPrimed, setAudioPrimed] = useState(false);

  // Get player name from localStorage
  useEffect(() => {
    const name = localStorage.getItem("playerName") || "Player";
    setPlayerName(name);
  }, []);

  // Preload SFX (volumes are gentle; tweak to taste)
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

  // Prime audio (satisfy autoplay policies) – call this on first user click
  const primeAudio = async () => {
    if (audioPrimed) return;
    try {
      // try a tiny play/pause to unlock
      await whooshRef.current?.play();
      whooshRef.current?.pause();
      if (whooshRef.current) whooshRef.current.currentTime = 0;
      setAudioPrimed(true);
    } catch {
      /* ignore */
    }
  };

  // ---------- Stats animation loops ----------
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (stage === "roundStats") {
      setShowFullScreenStats(true);

      // SFX: whoosh in + loop start
      whooshRef.current?.play().catch(() => {});
      if (loopRef.current) {
        loopRef.current.currentTime = 0;
        loopRef.current.play().catch(() => {});
      }

      let filled = 0;
      interval = setInterval(() => {
        filled++;
        setStatProgress(filled);
        if (filled >= 1470) {
          clearInterval(interval);
          // SFX: completion chime
          loopRef.current?.pause();
          chimeRef.current?.play().catch(() => {});
          setTimeout(() => {
            setShowFullScreenStats(false);
            setStage("roundStatsEnd");
          }, 2000);
        }
      }, 8);
    } else if (stage === "finalStats") {
      setShowFullScreenStats(true);

      // SFX: whoosh in + loop start
      whooshRef.current?.play().catch(() => {});
      if (loopRef.current) {
        loopRef.current.currentTime = 0;
        loopRef.current.play().catch(() => {});
      }

      let filled = 0;
      interval = setInterval(() => {
        filled++;
        setStatProgress(filled);
        if (filled >= 1000) {
          clearInterval(interval);
          // SFX: final chime + crowd cheer
          loopRef.current?.pause();
          chimeRef.current?.play().catch(() => {});
          crowdRef.current?.play().catch(() => {});
          setTimeout(() => {
            setShowFullScreenStats(false);
            setStage("alexVideoPart5");
          }, 4000);
        }
      }, 8);
    }

    return () => clearInterval(interval);
  }, [stage]);

  // ---------- Video progression ----------
  const handleVideoEnd = () => {
    if (stage === "intro") {
      setCurrentVideoKey((p) => p + 1);
      setStage("questionRelatedVideo");
    } else if(stage === "questionRelatedVideo"){
       setCurrentVideoKey((p) => p + 1);
      setStage("question");
    }
    else if (stage === "answerReaction") {
      setCurrentVideoKey((p) => p + 1);
      setStage("roundStats");
    } else if (stage === "roundStatsEnd") {
      setCurrentVideoKey((p) => p + 1);
      setStage("alexVideoPart4");
    } else if (stage === "alexVideoPart4") {
      setCurrentVideoKey((p) => p + 1);
      setStage("finalStats");
    } else if (stage === "alexVideoPart5") {
      router.push("/game/2");
    }
  };

  // ---------- Answers ----------
  const handleAnswer = (option: string) => {
    primeAudio(); // ensure audio is unlocked by the click

    if (lockOptions || option !== QUESTION_1.correctAnswer) return;
    setSelected(option);
    setLockOptions(true);
    setCurrentVideoKey((p) => p + 1);
    setTimeout(() => setStage("answerReaction"), 500);
  };

  return (
    <main className="min-h-screen bg-black bg-[url('/images/lobby-background.jpg')] bg-cover bg-center bg-no-repeat bg-fixed text-white relative">
      {/* Full Screen Stats Overlay */}
      {showFullScreenStats && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          {/* Backdrop blur */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-lg" />

          {/* Stats content */}
          <div className="relative z-10 bg-gradient-to-br from-purple-900/95 to-blue-900/95 rounded-3xl border border-purple-400/50 shadow-2xl p-16 max-w-6xl mx-auto animate-in zoom-in-95 duration-500">
            <div className="text-center space-y-12">
              <h2 className="text-6xl font-bold text-white mb-12">
                {stage === "roundStats" ? "ROUND 1 RESULTS" : "PLAYER SPLIT"}
              </h2>

              {stage === "roundStats" && (
                <div className="space-y-12">
                  {/* Flow */}
                  <div className="grid grid-cols-3 gap-12 items-center">
                    <div className="text-center space-y-6">
                      <div className="w-32 h-32 mx-auto bg-white rounded-full flex items-center justify-center">
                        <span className="text-4xl font-bold">👥</span>
                      </div>
                      <div className="text-3xl font-bold text-blue-400">2,000</div>
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

                  {/* Progress Bar */}
                  <div className="bg-gray-800 rounded-full h-12 overflow-hidden mx-8">
                    <div
                      className="bg-gradient-to-r from-green-500 to-emerald-400 h-full transition-all duration-300 rounded-full flex items-center justify-end pr-6"
                      style={{ width: `${(statProgress / 1470) * 100}%` }}
                    >
                      <span className="text-white font-bold text-lg">
                        {statProgress >= 1470 ? "Complete!" : `${Math.round((statProgress / 1470) * 100)}%`}
                      </span>
                    </div>
                  </div>

                  {statProgress >= 1470 && (
                    <div className="space-y-8 animate-in fade-in duration-1000">
                      <div className="text-3xl text-green-400 font-bold">
                        1,470 Players Got It Right!
                      </div>
                      <div className="text-xl text-yellow-300">
                        But only 1,000 spots available... 470 will enter the Lucky Pool!
                      </div>
                    </div>
                  )}
                </div>
              )}

              {stage === "finalStats" && (
                <div className="space-y-12">
                  <div className="grid grid-cols-3 gap-12 items-center">
                    <div className="text-center space-y-6">
                      <div className="w-32 h-32 mx-auto bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-4xl font-bold">✅</span>
                      </div>
                      <div className="text-3xl font-bold text-green-400">1,470</div>
                      <div className="text-lg text-gray-300">Correct Players</div>
                    </div>

                    <div className="text-center space-y-4">
                      <div className="text-6xl text-purple-400">⚡</div>
                      <div className="text-lg text-purple-300 mt-4">Random Split</div>
                    </div>

                    <div className="text-center space-y-6">
                      <div className="grid grid-cols-1 gap-4">
                        <div className="bg-green-600/20 rounded-lg p-4 border border-green-500/50">
                          <div className="text-2xl font-bold text-white-400">
                            {Math.min(statProgress, 1000).toLocaleString()}
                          </div>
                          <div className="text-sm text-white-300">Safe to Round 2</div>
                        </div>

                        <div className="bg-yellow-600/20 rounded-lg p-4 border border-yellow-500/50">
                          <div className="text-2xl font-bold text-yellow-400">
                            {Math.max(0, Math.min(statProgress, 470)).toLocaleString()}
                          </div>
                          <div className="text-sm text-yellow-300">Lucky Pool</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-800 rounded-full h-12 overflow-hidden mx-8">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-full transition-all duration-300 rounded-full flex items-center justify-end pr-6"
                      style={{ width: `${(statProgress / 1000) * 100}%` }}
                    >
                      <span className="text-white font-bold text-lg">
                        {statProgress >= 1000 ? "Split Complete!" : `${Math.round((statProgress / 1000) * 100)}%`}
                      </span>
                    </div>
                  </div>

                  {/* {statProgress >= 1000 && (
                    <div className="text-2xl text-purple-400 font-bold animate-pulse">
                      Random Selection Complete!
                    </div>
                  )} */}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Top Game Header */}
      <div className="w-full bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 p-6 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-4">
          <div className="flex items-center space-x-8">
            {/* <h1 className="text-3xl font-bold text-white">ROUND 1</h1> */}
            <Image
            width={100}
            height={50}
            alt="logo"
            src={'/images/Gotgamelogo.png'}
            />
            {/* <div className="text-purple-100 text-lg">
              {stage === "question"
                ? "Answer the Question!"
                : stage === "answerReaction"
                ? "Calculating Results..."
                : stage === "roundStats"
                ? "Showing Statistics"
                : stage === "finalStats"
                ? "Final Results"
                : "The Musical Challenge"}
            </div> */}
          </div>
          <h3 className="flex items-center space-x-6 text-3xl font-bold text-white">ROUND 1</h3>
          {/* <div className="flex items-center space-x-6 text-lg">
            <div className="bg-black/30 px-4 py-2 rounded">PLAYERS: 2,000</div>
            <div className="bg-black/30 px-4 py-2 rounded">TARGET: 1,000</div>
            <div className="bg-purple-500/20 px-4 py-2 rounded text-purple-300">ROUND 1</div>
          </div> */}
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
                  {(stage === "intro" ||
                    stage === "answerReaction" ||
                    stage === "roundStatsEnd" ||
                    stage === "alexVideoPart4" ||
                    stage === "questionRelatedVideo" ||
                    stage === "alexVideoPart5") && (
                    <AlexVideoPlayer
                      src={
                        stage === "intro"
                          ? "/video/alex-intro-1.mp4"
                           : stage === "questionRelatedVideo"
                          ? "/video/alex-intro-1-1.mp4"
                          : stage === "answerReaction"
                          ? "/video/alex-question1-part2.mp3"
                          : stage === "roundStatsEnd"
                          ? "/video/alex-question1-part3.mp3"
                          : stage === "alexVideoPart4"
                          ? "/video/alex-video-part4.mp4"
                          : "/video/alex-video-part5.mp4"
                      }
                      onEnded={handleVideoEnd}
                      autoPlay
                      key={`video-${stage}-${currentVideoKey}`}
                      className="w-full h-full object-cover"
                    />
                  )}

                  {(stage === "question") && (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-900/20 to-blue-900/20">
                      <div className="text-center space-y-6 p-8">
                        <div className="text-4xl">🎵</div>
                        <div className="text-2xl font-semibold text-purple-300">Answer the Question!</div>
                        <div className="text-lg text-gray-400">Did you listen carefully to the music clip?</div>
                      </div>
                    </div>
                  )}

                  {(stage === "roundStats" || stage === "finalStats") && (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-900/20 to-blue-900/20">
                      <div className="text-center space-y-6 p-8">
                        <div className="text-4xl">🎯</div>
                        <div className="text-2xl font-semibold text-purple-300">
                          {stage === "roundStats" ? "Calculating Results..." : "Processing Final Stats..."}
                        </div>
                        <div className="text-lg text-gray-400">Check the full screen for detailed results!</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Question Section */}
            {stage === "question" && (
              <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 rounded-2xl border border-purple-400/50 shadow-xl">
                <div className="bg-gradient-to-r from-purple-500/30 to-blue-500/30 px-8 py-6 border-b border-purple-400/30">
                  <h2 className="text-3xl font-bold text-white">QUESTION 1</h2>
                </div>
                <div className="p-8">
                  <p className="text-2xl text-white mb-8 leading-relaxed">{QUESTION_1.question}</p>
                  <div className="grid grid-cols-2 gap-6">
                    {QUESTION_1.options.map((opt, idx) => (
                      <Button
                        key={opt}
                        className={`h-20 text-xl font-semibold transition-all duration-300 rounded-xl px-8 flex justify-between items-center
                          ${
                            selected === opt
                              ? opt === QUESTION_1.correctAnswer
                                ? "bg-green-600 shadow-lg shadow-green-500/50"
                                : "bg-red-600 shadow-lg shadow-red-500/50"
                              : opt === QUESTION_1.correctAnswer
                              ? "bg-purple-700 hover:bg-purple-600 ring-2 ring-purple-400 shadow-lg hover:shadow-purple-500/50"
                              : "bg-gray-600 cursor-not-allowed opacity-50"
                          }`}
                        disabled={lockOptions || opt !== QUESTION_1.correctAnswer}
                        onClick={() => handleAnswer(opt)}
                      >
                        <span className="text-lg">
                          {String.fromCharCode(65 + idx)}. {opt}
                        </span>
                        {lockOptions && opt === QUESTION_1.correctAnswer && <CheckCircle className="ml-3" />}
                        {lockOptions && selected === opt && opt !== QUESTION_1.correctAnswer && <XCircle className="ml-3" />}
                      </Button>
                    ))}
                  </div>
                  <div className="mt-6 text-center text-purple-300 text-lg">
                    {!lockOptions && "Only the correct answer is clickable"}
                    {lockOptions && selected === QUESTION_1.correctAnswer && "Correct! Moving to next stage..."}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Game Stats & Chat */}
          <div className="col-span-4 space-y-8">
            <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-purple-500/50 overflow-hidden shadow-2xl">
              <div className="bg-gradient-to-r from-purple-600/30 to-blue-600/30 px-6 py-4 border-b border-purple-500/30">
                <h3 className="text-xl font-bold text-white">📊 GAME STATS</h3>
              </div>
              <div className="p-6">
                {(stage === "intro" || stage === "question" || stage === "answerReaction") && (
                  <div className="text-center space-y-6">
                    <div className="text-xl font-bold text-purple-400 mb-4 !text-left">Round 1 Info</div>

                    <div className="bg-blue-600/20 rounded-lg p-4 border border-blue-500/30">
                      <div className="flex justify-between items-center">
                        <span className="text-blue-300">👥 Total Players</span>
                        <span className="text-blue-400 font-bold">2,000</span>
                      </div>
                      <div className="text-sm text-blue-200 mt-2 text-left">competing this round</div>
                    </div>

                    <div className="bg-purple-600/20 rounded-lg p-4 border border-purple-500/30">
                      <div className="flex justify-between items-center">
                        <span className="text-purple-300">🎯 Target for Round 2</span>
                        <span className="text-purple-400 font-bold">1,000</span>
                      </div>
                      <div className="text-sm text-purple-200 mt-2 text-left">spots available</div>
                    </div>

                    <div className="text-center text-lg text-gray-400 mt-4">
                      {stage === "question"
                        ? "Waiting for answers..."
                        : stage === "answerReaction"
                        ? "Calculating results..."
                        : "Round 1 in progress..."}
                    </div>
                  </div>
                )}

                {(stage === "roundStats" || stage === "finalStats") && (
                  <StatMap
                    total={1470}
                    safe={1000}
                    progress={statProgress}
                    label={stage === "roundStats" ? "Filling 1470 correct answers" : "Moving 1000 to safe spots, 470 to lucky pool"}
                    showFinalSplit={stage === "finalStats"}
                    fullScreen={false}
                    playerName={playerName}
                    theme="default"
                  />
                )}

                {(stage === "roundStatsEnd" || stage === "alexVideoPart4") && (
                  <div className="space-y-6">
                    <div className="text-center mb-6">
                      <div className="text-xl font-bold text-purple-400 mb-3">Round 1 Results</div>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-green-600/20 rounded-lg p-4 border border-green-500/30">
                        <div className="flex justify-between items-center">
                          <span className="text-green-300">✅ Correct Answers</span>
                          <span className="text-green-400 font-bold">1,470</span>
                        </div>
                        <div className="text-sm text-green-200 mt-2">out of 2,000 players</div>
                      </div>

                      <div className="bg-blue-600/20 rounded-lg p-4 border border-blue-500/30">
                        <div className="flex justify-between items-center">
                          <span className="text-blue-300">🛡️ Safe to Round 2</span>
                          <span className="text-blue-400 font-bold">1,000</span>
                        </div>
                        <div className="text-sm text-blue-200 mt-2">guaranteed advancement</div>
                      </div>
                    </div>
                  </div>
                )}

                {stage === "alexVideoPart5" && (
                  <div className="space-y-6">
                    <div className="text-center mb-6">
                      <div className="text-xl font-bold text-purple-400 mb-3">Final Summary</div>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-green-600/20 rounded-lg p-4 border border-green-500/30">
                        <div className="flex justify-between items-center">
                          <span className="text-green-300">✅ Correct Answers</span>
                          <span className="text-green-400 font-bold">1,470</span>
                        </div>
                        <div className="text-sm text-green-200 mt-2">out of 2,000 players</div>
                      </div>

                      <div className="bg-blue-600/20 rounded-lg p-4 border border-blue-500/30">
                        <div className="flex justify-between items-center">
                          <span className="text-blue-300">🛡️ Safe to Round 2</span>
                          <span className="text-blue-400 font-bold">1,000</span>
                        </div>
                        <div className="text-sm text-blue-200 mt-2">guaranteed advancement</div>
                      </div>

                      <div className="bg-yellow-600/20 rounded-lg p-4 border border-yellow-500/30">
                        <div className="flex justify-between items-center">
                          <span className="text-yellow-300">🎲 Lucky Pool</span>
                          <span className="text-yellow-400 font-bold">470</span>
                        </div>
                        <div className="text-sm text-yellow-200 mt-2">awaiting random draw</div>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-purple-500/30">
                      <div className="bg-green-500/20 rounded-lg p-4 border border-green-400/50">
                        <div className="flex items-center space-x-3 !text-left">
                          <span className="text-green-400">🎉</span>
                          <span className="text-green-300 font-semibold text-left">YOU ARE SAFE!</span>
                        </div>
                        <div className="text-sm text-green-200 mt-2 text-left">Advanced to Round 2</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Live Chat */}
            <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-purple-500/50 overflow-hidden shadow-2xl flex-1">
              <div className="bg-gradient-to-r from-purple-600/30 to-blue-600/30 px-6 py-4 border-b border-purple-500/30">
                {/* <h3 className="text-xl font-bold text-white flex items-center">
                  LIVE CHAT <span className="ml-3 w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                </h3> */}
              </div>
              <div className="h-96">
                <ChatBox theme="default" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

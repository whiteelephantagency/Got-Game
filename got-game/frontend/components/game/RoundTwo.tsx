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

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Top Game Header */}
      <div className="w-full bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 p-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <h1 className="text-2xl font-bold text-white">ROUND 2</h1>
            <div className="text-blue-100">
              {stage === "question" ? `Answer the Question! (${timer}s)` : 
               stage === "answerReaction" ? "Wrong Answer - To Lucky Pool!" :
               stage === "incorrectStats" ? "Moving Incorrect to Lucky Pool" :
               stage === "correctStats" ? "Showing Correct Answers" :
               stage === "openSlotsStats" ? "Open Slots Available" :
               "The Knowledge Challenge"}
            </div>
          </div>
          <div className="flex items-center space-x-4 text-sm">
            <div className="bg-black/30 px-3 py-1 rounded">PLAYERS: 1,000</div>
            <div className="bg-black/30 px-3 py-1 rounded">TARGET: 100</div>
            <div className="bg-blue-500/20 px-3 py-1 rounded text-blue-300">ROUND 2</div>
          </div>
        </div>
      </div>

      {/* Main Game Area */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-12 gap-6 h-[calc(100vh-120px)]">
          
          {/* Left Column - Main Content */}
          <div className="col-span-8 space-y-6">
            
            {/* Alex Video Section */}
            <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-blue-500/50 overflow-hidden shadow-2xl">
              <div className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 px-4 py-2 border-b border-blue-500/30">
                <h2 className="text-lg font-semibold text-white">Alex - Your Host</h2>
              </div>
              <div className="p-4">
                <div className="w-full h-80 rounded-xl overflow-hidden bg-black">
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

            {/* Question Section */}
            {stage === "question" && (
              <div className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 rounded-2xl border border-blue-400/50 shadow-xl">
                <div className="bg-gradient-to-r from-blue-500/30 to-cyan-500/30 px-6 py-4 border-b border-blue-400/30 flex justify-between items-center">
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
                              : "bg-blue-700 hover:bg-blue-600 ring-2 ring-blue-400 shadow-lg hover:shadow-blue-500/50"
                          }`}
                        disabled={lockOptions || opt === QUESTION_2.correctAnswer || timer === 0}
                        onClick={() => handleAnswer(opt)}
                      >
                        <span>
                          {String.fromCharCode(65 + idx)}. {opt}
                        </span>
                        {lockOptions && selected === opt && QUESTION_2.wrongAnswers.includes(opt) && <XCircle className="ml-2" />}
                        {lockOptions && opt === QUESTION_2.correctAnswer && <CheckCircle className="ml-2 text-green-400" />}
                      </Button>
                    ))}
                  </div>
                  <div className="mt-4 text-center text-blue-300 text-sm">
                    {!lockOptions && timer > 0 && "Correct answer is disabled - you must choose wrong to continue"}
                    {!lockOptions && timer === 0 && "Time's up! Moving to results..."}
                    {lockOptions && QUESTION_2.wrongAnswers.includes(selected!) && "Wrong answer! You're going to the Lucky Pool..."}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Game Stats & Chat */}
          <div className="col-span-4 space-y-6">
            
            {/* Game Stats Panel */}
            <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-blue-500/50 overflow-hidden shadow-2xl">
              <div className="bg-gradient-to-r from-blue-600/30 to-cyan-600/30 px-4 py-3 border-b border-blue-500/30">
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
                  />
                ) : (
                  <div className="text-center space-y-2">
                    <div className="text-2xl font-bold text-blue-400">1,000</div>
                    <div className="text-sm text-gray-300">Total Players</div>
                    <div className="text-sm text-blue-200">
                      {stage === "question" ? `Timer: ${timer}s` : 
                       stage === "answerReaction" ? "You got it wrong! → LUCKY POOL" :
                       stage === "alexVideoPart4" ? "80 correct - 20 spots open" :
                       stage === "alexVideoPart5" ? "Preparing Lucky Draw..." :
                       "Round 2 in progress..."}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Live Chat */}
            <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-blue-500/50 overflow-hidden shadow-2xl flex-1">
              <div className="bg-gradient-to-r from-blue-600/30 to-cyan-600/30 px-4 py-3 border-b border-blue-500/30">
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
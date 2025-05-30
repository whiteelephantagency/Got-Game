"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AlexVideoPlayer from "@/components/ui/AlexVideoPlayer";
import StatMap from "@/components/ui/StatMap";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";
import ChatBox from "@/components/ui/ChatBot";

const QUESTION_1 = {
  question: "Which 70's rock band performed the original version of this song?",
  options: ["The Who", "Chicago", "Journey", "The Eagles"],
  correctAnswer: "Journey",
};

export default function RoundOnePage() {
  const router = useRouter();
  const [stage, setStage] = useState("intro");
  const [selected, setSelected] = useState<string | null>(null);
  const [lockOptions, setLockOptions] = useState(false);
  const [statProgress, setStatProgress] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (stage === "roundStats") {
      let filled = 0;
      interval = setInterval(() => {
        filled++;
        setStatProgress(filled);
        if (filled >= 1470) {
          clearInterval(interval);
          setStage("roundStatsEnd");
        }
      }, 10);
    } else if (stage === "finalStats") {
      let filled = 0;
      interval = setInterval(() => {
        filled++;
        setStatProgress(filled);
        if (filled >= 1000) {
          clearInterval(interval);
          setStage("alexVideoPart5");
        }
      }, 10);
    }
    return () => clearInterval(interval);
  }, [stage]);

  const handleVideoEnd = () => {
    if (stage === "intro") setStage("question");
    else if (stage === "answerReaction") setStage("roundStats");
    else if (stage === "roundStatsEnd") setStage("alexVideoPart4");
    else if (stage === "alexVideoPart4") setStage("finalStats");
    else if (stage === "alexVideoPart5") router.push("/game/2");
  };

  const handleAnswer = (option: string) => {
    if (lockOptions || option !== QUESTION_1.correctAnswer) return;
    setSelected(option);
    setLockOptions(true);
    setTimeout(() => setStage("answerReaction"), 500);
  };

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Top Game Header */}
      <div className="w-full bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 p-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <h1 className="text-2xl font-bold text-white">ROUND 1</h1>
            <div className="text-purple-100">
              {stage === "question" ? "Answer the Question!" : 
               stage === "answerReaction" ? "Calculating Results..." :
               stage === "roundStats" ? "Showing Statistics" :
               stage === "finalStats" ? "Final Results" :
               "The Musical Challenge"}
            </div>
          </div>
          <div className="flex items-center space-x-4 text-sm">
            <div className="bg-black/30 px-3 py-1 rounded">PLAYERS: 1,470</div>
            <div className="bg-black/30 px-3 py-1 rounded">TARGET: 1,000</div>
            <div className="bg-purple-500/20 px-3 py-1 rounded text-purple-300">ROUND 1</div>
          </div>
        </div>
      </div>

      {/* Main Game Area */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-12 gap-6 h-[calc(100vh-120px)]">
          
          {/* Left Column - Main Content */}
          <div className="col-span-8 space-y-6">
            
            {/* Alex Video Section */}
            <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-purple-500/50 overflow-hidden shadow-2xl">
              <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 px-4 py-2 border-b border-purple-500/30">
                <h2 className="text-lg font-semibold text-white">Alex - Your Host</h2>
              </div>
              <div className="p-4">
                <div className="w-full h-80 rounded-xl overflow-hidden bg-black">
                  {(stage === "intro" || 
                    stage === "answerReaction" || 
                    stage === "roundStatsEnd" || 
                    stage === "alexVideoPart4" || 
                    stage === "alexVideoPart5") && (
                    <AlexVideoPlayer
                      src={
                        stage === "intro"
                          ? "/video/alex-intro-1.mp4"
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
                      key={stage}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Question Section */}
            {stage === "question" && (
              <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 rounded-2xl border border-purple-400/50 shadow-xl">
                <div className="bg-gradient-to-r from-purple-500/30 to-blue-500/30 px-6 py-4 border-b border-purple-400/30">
                  <h2 className="text-2xl font-bold text-white">QUESTION 1</h2>
                </div>
                <div className="p-6">
                  <p className="text-xl text-white mb-6 leading-relaxed">{QUESTION_1.question}</p>
                  <div className="grid grid-cols-2 gap-4">
                    {QUESTION_1.options.map((opt, idx) => (
                      <Button
                        key={opt}
                        className={`h-16 text-lg font-semibold transition-all duration-300 rounded-xl px-6 flex justify-between items-center
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
                        <span>
                          {String.fromCharCode(65 + idx)}. {opt}
                        </span>
                        {lockOptions && opt === QUESTION_1.correctAnswer && <CheckCircle className="ml-2" />}
                        {lockOptions && selected === opt && opt !== QUESTION_1.correctAnswer && <XCircle className="ml-2" />}
                      </Button>
                    ))}
                  </div>
                  <div className="mt-4 text-center text-purple-300 text-sm">
                    {!lockOptions && "Only the correct answer is clickable"}
                    {lockOptions && selected === QUESTION_1.correctAnswer && "Correct! Moving to next stage..."}
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
                {(stage === "roundStats" || stage === "finalStats") ? (
                  <StatMap
                    total={1470}
                    safe={1000}
                    progress={statProgress}
                    label={stage === "roundStats" ? "Filling 1470 correct answers" : "Moving 1000 to safe spots, 470 to lucky pool"}
                    showFinalSplit={stage === "finalStats"}
                  />
                ) : (
                  <div className="text-center space-y-2">
                    <div className="text-2xl font-bold text-purple-400">1,470</div>
                    <div className="text-sm text-gray-300">Total Players</div>
                    <div className="text-sm text-purple-200">
                      {stage === "question" ? "Waiting for answers..." : 
                       stage === "answerReaction" ? "Calculating results..." :
                       stage === "alexVideoPart4" ? "1470 CORRECT - Only 1000 spots!" :
                       stage === "alexVideoPart5" ? "1000 safe, 470 to lucky pool" :
                       "Round 1 in progress..."}
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
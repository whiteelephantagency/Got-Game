"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AlexVideoPlayer from "@/components/ui/AlexVideoPlayer";
import StatMap from "@/components/ui/StatMap";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock } from "lucide-react";
import ChatBox from "@/components/ui/ChatBot";

const QUESTION_3 = {
  question: "Who painted the Mona Lisa?",
  options: ["Vincent van Gogh", "Pablo Picasso", "Michelangelo", "Leonardo da Vinci"],
  correctAnswer: "Leonardo da Vinci"
};

// Mock lucky pool names
const LUCKY_POOL_NAMES = [
  "PlayerXYZ", "GamerABC", "QuizMaster99", "SmartCookie", "BrainTeaser", 
  "WisdomSeeker", "PLAYER", "ThinkTank", "MindBender", "QuestionKing"
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

  // Stats animation effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (stage === "roundStats") {
      let filled = 0;
      interval = setInterval(() => {
        filled++;
        setStatProgress(filled);
        if (filled >= 3) { // Only 3 people got it correct
          clearInterval(interval);
          setStage("roundStatsEnd");
        }
      }, 200);
    }
    return () => clearInterval(interval);
  }, [stage]);

  // Lucky draw effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (stage === "luckyDraw") {
      let drawCount = 0;
      const availableNames = LUCKY_POOL_NAMES.filter(name => name !== "PLAYER");
      
      interval = setInterval(() => {
        if (drawCount < 6) {
          // Draw random names for first 6 spots
          const randomName = availableNames[Math.floor(Math.random() * availableNames.length)];
          setCurrentDrawnName(randomName);
          setDrawnNames(prev => [...prev, randomName]);
          drawCount++;
        } else if (drawCount === 6) {
          // 7th name is always the PLAYER
          setCurrentDrawnName("PLAYER");
          setDrawnNames(prev => [...prev, "PLAYER"]);
          setIsPlayerDrawn(true);
          drawCount++;
        } else {
          // Lucky draw complete
          clearInterval(interval);
          setTimeout(() => setStage("luckyDrawEnd"), 2000);
        }
      }, 1500); // Draw a name every 1.5 seconds
    }
    return () => clearInterval(interval);
  }, [stage]);

  const handleVideoEnd = () => {
    if (stage === "intro") {
      setStage("question");
      setTimerActive(true);
    }
    else if (stage === "answerReaction") setStage("roundStats");
    else if (stage === "roundStatsEnd") setStage("alexVideoPart3");
    else if (stage === "alexVideoPart3") setStage("luckyDraw");
    else if (stage === "luckyDrawEnd") setStage("alexVideoPart5");
    else if (stage === "alexVideoPart5") router.push("/game/4"); // Next round or end
  };

  // Auto-start timer when question appears
  useEffect(() => {
    if (stage === "question") {
      setTimerActive(true);
    }
  }, [stage]);

  return (
    <main className="min-h-screen bg-black text-white flex flex-col relative">
      {/* Right sidebar - Game Stats and Chat */}
      <div className="absolute top-6 right-6 z-20 w-80 space-y-0">
        <div className="h-[200px] rounded-xl overflow-hidden bg-[#1c0f32]/70 border border-purple-500 shadow-md flex flex-col justify-center items-center">
          {stage === "roundStats" ? (
            <StatMap
              total={10}
              safe={3}
              progress={statProgress}
              label="Only 3 correct - 7 spots open for Lucky Draw"
              showFinalSplit={true}
            />
          ) : stage === "luckyDraw" ? (
            <div className="p-4 text-center">
              <h3 className="text-lg font-bold text-yellow-400">🎲 LUCKY DRAW</h3>
              <p className="text-sm text-purple-200 mb-2">Drawing names...</p>
              <div className="text-lg font-bold text-white">
                {currentDrawnName && `${drawnNames.length}. ${currentDrawnName}`}
              </div>
              {isPlayerDrawn && (
                <p className="text-green-400 text-sm mt-2 font-bold">
                  🎉 YOU'RE BACK IN THE GAME!
                </p>
              )}
            </div>
          ) : (
            <div className="p-4 text-center">
              <h3 className="text-lg font-bold">GAME STATS</h3>
              <p className="text-sm text-purple-200">
                {stage === "question" ? `⏰ Timer: ${timer}s` : 
                 stage === "answerReaction" ? "Waiting in Lucky Pool..." :
                 stage === "alexVideoPart3" ? "Preparing Lucky Draw..." :
                 stage === "luckyDrawEnd" ? "Lucky Draw Complete!" :
                 stage === "alexVideoPart5" ? "Advancing to next round!" :
                 "Round 3 - Lucky Pool Round"}
              </p>
            </div>
          )}
        </div>
        <div className="h-[calc(100vh-250px)] rounded-xl overflow-hidden">
          <ChatBox />
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col items-start justify-start px-4 pt-6 pb-10 pr-96">
        {/* Video Player Section */}
        <div className="relative z-10 w-full max-w-4xl">
          <div className="border border-purple-500 rounded-xl p-4 bg-[#1c0f32]/30">
            <div className="w-full h-96 rounded-lg overflow-hidden">
              <AlexVideoPlayer
                src={
                  stage === "intro"
                    ? "/video/round3-video1.mp4"
                    : stage === "answerReaction"
                    ? "/video/alex-question3-part2.mp3"
                    : stage === "alexVideoPart3"
                    ? "/video/round3-video3.mp4"
                    : stage === "luckyDraw" && drawnNames.length === 3
                    ? "/video/alex-question3-part4.mp3" // Background audio during lucky draw
                    : stage === "alexVideoPart5"
                    ? "/video/round3-video5.mp4"
                    : "/video/standby.mp4"
                }
                onEnded={handleVideoEnd}
                autoPlay
                key={stage}
              />
            </div>
          </div>
        </div>

        {/* Question Section - UNCLICKABLE in Lucky Pool */}
        {stage === "question" && (
          <div className="mt-6 w-full max-w-4xl">
            <div className="border border-purple-500 rounded-xl p-6 bg-[#1c0f32]/20 opacity-70">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-white text-2xl font-bold">ROUND 3 QUESTION</h2>
                <div className="text-red-400 text-xl font-bold flex items-center gap-2">
                  <Clock size={20} />
                  {timer}s
                </div>
              </div>
              <p className="text-white text-xl mb-6">{QUESTION_3.question}</p>
              <div className="grid grid-cols-2 gap-4">
                {QUESTION_3.options.map((opt, idx) => (
                  <Button
                    key={opt}
                    className="h-16 text-lg font-semibold rounded-lg px-6 flex justify-between items-center
                      bg-gray-600 cursor-not-allowed opacity-50"
                    disabled={true} // All options disabled - player is in lucky pool
                  >
                    <span>
                      {String.fromCharCode(65 + idx)}. {opt}
                    </span>
                    {opt === QUESTION_3.correctAnswer && <CheckCircle className="ml-2 text-green-400" />}
                  </Button>
                ))}
              </div>
              <div className="mt-4 text-center text-red-300 text-sm">
                🔒 You're in the Lucky Pool - Cannot participate in this question
              </div>
            </div>
          </div>
        )}

        {/* Lucky Draw Display */}
        {stage === "luckyDraw" && (
          <div className="mt-6 w-full max-w-4xl">
            <div className="border border-yellow-500 rounded-xl p-6 bg-yellow-900/20">
              <h2 className="text-yellow-400 text-2xl font-bold mb-4 text-center">
                🎲 LUCKY DRAW IN PROGRESS
              </h2>
              <p className="text-white text-lg mb-6 text-center">
                Drawing 7 names from the Lucky Pool...
              </p>
              
              <div className="grid grid-cols-1 gap-2 max-w-md mx-auto">
                {drawnNames.map((name, idx) => (
                  <div 
                    key={idx} 
                    className={`p-3 rounded-lg text-center font-bold
                      ${name === "PLAYER" 
                        ? "bg-green-600 text-white animate-pulse" 
                        : "bg-purple-600 text-white"
                      }`}
                  >
                    {idx + 1}. {name}
                    {name === "PLAYER" && " 🎉"}
                  </div>
                ))}
              </div>
              
              {drawnNames.length < 7 && (
                <div className="text-center mt-4">
                  <div className="animate-spin inline-block w-6 h-6 border-2 border-yellow-400 border-t-transparent rounded-full"></div>
                  <p className="text-yellow-300 mt-2">Drawing name {drawnNames.length + 1}...</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
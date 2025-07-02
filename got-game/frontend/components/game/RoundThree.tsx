"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AlexVideoPlayer from "@/components/ui/AlexVideoPlayer";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock } from "lucide-react";
import ChatBox from "@/components/ui/ChatBot";

const QUESTION_3 = {
  question: "Who painted the Mona Lisa?",
  options: ["Vincent van Gogh", "Pablo Picasso", "Michelangelo", "Leonardo da Vinci"],
  correctAnswer: "Leonardo da Vinci"
};

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
      const availableNames = LUCKY_POOL_NAMES.filter(name => name !== "PLAYER");

      interval = setInterval(() => {
        if (drawCount < 6) {
          const randomName = availableNames[Math.floor(Math.random() * availableNames.length)];
          setCurrentDrawnName(randomName);
          setDrawnNames(prev => [...prev, randomName]);
          drawCount++;
        } else if (drawCount === 6) {
          setCurrentDrawnName("PLAYER");
          setDrawnNames(prev => [...prev, "PLAYER"]);
          setIsPlayerDrawn(true);
          drawCount++;
        } else {
          clearInterval(interval);
          setTimeout(() => setStage("luckyDrawEnd"), 2000);
        }
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [stage]);

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

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="w-full bg-gradient-to-r from-purple-700 via-indigo-700 to-purple-900 p-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <h1 className="text-2xl font-bold text-white">ROUND 3</h1>
            <div className="text-purple-100">
              {stage === "question"
                ? "You're in the Lucky Pool!"
                : stage === "answerReaction"
                ? "Waiting in Pool..."
                : stage === "alexVideoPart3"
                ? "Get ready for the draw..."
                : "Quiz Round"}
            </div>
          </div>
          <div className="flex items-center space-x-4 text-sm">
            <div className="bg-black/30 px-3 py-1 rounded">PLAYERS: 10</div>
            <div className="bg-black/30 px-3 py-1 rounded">3 Safe / 7 Lucky</div>
            <div className="bg-purple-500/20 px-3 py-1 rounded text-purple-300">LUCKY POOL</div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-12 gap-6 h-[calc(100vh-120px)]">
          {/* Left Column */}
          <div className="col-span-8 space-y-6">
            {/* Video Section */}
            <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-purple-500/50 overflow-hidden shadow-2xl">
              <div className="bg-gradient-to-r from-purple-600/20 to-indigo-600/20 px-4 py-2 border-b border-purple-500/30">
                <h2 className="text-lg font-semibold text-white">Alex - Your Host</h2>
              </div>
              <div className="p-4">
                <div className="w-full h-80 rounded-xl overflow-hidden bg-black relative">
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
                  <div className="absolute top-2 left-2 bg-black/50 text-white text-xs p-2 rounded">
                    Current stage: {stage}
                  </div>
                </div>
              </div>
            </div>

            {/* Locked Question Block */}
            {stage === "question" && (
              <div className="bg-gradient-to-br from-indigo-900/30 to-purple-900/30 rounded-2xl border border-purple-400/50 shadow-xl opacity-70">
                <div className="bg-gradient-to-r from-purple-500/30 to-indigo-500/30 px-6 py-4 border-b border-purple-400/30 flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-white">YOU'RE IN THE POOL</h2>
                  <div className="text-red-400 text-xl font-bold flex items-center">
                    <Clock className="mr-1" /> {timer}s
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-xl text-white mb-6">{QUESTION_3.question}</p>
                  <div className="grid grid-cols-2 gap-4">
                    {QUESTION_3.options.map((opt, idx) => (
                      <Button
                        key={opt}
                        className="h-16 text-lg font-semibold rounded-xl px-6 flex justify-between items-center bg-gray-600 cursor-not-allowed opacity-50"
                        disabled={true}
                      >
                        <span>{String.fromCharCode(65 + idx)}. {opt}</span>
                        {opt === QUESTION_3.correctAnswer && <CheckCircle className="ml-2 text-green-400" />}
                      </Button>
                    ))}
                  </div>
                  <div className="mt-4 text-center text-red-300 text-sm">
                    🔒 You're in the Lucky Pool - This question is locked for you.
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="col-span-4 space-y-6">
            {/* Stat Box */}
            <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-purple-500/50 overflow-hidden shadow-2xl">
              <div className="bg-gradient-to-r from-purple-600/30 to-indigo-600/30 px-4 py-3 border-b border-purple-500/30">
                <h3 className="text-lg font-bold text-white">📊 GAME STATS</h3>
              </div>
              <div className="p-4 text-center">
                {stage === "roundStats" ? (
                  <p className="text-purple-300">Only 3 correct. Drawing 7 Lucky Players...</p>
                ) : (
                  <p className="text-purple-300">
                    {stage === "question"
                      ? `⏰ Timer: ${timer}s`
                      : stage === "answerReaction"
                      ? "Locked. Waiting..."
                      : stage === "alexVideoPart3"
                      ? "Preparing Lucky Draw..."
                      : "You're in the Lucky Pool"}
                  </p>
                )}
              </div>
            </div>

            {/* Chat */}
            <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-purple-500/50 overflow-hidden shadow-2xl flex-1">
              <div className="bg-gradient-to-r from-purple-600/30 to-indigo-600/30 px-4 py-3 border-b border-purple-500/30">
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

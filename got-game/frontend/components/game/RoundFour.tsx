"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AlexVideoPlayer from "@/components/ui/AlexVideoPlayer";
import StatMap from "@/components/ui/StatMap";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";
import ChatBox from "@/components/ui/ChatBot";

const QUESTION_4 = {
  question: "What is the largest ocean on Earth?",
  options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
  correctAnswer: "Pacific Ocean",
};

export default function Round4Page() {
  const router = useRouter();
  const [stage, setStage] = useState("intro");
  const [selected, setSelected] = useState<string | null>(null);
  const [lockOptions, setLockOptions] = useState(false);
  const [statProgress, setStatProgress] = useState(0);

  useEffect(() => {
    if (stage === "finalStats") {
      let filled = 0;
      const interval = setInterval(() => {
        filled++;
        setStatProgress(filled);
        if (filled >= 1) clearInterval(interval);
      }, 10);
      return () => clearInterval(interval);
    }
  }, [stage]);

  const handleVideoEnd = () => {
    if (stage === "intro") setStage("question");
    else if (stage === "postStats") router.push("/game/5");
  };

  const handleAnswer = (option: string) => {
    if (lockOptions || option !== QUESTION_4.correctAnswer) return;
    setSelected(option);
    setLockOptions(true);
    setTimeout(() => setStage("finalStats"), 1000);
  };

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 py-10">
      <div className="absolute top-6 left-6 z-20 text-white space-y-2 text-sm">
        <div>PLAYERS 10</div>
        <div>PRIZE 10,000$</div>
        <div>TIMER 00:15</div>
      </div>

      <div className="relative z-10 w-full max-w-screen-xl px-8 pt-8">
        {/* Top Row: Video + HighScore + Chat */}
        <div className="flex justify-between gap-8">
          {/* Alex Video */}
          <div className="w-2/3">
            {(stage === "intro" || stage === "postStats") && (
              <AlexVideoPlayer
                src={stage === "intro" ? "/video/round4-intro.mp4" : "/video/round4-wrap.mp4"}
                onEnded={handleVideoEnd}
                autoPlay
              />
            )}
          </div>

          {/* Right Panel */}
          <div className="w-1/3 space-y-4">
            {/* HighScore */}
            <div className="text-white p-4 rounded-xl bg-[#1c0f32]/70 border border-purple-500 shadow-md">
              <h3 className="font-bold text-lg text-center">HIGHSCORE</h3>
              <ul className="text-sm mt-2 space-y-1 text-purple-200">
                <li>#1 JiveMaster2023</li>
                <li>#2 GrooveKing2023</li>
                <li>#3 BeatWizard2023</li>
                <li>#4 RhythmNinja2023</li>
              </ul>
            </div>

            {/* Chat */}
            <div className="h-[420px] rounded-xl overflow-hidden">
              <ChatBox />
            </div>
          </div>
        </div>

        {/* Question */}
        {stage === "question" && (
          <div className="mt-10 w-2/3">
            <h2 className="text-white text-xl font-bold mb-2">QUESTION 4</h2>
            <p className="text-white text-lg mb-4">{QUESTION_4.question}</p>
            <div className="grid grid-cols-2 gap-4">
              {QUESTION_4.options.map((opt, idx) => (
                <Button
                  key={opt}
                  className={`h-14 text-base font-semibold transition-all duration-300 rounded-lg px-4 flex justify-between items-center
                    ${
                      selected === opt
                        ? opt === QUESTION_4.correctAnswer
                          ? "bg-green-600"
                          : "bg-red-600"
                        : "bg-purple-700 hover:bg-purple-800"
                    }`}
                  disabled={lockOptions || opt !== QUESTION_4.correctAnswer}
                  onClick={() => handleAnswer(opt)}
                >
                  <span>
                    {String.fromCharCode(65 + idx)}. {opt}
                  </span>
                  {lockOptions && opt === QUESTION_4.correctAnswer && (
                    <CheckCircle className="ml-2" />
                  )}
                  {lockOptions && selected === opt && opt !== QUESTION_4.correctAnswer && (
                    <XCircle className="ml-2" />
                  )}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* StatMap */}
        {stage === "finalStats" && (
          <StatMap total={1} safe={1} progress={statProgress} onComplete={() => setStage("postStats")} />
        )}
      </div>
    </main>
  );
}

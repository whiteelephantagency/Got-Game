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
  wrongAnswers: ["Acton, Massachusetts", "Seoul, South Korea", "Singapore"] // User should click these
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
      // Show many contestants getting it wrong, including us
      let filled = 0;
      interval = setInterval(() => {
        filled++;
        setStatProgress(filled);
        if (filled >= 800) { // 800 got it wrong, moved to lucky pool
          clearInterval(interval);
          setStage("incorrectStatsEnd");
        }
      }, 5);
    } else if (stage === "correctStats") {
      // Show only 80/100 got it correct
      let filled = 0;
      interval = setInterval(() => {
        filled++;
        setStatProgress(filled);
        if (filled >= 80) {
          clearInterval(interval);
          setStage("correctStatsEnd");
        }
      }, 15);
    } else if (stage === "openSlotsStats") {
      // Show 20 open slots
      let filled = 0;
      interval = setInterval(() => {
        filled++;
        setStatProgress(filled);
        if (filled >= 20) {
          clearInterval(interval);
          setStage("openSlotsEnd");
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
    else if (stage === "correctStatsEnd") setStage("alexVideoPart4");
    else if (stage === "alexVideoPart4") setStage("openSlotsStats");
    else if (stage === "openSlotsEnd") setStage("alexVideoPart5");
    else if (stage === "alexVideoPart5") router.push("/lucky-draw?round=2");
  };

  const handleAnswer = (option: string) => {
    if (lockOptions) return;
    
    // In Round 2, we want user to click wrong answers (correct answer is disabled)
    if (QUESTION_2.wrongAnswers.includes(option)) {
      setSelected(option);
      setLockOptions(true);
      setTimerActive(false);
      setTimeout(() => setStage("answerReaction"), 500);
    }
  };

  const startTimer = () => {
    setTimerActive(true);
  };

  // Auto-start timer when question appears
  useEffect(() => {
    if (stage === "question") {
      startTimer();
    }
  }, [stage]);

  return (
    <main className="min-h-screen bg-black text-white flex flex-col relative">
      {/* Right sidebar - Game Stats and Chat */}
      <div className="absolute top-6 right-6 z-20 w-80 space-y-0">
        <div className="h-[200px] rounded-xl overflow-hidden bg-[#1c0f32]/70 border border-purple-500 shadow-md flex flex-col justify-center items-center">
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
            <div className="p-4 text-center">
              <h3 className="text-lg font-bold">GAME STATS</h3>
              <p className="text-sm text-purple-200">
                {stage === "question" ? `Timer: ${timer}s` : 
                 stage === "answerReaction" ? "You got it wrong! Moving to LUCKY POOL..." :
                 stage === "alexVideoPart4" ? "80 correct answers - 20 spots open" :
                 stage === "alexVideoPart5" ? "Ready for Lucky Draw!" :
                 "Round 2 in progress..."}
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
                    ? "/video/round2-video1.mp4"
                    : stage === "answerReaction"
                    ? "/video/alex-question2-part2.mp3"
                    : stage === "incorrectStatsEnd"
                    ? "/video/alex-question2-part3.mp3"
                    : stage === "alexVideoPart4"
                    ? "/video/round2-video4.mp4"
                    : stage === "alexVideoPart5"
                    ? "/video/round2-video5.mp4"
                    : "/video/standby.mp4"
                }
                onEnded={handleVideoEnd}
                autoPlay
                key={stage}
              />
            </div>
          </div>
        </div>

        {/* Question Section */}
        {stage === "question" && (
          <div className="mt-6 w-full max-w-4xl">
            <div className="border border-purple-500 rounded-xl p-6 bg-[#1c0f32]/20">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-white text-2xl font-bold">ROUND 2 QUESTION</h2>
                <div className="text-red-400 text-xl font-bold">
                  ⏰ {timer}s
                </div>
              </div>
              <p className="text-white text-xl mb-6">{QUESTION_2.question}</p>
              <div className="grid grid-cols-2 gap-4">
                {QUESTION_2.options.map((opt, idx) => (
                  <Button
                    key={opt}
                    className={`h-16 text-lg font-semibold transition-all duration-300 rounded-lg px-6 flex justify-between items-center
                      ${
                        selected === opt
                          ? QUESTION_2.wrongAnswers.includes(opt)
                            ? "bg-red-600"
                            : "bg-green-600"
                          : opt === QUESTION_2.correctAnswer
                          ? "bg-gray-600 cursor-not-allowed opacity-50"
                          : "bg-purple-700 hover:bg-purple-800 ring-2 ring-purple-400"
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
              <div className="mt-4 text-center text-purple-300 text-sm">
                {!lockOptions && timer > 0 && "Correct answer is disabled - you must choose wrong to continue"}
                {!lockOptions && timer === 0 && "Time's up! Moving to results..."}
                {lockOptions && QUESTION_2.wrongAnswers.includes(selected!) && "Wrong answer! You're going to the Lucky Pool..."}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
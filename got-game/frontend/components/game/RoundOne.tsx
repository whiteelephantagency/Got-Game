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

  const [showFullScreenStats, setShowFullScreenStats] = useState(false);

  const [currentVideoKey, setCurrentVideoKey] = useState(0);



  // Determine if video should be expanded (when no question is showing)

  const isVideoExpanded = stage !== "question";



  useEffect(() => {

    let interval: NodeJS.Timeout;

    if (stage === "roundStats") {

      // Start the full-screen stats animation

      setShowFullScreenStats(true);

     

      let filled = 0;

      interval = setInterval(() => {

        filled++;

        setStatProgress(filled);

        if (filled >= 1470) {

          clearInterval(interval);

          setTimeout(() => {

            setShowFullScreenStats(false);

            setStage("roundStatsEnd");

          }, 2000); // Keep full screen longer to show the results

        }

      }, 8); // Slower animation for better visibility

    } else if (stage === "finalStats") {

      // Start the full-screen stats animation for final split

      setShowFullScreenStats(true);

     

      let filled = 0;

      interval = setInterval(() => {

        filled++;

        setStatProgress(filled);

        if (filled >= 1000) {

          clearInterval(interval);

          setTimeout(() => {

            setShowFullScreenStats(false);

            setStage("alexVideoPart5");

          }, 4000); // Keep full screen much longer to showcase the final results

        }

      }, 8);

    }

    return () => clearInterval(interval);

  }, [stage]);



  const handleVideoEnd = () => {

    if (stage === "intro") {

      setCurrentVideoKey(prev => prev + 1);

      setStage("question");

    }

    else if (stage === "answerReaction") {

      setCurrentVideoKey(prev => prev + 1);

      setStage("roundStats");

    }

    else if (stage === "roundStatsEnd") {

      setCurrentVideoKey(prev => prev + 1);

      setStage("alexVideoPart4");

    }

    else if (stage === "alexVideoPart4") {

      setCurrentVideoKey(prev => prev + 1);

      setStage("finalStats");

    }

    else if (stage === "alexVideoPart5") {

      router.push("/game/2");

    }

  };



  const handleAnswer = (option: string) => {

    if (lockOptions || option !== QUESTION_1.correctAnswer) return;

    setSelected(option);

    setLockOptions(true);

    // Force new video component by incrementing key

    setCurrentVideoKey(prev => prev + 1);

    setTimeout(() => setStage("answerReaction"), 500);

  };



  return (

     <main className="min-h-screen bg-black bg-[url('/images/lobby-background.jpg')] bg-cover bg-center bg-no-repeat bg-fixed text-white relative">

     

      {/* Full Screen Stats Overlay */}

      {showFullScreenStats && (

        <div className="fixed inset-0 z-50 flex items-center justify-center">

          {/* Backdrop blur */}

          <div className="absolute inset-0 bg-black/60 backdrop-blur-lg"></div>

         

          {/* Stats content */}

          <div className="relative z-10 bg-gradient-to-br from-purple-900/95 to-blue-900/95 rounded-3xl border border-purple-400/50 shadow-2xl p-12 max-w-6xl mx-4 animate-in zoom-in-95 duration-500">

            <div className="text-center space-y-8">

              <h2 className="text-5xl font-bold text-white mb-8">

                {stage === "roundStats" ? "🎯 ROUND 1 RESULTS" : "📊 PLAYER SPLIT"}

              </h2>

             

              {stage === "roundStats" && (

                <div className="space-y-8">

                  {/* Progress Flow */}

                  <div className="grid grid-cols-3 gap-8 items-center">

                    {/* Total Players */}

                    <div className="text-center">

                      <div className="w-24 h-24 mx-auto bg-blue-500 rounded-full flex items-center justify-center mb-4">

                        <span className="text-3xl font-bold">👥</span>

                      </div>

                      <div className="text-2xl font-bold text-blue-400">2,000</div>

                      <div className="text-sm text-gray-300">Total Players</div>

                    </div>

                   

                    {/* Arrow */}

                    <div className="text-center">

                      <div className="text-4xl text-purple-400">→</div>

                      <div className="text-sm text-purple-300 mt-2">Answered Correctly</div>

                    </div>

                   

                    {/* Correct Answers */}

                    <div className="text-center">

                      <div className="w-24 h-24 mx-auto bg-green-500 rounded-full flex items-center justify-center mb-4">

                        <span className="text-3xl font-bold">✅</span>

                      </div>

                      <div className="text-3xl font-bold text-green-400">

                        {statProgress.toLocaleString()}

                      </div>

                      <div className="text-sm text-gray-300">Correct Answers</div>

                    </div>

                  </div>

                 

                  {/* Progress Bar */}

                  <div className="bg-gray-800 rounded-full h-8 overflow-hidden">

                    <div

                      className="bg-gradient-to-r from-green-500 to-emerald-400 h-full transition-all duration-300 rounded-full flex items-center justify-end pr-4"

                      style={{ width: `${(statProgress / 1470) * 100}%` }}

                    >

                      <span className="text-white font-bold text-sm">

                        {statProgress >= 1470 ? "Complete!" : `${Math.round((statProgress / 1470) * 100)}%`}

                      </span>

                    </div>

                  </div>

                 

                  {statProgress >= 1470 && (

                    <div className="space-y-6 animate-in fade-in duration-1000">

                      <div className="text-2xl text-green-400 font-bold">

                        🎉 1,470 Players Got It Right!

                      </div>

                      <div className="text-lg text-yellow-300">

                        But only 1,000 spots available... 470 will enter the Lucky Pool!

                      </div>

                    </div>

                  )}

                </div>

              )}

             

              {stage === "finalStats" && (

                <div className="space-y-8">

                  {/* Final Split Animation */}

                  <div className="grid grid-cols-3 gap-8 items-center">

                    {/* Correct Players */}

                    <div className="text-center">

                      <div className="w-24 h-24 mx-auto bg-green-500 rounded-full flex items-center justify-center mb-4">

                        <span className="text-3xl font-bold">✅</span>

                      </div>

                      <div className="text-2xl font-bold text-green-400">1,470</div>

                      <div className="text-sm text-gray-300">Correct Players</div>

                    </div>

                   

                    {/* Split Arrow */}

                    <div className="text-center">

                      <div className="text-4xl text-purple-400">⚡</div>

                      <div className="text-sm text-purple-300 mt-2">Random Split</div>

                    </div>

                   

                    {/* Results */}

                    <div className="text-center space-y-4">

                      <div className="grid grid-cols-1 gap-3">

                        {/* Safe Players */}

                        <div className="bg-green-600/20 rounded-lg p-3 border border-green-500/50">

                          <div className="text-xl font-bold text-green-400">

                            {Math.min(statProgress, 1000).toLocaleString()}

                          </div>

                          <div className="text-xs text-green-300">Safe to Round 2</div>

                        </div>

                       

                        {/* Lucky Pool */}

                        <div className="bg-yellow-600/20 rounded-lg p-3 border border-yellow-500/50">

                          <div className="text-xl font-bold text-yellow-400">

                            {Math.max(0, Math.min(statProgress, 470)).toLocaleString()}

                          </div>

                          <div className="text-xs text-yellow-300">Lucky Pool</div>

                        </div>

                      </div>

                    </div>

                  </div>

                 

                  {/* Progress Bar for Split */}

                  <div className="bg-gray-800 rounded-full h-8 overflow-hidden">

                    <div

                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-full transition-all duration-300 rounded-full flex items-center justify-end pr-4"

                      style={{ width: `${(statProgress / 1000) * 100}%` }}

                    >

                      <span className="text-white font-bold text-sm">

                        {statProgress >= 1000 ? "Split Complete!" : `${Math.round((statProgress / 1000) * 100)}%`}

                      </span>

                    </div>

                  </div>

                 

                  {statProgress >= 1000 && (

                    <div className="text-xl text-purple-400 font-bold animate-pulse">

                      🎲 Random Selection Complete!

                    </div>

                  )}

                </div>

              )}

            </div>

          </div>

        </div>

      )}

     

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

            <div className="bg-black/30 px-3 py-1 rounded">PLAYERS: 2,000</div>

            <div className="bg-black/30 px-3 py-1 rounded">TARGET: 1,000</div>

            <div className="bg-purple-500/20 px-3 py-1 rounded text-purple-300">ROUND 1</div>

          </div>

        </div>

      </div>



      {/* Main Game Area */}

      <div className="max-w-7xl mx-auto p-6">

        <div className="grid grid-cols-12 gap-6 min-h-[calc(100vh-120px)]">

         

          {/* Left Column - Main Content */}

          <div className="col-span-8 flex flex-col space-y-6">



            {/* Alex Video Section - Fixed height container */}

            <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-purple-500/50 overflow-hidden shadow-2xl flex-1 flex flex-col">

              <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 px-4 py-2 border-b border-purple-500/30">

                <h2 className="text-lg font-semibold text-white">Alex - Your Host</h2>

              </div>

              <div className="p-4 flex-1 flex flex-col">

                <div className="w-full rounded-xl overflow-hidden bg-black flex-1 min-h-0">

                  {/* Only render AlexVideoPlayer for specific stages */}

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

                      key={`video-${stage}-${currentVideoKey}`}

                      className="w-full h-full object-cover"

                      hideControls={true}

                      showAudioIndicator={false}

                    />

                  )}

                 

                  {/* Show placeholder during non-video stages */}

                  {(stage === "question") && (

                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-900/20 to-blue-900/20">

                      <div className="text-center space-y-4">

                        <div className="text-3xl">🎵</div>

                        <div className="text-xl font-semibold text-purple-300">

                          Answer the Question!

                        </div>

                        <div className="text-sm text-gray-400">

                          Listen carefully to the music clip

                        </div>

                      </div>

                    </div>

                  )}

                 

                  {/* Show placeholder during stats stages */}

                  {(stage === "roundStats" || stage === "finalStats") && (

                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-900/20 to-blue-900/20">

                      <div className="text-center space-y-4">

                        <div className="text-3xl">🎯</div>

                        <div className="text-xl font-semibold text-purple-300">

                          {stage === "roundStats" ? "Calculating Results..." : "Processing Final Stats..."}

                        </div>

                        <div className="text-sm text-gray-400">

                          Check the full screen for detailed results!

                        </div>

                      </div>

                    </div>

                  )}

                </div>

              </div>

            </div>



            {/* Question Section - Only shown when stage is "question" */}

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

                {/* Basic game info - before and during question */}

                {(stage === "intro" || stage === "question" || stage === "answerReaction") && (

                  <div className="text-center space-y-4">

                    <div className="text-lg font-bold text-purple-400 mb-3">Round 1 Info</div>

                   

                    {/* Players Count */}

                    <div className="bg-blue-600/20 rounded-lg p-3 border border-blue-500/30">

                      <div className="flex justify-between items-center">

                        <span className="text-blue-300 text-sm">👥 Total Players</span>

                        <span className="text-blue-400 font-bold">2,000</span>

                      </div>

                      <div className="text-xs text-blue-200 mt-1">competing this round</div>

                    </div>

                   

                    {/* Target Info */}

                    <div className="bg-purple-600/20 rounded-lg p-3 border border-purple-500/30">

                      <div className="flex justify-between items-center">

                        <span className="text-purple-300 text-sm">🎯 Target for Round 2</span>

                        <span className="text-purple-400 font-bold">1,000</span>

                      </div>

                      <div className="text-xs text-purple-200 mt-1">spots available</div>

                    </div>

                   

                    {/* Status */}

                    <div className="text-center text-sm text-gray-400 mt-3">

                      {stage === "question" ? "Waiting for answers..." :

                       stage === "answerReaction" ? "Calculating results..." :

                       "Round 1 in progress..."}

                    </div>

                  </div>

                )}

               

                {/* During stats animations */}

                {(stage === "roundStats" || stage === "finalStats") && (

                  <StatMap

                    total={1470}

                    safe={1000}

                    progress={statProgress}

                    label={stage === "roundStats" ? "Filling 1470 correct answers" : "Moving 1000 to safe spots, 470 to lucky pool"}

                    showFinalSplit={stage === "finalStats"}

                  />

                )}

               

                {/* After first stats - show results without lucky pool info */}

                {(stage === "roundStatsEnd" || stage === "alexVideoPart4") && (

                  <div className="space-y-4">

                    <div className="text-center mb-4">

                      <div className="text-lg font-bold text-purple-400 mb-2">Round 1 Results</div>

                    </div>

                   

                    {/* Results Breakdown */}

                    <div className="space-y-3">

                      {/* Total Correct */}

                      <div className="bg-green-600/20 rounded-lg p-3 border border-green-500/30">

                        <div className="flex justify-between items-center">

                          <span className="text-green-300 text-sm">✅ Correct Answers</span>

                          <span className="text-green-400 font-bold">1,470</span>

                        </div>

                        <div className="text-xs text-green-200 mt-1">out of 2,000 players</div>

                      </div>

                     

                      {/* Safe Players */}

                      <div className="bg-blue-600/20 rounded-lg p-3 border border-blue-500/30">

                        <div className="flex justify-between items-center">

                          <span className="text-blue-300 text-sm">🛡️ Safe to Round 2</span>

                          <span className="text-blue-400 font-bold">1,000</span>

                        </div>

                        <div className="text-xs text-blue-200 mt-1">guaranteed advancement</div>

                      </div>

                    </div>

                  </div>

                )}

               

                {/* After final stats - complete summary with lucky pool and player status */}

                {stage === "alexVideoPart5" && (

                  <div className="space-y-4">

                    <div className="text-center mb-4">

                      <div className="text-lg font-bold text-purple-400 mb-2">Final Summary</div>

                    </div>

                   

                    {/* Results Breakdown */}

                    <div className="space-y-3">

                      {/* Total Correct */}

                      <div className="bg-green-600/20 rounded-lg p-3 border border-green-500/30">

                        <div className="flex justify-between items-center">

                          <span className="text-green-300 text-sm">✅ Correct Answers</span>

                          <span className="text-green-400 font-bold">1,470</span>

                        </div>

                        <div className="text-xs text-green-200 mt-1">out of 2,000 players</div>

                      </div>

                     

                      {/* Safe Players */}

                      <div className="bg-blue-600/20 rounded-lg p-3 border border-blue-500/30">

                        <div className="flex justify-between items-center">

                          <span className="text-blue-300 text-sm">🛡️ Safe to Round 2</span>

                          <span className="text-blue-400 font-bold">1,000</span>

                        </div>

                        <div className="text-xs text-blue-200 mt-1">guaranteed advancement</div>

                      </div>

                     

                      {/* Lucky Pool */}

                      <div className="bg-yellow-600/20 rounded-lg p-3 border border-yellow-500/30">

                        <div className="flex justify-between items-center">

                          <span className="text-yellow-300 text-sm">🎲 Lucky Pool</span>

                          <span className="text-yellow-400 font-bold">470</span>

                        </div>

                        <div className="text-xs text-yellow-200 mt-1">awaiting random draw</div>

                      </div>

                    </div>

                   

                    {/* Player Status */}

                    <div className="mt-4 pt-3 border-t border-purple-500/30">

                      <div className="bg-green-500/20 rounded-lg p-3 border border-green-400/50">

                        <div className="flex items-center justify-center space-x-2">

                          <span className="text-green-400">🎉</span>

                          <span className="text-green-300 font-semibold">YOU ARE SAFE!</span>

                        </div>

                        <div className="text-xs text-green-200 text-center mt-1">

                          Advanced to Round 2

                        </div>

                      </div>

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
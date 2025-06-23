"use client";

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Star, Users, Trophy, Crown } from "lucide-react"
import AlexVideoPlayer from "@/components/ui/AlexVideoPlayer"

export default function LuckyDraw() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const round = searchParams.get('round') || '2'
  const comeback = searchParams.get('comeback') === 'true' // Check if this is a comeback draw
  
  const [playerName, setPlayerName] = useState("Player")
  const [stage, setStage] = useState("drawing")
  const [displayedNames, setDisplayedNames] = useState<string[]>([])
  const [remainingSpots, setRemainingSpots] = useState(comeback ? 7 : 20) // 7 for comeback, 20 for elimination
  const [selectedNames, setSelectedNames] = useState<string[]>([])
  const [isPlayerSelected, setIsPlayerSelected] = useState(false)

  // Get player name from localStorage
  useEffect(() => {
    const name = localStorage.getItem("playerName") || "Player";
    setPlayerName(name);
  }, []);

  // Sample player names for the lucky draw animation
  const sampleNames = [
    "Alex", "Jordan", "Taylor", "Casey", "Morgan", "Riley", "Jamie", "Quinn", 
    "Avery", "Blake", "Cameron", "Dakota", "Emerson", "Finley", "Harper", 
    "Kendall", "Logan", "Madison", "Noah", "Olivia", "Parker", "Rowan", 
    "Skyler", "Tatum", "Zion", "Bailey", "Charlie", "Drew", "Phoenix", "River"
  ]

  useEffect(() => {
    if (stage === "drawing") {
      let drawCount = 0;
      const drawInterval = setInterval(() => {
        if (comeback) {
          // Round 3 comeback draw - player IS selected (7th spot)
          if (drawCount < 6) {
            const randomName = sampleNames[Math.floor(Math.random() * sampleNames.length)];
            setSelectedNames(prev => [...prev, randomName]);
            setDisplayedNames(prev => [...prev, randomName]);
            drawCount++;
            
            // Play suspense audio after 3rd name
            if (drawCount === 3) {
              setTimeout(() => setStage("suspenseAudio"), 500);
              return; // Stop the interval to play audio
            }
          } else if (drawCount === 6) {
            // 7th name is always the PLAYER
            setSelectedNames(prev => [...prev, playerName]);
            setDisplayedNames(prev => [...prev, playerName]);
            setIsPlayerSelected(true);
            drawCount++;
            clearInterval(drawInterval);
            setTimeout(() => setStage("selected"), 1000);
          }
        } else {
          // Round 2 elimination draw - player is NOT selected
          if (drawCount < remainingSpots) {
            const randomName = sampleNames[Math.floor(Math.random() * sampleNames.length)];
            setSelectedNames(prev => [...prev, randomName]);
            setDisplayedNames(prev => [...prev, randomName]);
            drawCount++;
          } else {
            clearInterval(drawInterval);
            setTimeout(() => setStage("notSelected"), 1000);
          }
        }
      }, comeback ? 1500 : 800); // Slower for comeback draw

      return () => clearInterval(drawInterval);
    }
  }, [stage, comeback, remainingSpots, playerName]);

  // Resume drawing after suspense audio
  useEffect(() => {
    if (stage === "drawingResume" && comeback) {
      let drawCount = displayedNames.length; // Continue from current count
      const drawInterval = setInterval(() => {
        if (drawCount < 6) {
          const randomName = sampleNames[Math.floor(Math.random() * sampleNames.length)];
          setSelectedNames(prev => [...prev, randomName]);
          setDisplayedNames(prev => [...prev, randomName]);
          drawCount++;
        } else if (drawCount === 6) {
          // 7th name is always the PLAYER
          setSelectedNames(prev => [...prev, playerName]);
          setDisplayedNames(prev => [...prev, playerName]);
          setIsPlayerSelected(true);
          drawCount++;
          clearInterval(drawInterval);
          setTimeout(() => setStage("selected"), 1000);
        }
      }, 1500);

      return () => clearInterval(drawInterval);
    }
  }, [stage, comeback, displayedNames.length, playerName]);

  const handleAudioEnd = () => {
    if (stage === "alexAudio") {
      setStage("complete");
    } else if (stage === "suspenseAudio") {
      // Continue drawing after suspense audio - resume from where we left off
      setStage("drawingResume");
    }
  };

  const handleContinue = () => {
    if (comeback && isPlayerSelected) {
      // Player was selected in comeback draw - continue to next round
      router.push(`/game/${parseInt(round) + 1}`);
    } else {
      // Player was not selected - go to next round in lucky pool
      router.push(`/game/${parseInt(round) + 1}`);
    }
  };

  const startAlexAudio = () => {
    setStage("alexAudio");
  };

  // Determine if this is an audio-only stage
  const isAudioStage = stage === "alexAudio" || stage === "suspenseAudio";

  return (
    <main className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* 3D Starfield Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="stars-container">
          {[...Array(150)].map((_, i) => (
            <div
              key={i}
              className="star"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        .stars-container {
          position: absolute;
          width: 100%;
          height: 100%;
          perspective: 1000px;
        }
        .star {
          position: absolute;
          width: 2px;
          height: 2px;
          background: white;
          border-radius: 50%;
          animation: twinkle linear infinite;
        }
        .star:nth-child(4n) {
          background: #a855f7;
          box-shadow: 0 0 6px #a855f7;
        }
        .star:nth-child(4n+1) {
          background: #fbbf24;
          box-shadow: 0 0 6px #fbbf24;
        }
        .star:nth-child(4n+2) {
          background: #22c55e;
          box-shadow: 0 0 6px #22c55e;
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0; transform: scale(0.5); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        .glow-text {
          text-shadow: 0 0 20px currentColor;
        }
        .glow-border {
          box-shadow: 0 0 30px rgba(168, 85, 247, 0.3);
        }
      `}</style>

      {/* Enhanced Top Header */}
      <div className="w-full bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-800 p-6 shadow-2xl backdrop-blur-sm border-b border-purple-400/30 relative z-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-8">
            {/* GOT GAME Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center font-bold text-black text-xl shadow-lg">
                G
              </div>
              <div className="text-2xl font-bold text-white tracking-wider">GOT GAME</div>
            </div>
            <div className="h-8 w-px bg-white/30"></div>
            <h1 className="text-3xl font-bold text-white flex items-center">
              <Star className="mr-2 fill-yellow-400 text-yellow-400" size={32} />
              LUCKY DRAW
            </h1>
            <div className="text-purple-100 text-lg font-medium">
              {stage === "drawing" || stage === "drawingResume" ? 
                `🎲 Drawing ${remainingSpots} lucky ${comeback ? 'comeback' : 'advancement'} spots...` :
               stage === "suspenseAudio" ? "🎵 Alex building suspense..." :
               stage === "selected" ? `🎉 ${playerName} is back in the game!` :
               stage === "notSelected" ? `❌ ${playerName} not selected` :
               stage === "alexAudio" ? `🎤 Alex speaking to ${playerName}...` :
               stage === "complete" ? `🍀 ${playerName} in Lucky Pool` :
               comeback ? `🔄 Round ${round} Comeback Draw` : `⚡ Round ${round} Lucky Draw`}
            </div>
          </div>
          <div className="flex items-center space-x-6 text-lg font-semibold">
            <div className="bg-black/40 px-4 py-2 rounded-xl backdrop-blur-sm border border-white/20">
              🎲 SPOTS: {remainingSpots}
            </div>
            <div className="bg-black/40 px-4 py-2 rounded-xl backdrop-blur-sm border border-white/20">
              👤 PLAYER: {playerName}
            </div>
            <div className="bg-purple-500/30 px-4 py-2 rounded-xl text-purple-200 backdrop-blur-sm border border-purple-400/40">
              {comeback ? "🔄 COMEBACK" : "🍀 ELIMINATION"}
            </div>
          </div>
        </div>
      </div>

      <div className="flex min-h-[calc(100vh-120px)] flex-col items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-6xl flex flex-col items-center gap-8">
          
          {/* Logo Section */}
          <div className="relative w-full max-w-xs">
            <Image
              src="/images/logo.png"
              alt="GOT GAME Logo"
              width={500}
              height={200}
              priority
              className="w-full h-auto drop-shadow-2xl"
            />
          </div>

          {/* Title Section */}
          <div className="text-center">
            <h2 className="text-4xl font-bold text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-400 bg-clip-text glow-text mb-4">
              {comeback ? "🔄 COMEBACK DRAW" : "🍀 LUCKY DRAW"}
            </h2>
            <p className="text-xl text-purple-300">
              {comeback 
                ? `Drawing ${remainingSpots} comeback spots from the Lucky Pool - Round ${round}!`
                : `Drawing ${remainingSpots} advancement spots from the Lucky Pool!`
              }
            </p>
          </div>

          {/* Alex Audio Player - Full Screen During Audio */}
          {isAudioStage && (
            <div className="w-full max-w-4xl">
              <div className="bg-gradient-to-br from-purple-900/80 to-indigo-900/80 rounded-2xl border border-purple-500/50 shadow-2xl backdrop-blur-sm p-8">
                <div className="text-center space-y-6">
                  <h3 className="text-3xl font-bold text-white">🎤 ALEX SPEAKING</h3>
                  <div className="text-5xl">
                    {stage === "suspenseAudio" ? "🎵" : "🎙️"}
                  </div>
                  <div className="text-xl text-white">
                    {stage === "suspenseAudio" ? 
                      "Alex is building suspense for the Lucky Draw..." :
                      `Alex has something important to say to ${playerName}...`
                    }
                  </div>
                  <div className="w-full h-64 rounded-xl overflow-hidden bg-black">
                    <AlexVideoPlayer
                      src={
                        stage === "alexAudio" 
                          ? `/video/alex-question${round}-part6.mp3`
                          : `/video/alex-question${round}-part4.mp3`
                      }
                      onEnded={handleAudioEnd}
                      autoPlay
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Main Lucky Draw Area */}
          {!isAudioStage && (
            <div className="w-full max-w-4xl bg-gradient-to-br from-gray-900/80 to-black/80 rounded-2xl p-8 glow-border backdrop-blur-sm border border-purple-500/50 shadow-2xl">
              
              {/* Stats Header */}
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-3 bg-purple-900/30 px-4 py-2 rounded-xl">
                  <Users className="h-6 w-6 text-purple-400" />
                  <span className="text-white text-lg">
                    Drawing: <span className="text-purple-400 font-bold text-xl">{remainingSpots} spots</span>
                  </span>
                </div>
                <div className="flex items-center gap-3 bg-indigo-900/30 px-4 py-2 rounded-xl">
                  <Star className="h-6 w-6 fill-yellow-500 text-yellow-400" />
                  <span className="text-white text-lg">Round {round} Lucky Draw</span>
                </div>
              </div>

              {/* Draw Results Area */}
              <div className="space-y-8">
                <div className="bg-black/60 rounded-xl p-6 min-h-[400px] flex flex-col backdrop-blur-sm border border-purple-500/30">
                  
                  {(stage === "drawing" || stage === "drawingResume") ? (
                    <div className="flex-1 flex flex-col">
                      <div className="text-2xl text-white mb-6 text-center font-bold">
                        🎲 Drawing lucky players...
                      </div>
                      <div className={`grid gap-4 w-full ${comeback ? 'grid-cols-1 max-w-2xl mx-auto' : 'grid-cols-4'}`}>
                        {displayedNames.map((name, index) => (
                          <div 
                            key={index} 
                            className={`p-4 rounded-xl text-center text-white font-bold text-lg transform transition-all duration-500 hover:scale-105
                              ${name === playerName 
                                ? "bg-gradient-to-r from-green-600 to-emerald-600 animate-pulse shadow-lg shadow-green-500/50 ring-4 ring-green-400" 
                                : comeback 
                                ? "bg-gradient-to-r from-purple-600 to-indigo-600 shadow-lg" 
                                : "bg-gradient-to-r from-purple-900/70 to-indigo-900/70"
                              }`}
                          >
                            <div className="flex items-center justify-center space-x-2">
                              <span>#{index + 1}</span>
                              <span>{name}</span>
                              {name === playerName && <Crown className="text-yellow-400" size={20} />}
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="text-center mt-6 space-y-2">
                        <div className="text-purple-300 text-xl">
                          {displayedNames.length} / {remainingSpots} drawn
                        </div>
                        {comeback && displayedNames.length < remainingSpots && (
                          <div className="flex flex-col items-center space-y-3">
                            <div className="animate-spin w-8 h-8 border-4 border-yellow-400 border-t-transparent rounded-full"></div>
                            <p className="text-yellow-300 text-lg font-medium">
                              Drawing name #{displayedNames.length + 1}...
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                    
                  ) : stage === "selected" ? (
                    <div className="text-center flex-1 flex flex-col justify-center space-y-6">
                      <div className="text-4xl font-bold mb-4 text-transparent bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text glow-text">
                        🎉 {playerName} IS BACK IN THE GAME! 🎉
                      </div>
                      <div className="text-2xl text-white mb-6">
                        Congratulations! You've been selected in the comeback draw!
                      </div>
                      <div className="text-lg text-purple-300 mb-6 bg-green-900/30 p-4 rounded-xl border border-green-500/50">
                        🎯 You can now continue to Round {parseInt(round) + 1}!
                      </div>
                      <Button
                        onClick={handleContinue}
                        className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-4 text-xl font-bold mx-auto rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300"
                      >
                        🚀 Continue to Round {parseInt(round) + 1}
                      </Button>
                    </div>
                    
                  ) : stage === "notSelected" ? (
                    <div className="text-center flex-1 flex flex-col justify-center space-y-6">
                      <div className="text-4xl font-bold mb-4 text-transparent bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text glow-text">
                        ❌ NOT SELECTED
                      </div>
                      <div className="text-2xl text-white mb-6">
                        Sorry, {playerName}. Your name was not drawn this time.
                      </div>
                      <div className="text-lg text-purple-300 mb-6 bg-red-900/30 p-4 rounded-xl border border-red-500/50">
                        {remainingSpots} players were selected to advance to Round {parseInt(round) + 1}.
                      </div>
                      <Button
                        onClick={() => setStage("alexAudio")}
                        className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-8 py-4 text-xl font-bold mx-auto rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300"
                      >
                        🎤 Hear from Alex
                      </Button>
                    </div>
                    
                  ) : stage === "complete" ? (
                    <div className="text-center flex-1 flex flex-col justify-center space-y-6">
                      <div className="text-4xl font-bold mb-4 text-transparent bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text">
                        🍀 WELCOME TO THE LUCKY POOL
                      </div>
                      <div className="text-2xl text-white mb-6">
                        {playerName}, you're now in the Lucky Pool!
                      </div>
                      <div className="text-lg text-purple-300 mb-6 bg-yellow-900/30 p-4 rounded-xl border border-yellow-500/50">
                        🎲 Proceeding to Round {parseInt(round) + 1} - you'll be waiting for another chance!
                      </div>
                      <Button
                        onClick={handleContinue}
                        className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white px-8 py-4 text-xl font-bold mx-auto rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300"
                      >
                        🍀 Continue to Round {parseInt(round) + 1}
                      </Button>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
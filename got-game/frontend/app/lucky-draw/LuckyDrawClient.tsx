"use client";

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Star, Users } from "lucide-react"
import AlexVideoPlayer from "@/components/ui/AlexVideoPlayer"

export default function LuckyDraw() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const round = searchParams.get('round') || '2'
  const comeback = searchParams.get('comeback') === 'true' // Check if this is a comeback draw
  
  const [playerName, setPlayerName] = useState("PLAYER")
  const [stage, setStage] = useState("drawing")
  const [displayedNames, setDisplayedNames] = useState<string[]>([])
  const [remainingSpots, setRemainingSpots] = useState(comeback ? 7 : 20) // 7 for comeback, 20 for elimination
  const [selectedNames, setSelectedNames] = useState<string[]>([])
  const [isPlayerSelected, setIsPlayerSelected] = useState(false)

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
            setSelectedNames(prev => [...prev, "PLAYER"]);
            setDisplayedNames(prev => [...prev, "PLAYER"]);
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
  }, [stage, comeback, remainingSpots]);

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
          setSelectedNames(prev => [...prev, "PLAYER"]);
          setDisplayedNames(prev => [...prev, "PLAYER"]);
          setIsPlayerSelected(true);
          drawCount++;
          clearInterval(drawInterval);
          setTimeout(() => setStage("selected"), 1000);
        }
      }, 1500);

      return () => clearInterval(drawInterval);
    }
  }, [stage, comeback, displayedNames.length]);

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

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-black relative overflow-hidden">
      {/* Stars background */}
      {Array.from({ length: 50 }).map((_, i) => (
        <div
          key={i}
          className="star"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 2}s`,
          }}
        />
      ))}

      <div className="w-full max-w-4xl flex flex-col items-center gap-6 z-10">
        <div className="relative w-full max-w-xs mb-4">
          <Image
            src="/images/logo.png"
            alt="GOT GAME Logo"
            width={500}
            height={200}
            priority
            className="w-full h-auto"
          />
        </div>

        <div className="text-center mb-2">
          <h1 className="text-3xl font-bold text-white glow-text mb-2">LUCKY DRAW</h1>
          <p className="text-purple-300">
            {comeback 
              ? `Drawing ${remainingSpots} names from the Lucky Pool - Round ${round} Comeback!`
              : `Drawing ${remainingSpots} names from the Lucky Pool!`
            }
          </p>
        </div>

        {/* Alex Audio Player */}
        {(stage === "alexAudio" || stage === "suspenseAudio") && (
          <div className="w-full mb-4">
            <div className="border border-purple-500 rounded-xl p-4 bg-[#1c0f32]/30">
              <div className="w-full h-48 rounded-lg overflow-hidden flex items-center justify-center">
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
        )}

        <div className="w-full bg-gray-900/50 rounded-lg p-6 glow-border">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-400" />
              <span className="text-white">
                Drawing: <span className="text-purple-400 font-bold">{remainingSpots} spots</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 fill-purple-500 text-purple-300" />
              <span className="text-white">Round {round} Lucky Draw</span>
            </div>
          </div>

          <div className="space-y-6 mb-6">
            <div className="bg-black/50 rounded-lg p-4 min-h-[300px] flex flex-col">
              {(stage === "drawing" || stage === "drawingResume") ? (
                <>
                  <div className="text-xl text-white mb-4 text-center">Drawing lucky players...</div>
                  <div className={`grid gap-2 w-full ${comeback ? 'grid-cols-1 max-w-md mx-auto' : 'grid-cols-4'}`}>
                    {displayedNames.map((name, index) => (
                      <div 
                        key={index} 
                        className={`p-2 rounded text-center text-white text-sm font-bold
                          ${name === "PLAYER" 
                            ? "bg-green-600 animate-pulse" 
                            : comeback 
                            ? "bg-purple-600" 
                            : "bg-purple-900/50"
                          }`}
                      >
                        {index + 1}. {name}
                        {name === "PLAYER" && " 🎉"}
                      </div>
                    ))}
                  </div>
                  <div className="text-center mt-4 text-purple-300">
                    {displayedNames.length} / {remainingSpots} drawn
                  </div>
                  {comeback && displayedNames.length < remainingSpots && (
                    <div className="text-center mt-2">
                      <div className="animate-spin inline-block w-6 h-6 border-2 border-yellow-400 border-t-transparent rounded-full"></div>
                      <p className="text-yellow-300 mt-2">Drawing name {displayedNames.length + 1}...</p>
                    </div>
                  )}
                </>
              ) : stage === "suspenseAudio" ? (
                <div className="text-center flex-1 flex flex-col justify-center">
                  <div className="text-xl text-white mb-4">
                    Alex is building suspense...
                  </div>
                  <div className="text-purple-300">
                    🎵 "The suspense is KILLING ME! If your name isn't selected... that might be game over for you."
                  </div>
                </div>
              ) : stage === "selected" ? (
                <div className="text-center flex-1 flex flex-col justify-center">
                  <div className="text-2xl font-bold mb-4 text-green-400 glow-text">
                    🎉 YOU'RE BACK IN THE GAME!
                  </div>
                  <div className="text-xl text-white mb-6">
                    Congratulations, {playerName}! You've been selected!
                  </div>
                  <div className="text-lg text-purple-300 mb-4">
                    You can now continue to the next round!
                  </div>
                  <Button
                    onClick={handleContinue}
                    className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg font-bold mx-auto"
                  >
                    Continue to Round {parseInt(round) + 1}
                  </Button>
                </div>
              ) : stage === "notSelected" ? (
                <div className="text-center flex-1 flex flex-col justify-center">
                  <div className="text-2xl font-bold mb-4 text-red-400 glow-text">
                    NOT SELECTED
                  </div>
                  <div className="text-xl text-white mb-6">
                    Sorry, {playerName}. Your name was not drawn.
                  </div>
                  <div className="text-lg text-purple-300 mb-4">
                    {remainingSpots} players were selected to continue to Round {parseInt(round) + 1}.
                  </div>
                  <Button
                    onClick={() => setStage("alexAudio")}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 text-lg font-bold mx-auto"
                  >
                    Continue
                  </Button>
                </div>
              ) : stage === "alexAudio" ? (
                <div className="text-center flex-1 flex flex-col justify-center">
                  <div className="text-xl text-white mb-4">
                    Alex has something to say...
                  </div>
                  <div className="text-purple-300">
                    🎵 "Oh dear, {playerName}--seems like you gotta believe in your luck more."
                  </div>
                </div>
              ) : stage === "complete" ? (
                <div className="text-center flex-1 flex flex-col justify-center">
                  <div className="text-2xl font-bold mb-4 text-yellow-400">
                    LUCKY POOL
                  </div>
                  <div className="text-xl text-white mb-6">
                    You're now in the Lucky Pool, {playerName}!
                  </div>
                  <div className="text-lg text-purple-300 mb-6">
                    Proceeding to Round {parseInt(round) + 1} - you'll be waiting for another chance!
                  </div>
                  <Button
                    onClick={handleContinue}
                    className="bg-yellow-600 hover:bg-yellow-700 text-white px-8 py-3 text-lg font-bold mx-auto"
                  >
                    Continue to Round {parseInt(round) + 1}
                  </Button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
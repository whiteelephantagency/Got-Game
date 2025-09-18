"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Star, Users, Trophy, Crown } from "lucide-react";
import AlexVideoPlayer from "@/components/ui/AlexVideoPlayer";

export default function LuckyDraw() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const round = searchParams.get("round") || "2";
  const comeback = searchParams.get("comeback") === "true";

  const [playerName, setPlayerName] = useState("Player");
  const [stage, setStage] = useState<
    | "drawing"
    | "drawingResume"
    | "suspenseAudio"
    | "selected"
    | "notSelected"
    | "alexAudio"
    | "complete"
  >("drawing");
  const [displayedNames, setDisplayedNames] = useState<string[]>([]);
  const [remainingSpots, setRemainingSpots] = useState(comeback ? 7 : 20);
  const [selectedNames, setSelectedNames] = useState<string[]>([]);
  const [isPlayerSelected, setIsPlayerSelected] = useState(false);

  /* ---------------- SFX (same files as Round 1) ---------------- */
  const tickRef = useRef<HTMLAudioElement | null>(null);   // whoosh.wav used as short tick
  const loopRef = useRef<HTMLAudioElement | null>(null);   // fill-loop.wav
  const chimeRef = useRef<HTMLAudioElement | null>(null);  // chime.wav
  const crowdRef = useRef<HTMLAudioElement | null>(null);  // crowd-cheer.wav
  const [audioPrimed, setAudioPrimed] = useState(false);

  // Preload SFX
  useEffect(() => {
    tickRef.current = new Audio("/sfx/whoosh.wav");
    if (tickRef.current) tickRef.current.volume = 0.35;

    loopRef.current = new Audio("/sfx/fill-loop.wav");
    if (loopRef.current) {
      loopRef.current.loop = true;
      loopRef.current.volume = 0.22;
    }

    chimeRef.current = new Audio("/sfx/chime.wav");
    if (chimeRef.current) chimeRef.current.volume = 0.7;

    crowdRef.current = new Audio("/sfx/crowd-cheer.wav");
    if (crowdRef.current) crowdRef.current.volume = 0.65;

    return () => {
      [tickRef.current, loopRef.current, chimeRef.current, crowdRef.current].forEach((a) => {
        if (!a) return;
        a.pause();
        a.currentTime = 0;
      });
    };
  }, []);

  // Prime audio on first user gesture (non-visual, no UI change)
  useEffect(() => {
    if (audioPrimed) return;
    const unlock = async () => {
      if (audioPrimed) return;
      try {
        await tickRef.current?.play();
        tickRef.current?.pause();
        if (tickRef.current) tickRef.current.currentTime = 0;
        setAudioPrimed(true);
      } catch {
        /* ignore – browser will allow after next gesture */
      }
    };
    window.addEventListener("pointerdown", unlock, { once: true });
    window.addEventListener("keydown", unlock, { once: true });
    return () => {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
    };
  }, [audioPrimed]);

  const playTick = () => {
    const a = tickRef.current;
    if (!a) return;
    a.currentTime = 0;
    a.play().catch(() => {});
  };
  const startLoop = () => {
    const a = loopRef.current;
    if (!a) return;
    a.currentTime = 0;
    a.play().catch(() => {});
  };
  const stopLoop = () => {
    const a = loopRef.current;
    if (!a) return;
    a.pause();
    a.currentTime = 0;
  };

  /* ------------------------------------------------------------ */

  useEffect(() => {
    const name = localStorage.getItem("playerName") || "Player";
    setPlayerName(name);
  }, []);

  const sampleNames = [
    "Alex", "Jordan", "Taylor", "Casey", "Morgan", "Riley", "Jamie", "Quinn",
    "Avery", "Blake", "Cameron", "Dakota", "Emerson", "Finley", "Harper",
    "Kendall", "Logan", "Madison", "Noah", "Olivia", "Parker", "Rowan",
    "Skyler", "Tatum", "Zion", "Bailey", "Charlie", "Drew", "Phoenix", "River",
  ];

  // Initial drawing flow (adds SFX)
  useEffect(() => {
    if (stage !== "drawing") return;

    startLoop(); // begin subtle drum/bed loop

    let drawCount = 0;
    const drawInterval = setInterval(() => {
      if (comeback) {
        if (drawCount < 6) {
          const randomName = sampleNames[Math.floor(Math.random() * sampleNames.length)];
          setSelectedNames((prev) => [...prev, randomName]);
          setDisplayedNames((prev) => [...prev, randomName]);
          drawCount++;
          playTick(); // tick on each name reveal

          if (drawCount === 3) {
            // brief suspense beat via Alex audio
            setTimeout(() => setStage("suspenseAudio"), 500);
          }
        } else if (drawCount === 6) {
          setSelectedNames((prev) => [...prev, playerName]);
          setDisplayedNames((prev) => [...prev, playerName]);
          setIsPlayerSelected(true);
          drawCount++;
          clearInterval(drawInterval);
          stopLoop(); // stop the loop before result
          // celebratory sounds
          chimeRef.current?.play().catch(() => {});
          crowdRef.current?.play().catch(() => {});
          setTimeout(() => setStage("selected"), 1000);
        }
      } else {
        if (drawCount < remainingSpots) {
          const randomName = sampleNames[Math.floor(Math.random() * sampleNames.length)];
          setSelectedNames((prev) => [...prev, randomName]);
          setDisplayedNames((prev) => [...prev, randomName]);
          drawCount++;
          playTick();
        } else {
          clearInterval(drawInterval);
          stopLoop();
          setTimeout(() => setStage("notSelected"), 1000);
        }
      }
    }, comeback ? 1500 : 800);

    return () => {
      clearInterval(drawInterval);
      stopLoop(); // safety
    };
  }, [stage, comeback, remainingSpots, playerName]);

  // Resume drawing after suspense (adds SFX)
  useEffect(() => {
    if (stage !== "drawingResume" || !comeback) return;

    startLoop();

    let drawCount = displayedNames.length;
    const drawInterval = setInterval(() => {
      if (drawCount < 6) {
        const randomName = sampleNames[Math.floor(Math.random() * sampleNames.length)];
        setSelectedNames((prev) => [...prev, randomName]);
        setDisplayedNames((prev) => [...prev, randomName]);
        drawCount++;
        playTick();
      } else if (drawCount === 6) {
        setSelectedNames((prev) => [...prev, playerName]);
        setDisplayedNames((prev) => [...prev, playerName]);
        setIsPlayerSelected(true);
        drawCount++;
        clearInterval(drawInterval);
        stopLoop();
        chimeRef.current?.play().catch(() => {});
        crowdRef.current?.play().catch(() => {});
        setTimeout(() => setStage("selected"), 1000);
      }
    }, 1500);

    return () => {
      clearInterval(drawInterval);
      stopLoop();
    };
  }, [stage, comeback, displayedNames.length, playerName]);

  // Stop loop if we switch to any non-drawing stage (extra safety)
  useEffect(() => {
    if (stage !== "drawing" && stage !== "drawingResume") stopLoop();
  }, [stage]);

  const handleAudioEnd = () => {
    if (stage === "alexAudio") {
      setStage("complete");
    } else if (stage === "suspenseAudio") {
      setStage("drawingResume");
    }
  };

  const handleContinue = () => {
    router.push(`/game/${parseInt(round) + 1}`);
  };

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
                animationDuration: `${3 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        .stars-container { position: absolute; width: 100%; height: 100%; perspective: 1000px; }
        .star { position: absolute; width: 2px; height: 2px; background: white; border-radius: 50%; animation: twinkle linear infinite; }
        .star:nth-child(4n) { background: #a855f7; box-shadow: 0 0 6px #a855f7; }
        .star:nth-child(4n+1) { background: #fbbf24; box-shadow: 0 0 6px #fbbf24; }
        .star:nth-child(4n+2) { background: #22c55e; box-shadow: 0 0 6px #22c55e; }
        @keyframes twinkle { 0%, 100% { opacity: 0; transform: scale(0.5); } 50% { opacity: 1; transform: scale(1.2); } }
        .glow-text { text-shadow: 0 0 20px currentColor; }
        .glow-border { box-shadow: 0 0 30px rgba(168, 85, 247, 0.3); }
      `}</style>

      {/* Header */}
      <div className="w-full bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-800 py-8 px-6 shadow-2xl backdrop-blur-sm border-b border-purple-400/30 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
            <div className="flex flex-col md:flex-row items-center gap-6 lg:gap-10">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center font-bold text-black text-2xl shadow-lg">G</div>
                <div className="text-3xl font-bold text-white tracking-wider">GOT GAME</div>
              </div>
              <div className="hidden md:block h-10 w-px bg-white/30"></div>
              <h1 className="text-3xl lg:text-4xl font-bold text-white flex items-center gap-3">
                <Star className="fill-yellow-400 text-yellow-400" size={36} />
                LUCKY DRAW
              </h1>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4 text-lg font-semibold">
              <div className="bg-black/40 px-5 py-3 rounded-xl backdrop-blur-sm border border-white/20">🎲 SPOTS: {remainingSpots}</div>
              <div className="bg-black/40 px-5 py-3 rounded-xl backdrop-blur-sm border border-white/20">👤 {playerName}</div>
              <div className="bg-purple-500/30 px-5 py-3 rounded-xl text-purple-200 backdrop-blur-sm border border-purple-400/40">
                {comeback ? "🔄 COMEBACK" : "🍀 ELIMINATION"}
              </div>
            </div>
          </div>
          <div className="mt-6 text-center">
            <div className="text-purple-100 text-xl font-medium">
              {stage === "drawing" || stage === "drawingResume"
                ? `🎲 Drawing ${remainingSpots} lucky ${comeback ? "comeback" : "advancement"} spots...`
                : stage === "suspenseAudio"
                ? "🎵 Alex building suspense..."
                : stage === "selected"
                ? `🎉 ${playerName} is back in the game!`
                : stage === "notSelected"
                ? `❌ ${playerName} not selected`
                : stage === "alexAudio"
                ? `🎤 Alex speaking to ${playerName}...`
                : stage === "complete"
                ? `🍀 ${playerName} in Lucky Pool`
                : comeback
                ? `🔄 Round ${round} Comeback Draw`
                : `⚡ Round ${round} Lucky Draw`}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex min-h-[calc(100vh-200px)] flex-col items-center justify-center p-8 relative z-10">
        <div className="w-full max-w-6xl flex flex-col items-center gap-10">
          <div className="relative w-full max-w-sm mb-4">
            <Image
              src="/images/logo.png"
              alt="GOT GAME Logo"
              width={500}
              height={200}
              priority
              className="w-full h-auto drop-shadow-2xl"
            />
          </div>

          <div className="text-center space-y-4 mb-6">
            <h2 className="text-5xl font-bold text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-400 bg-clip-text glow-text">
              {comeback ? "🔄 COMEBACK DRAW" : "🍀 LUCKY DRAW"}
            </h2>
            <p className="text-2xl text-purple-300 max-w-3xl mx-auto">
              {comeback
                ? `Drawing ${remainingSpots} comeback spots from the Lucky Pool - Round ${round}!`
                : `Drawing ${remainingSpots} advancement spots from the Lucky Pool!`}
            </p>
          </div>

          {/* Alex Audio Player */}
          { (stage === "alexAudio" || stage === "suspenseAudio") && (
            <div className="w-full max-w-4xl">
              <div className="bg-gradient-to-br from-purple-900/80 to-indigo-900/80 rounded-3xl border border-purple-500/50 shadow-2xl backdrop-blur-sm p-10">
                <div className="text-center space-y-8">
                  <h3 className="text-4xl font-bold text-white">🎤 ALEX SPEAKING</h3>
                  <div className="text-6xl py-4">{stage === "suspenseAudio" ? "🎵" : "🎙️"}</div>
                  <div className="text-2xl text-white px-6">
                    {stage === "suspenseAudio"
                      ? "Alex is building suspense for the Lucky Draw..."
                      : `Alex has something important to say to ${playerName}...`}
                  </div>
                  <div className="w-full h-72 rounded-2xl overflow-hidden bg-black">
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

          {/* Draw UI */}
          { !(stage === "alexAudio" || stage === "suspenseAudio") && (
            <div className="w-full max-w-5xl bg-gradient-to-br from-gray-900/80 to-black/80 rounded-3xl p-10 glow-border backdrop-blur-sm border border-purple-500/50 shadow-2xl">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-10">
                <div className="flex items-center gap-4 bg-purple-900/30 px-6 py-3 rounded-xl">
                  <Users className="h-7 w-7 text-purple-400" />
                  <span className="text-white text-xl">
                    Drawing: <span className="text-purple-400 font-bold text-2xl">{remainingSpots} spots</span>
                  </span>
                </div>
                <div className="flex items-center gap-4 bg-indigo-900/30 px-6 py-3 rounded-xl">
                  <Star className="h-7 w-7 fill-yellow-500 text-yellow-400" />
                  <span className="text-white text-xl">Round {round} Lucky Draw</span>
                </div>
              </div>

              <div className="space-y-10">
                <div className="bg-black/60 rounded-2xl p-8 min-h-[500px] flex flex-col backdrop-blur-sm border border-purple-500/30">
                  {(stage === "drawing" || stage === "drawingResume") ? (
                    <div className="flex-1 flex flex-col space-y-8">
                      <div className="text-3xl text-white text-center font-bold">🎲 Drawing lucky players...</div>

                      <div className={`grid gap-6 w-full ${comeback ? "grid-cols-1 max-w-2xl mx-auto" : "grid-cols-3 lg:grid-cols-4"}`}>
                        {displayedNames.map((name, index) => (
                          <div
                            key={index}
                            className={`p-5 rounded-xl text-center text-white font-bold text-xl transform transition-all duration-500 hover:scale-105
                              ${
                                name === playerName
                                  ? "bg-gradient-to-r from-green-600 to-emerald-600 animate-pulse shadow-lg shadow-green-500/50 ring-4 ring-green-400"
                                  : comeback
                                  ? "bg-gradient-to-r from-purple-600 to-indigo-600 shadow-lg"
                                  : "bg-gradient-to-r from-purple-900/70 to-indigo-900/70"
                              }`}
                          >
                            <div className="flex items-center justify-center gap-3">
                              <span className="text-gray-300">#{index + 1}</span>
                              <span>{name}</span>
                              {name === playerName && <Crown className="text-yellow-400" size={24} />}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="text-center mt-8 space-y-4">
                        <div className="text-purple-300 text-2xl">
                          {displayedNames.length} / {remainingSpots} drawn
                        </div>
                        {comeback && displayedNames.length < remainingSpots && (
                          <div className="flex flex-col items-center space-y-4 py-4">
                            <div className="animate-spin w-10 h-10 border-4 border-yellow-400 border-t-transparent rounded-full"></div>
                            <p className="text-yellow-300 text-xl font-medium">
                              Drawing name #{displayedNames.length + 1}...
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : stage === "selected" ? (
                    <div className="text-center flex-1 flex flex-col justify-center space-y-8 py-8">
                      <div className="text-5xl font-bold text-transparent bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text glow-text">
                        🎉 {playerName} IS BACK! 🎉
                      </div>
                      <div className="text-3xl text-white">Congratulations! You've been selected!</div>
                      <div className="text-xl text-purple-300 bg-green-900/30 p-6 rounded-2xl border border-green-500/50 max-w-2xl mx-auto">
                        🎯 You can now continue to Round {parseInt(round) + 1}!
                      </div>
                      <Button
                        onClick={handleContinue}
                        className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-10 py-6 text-2xl font-bold mx-auto rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300"
                      >
                        🚀 Continue to Round {parseInt(round) + 1}
                      </Button>
                    </div>
                  ) : stage === "notSelected" ? (
                    <div className="text-center flex-1 flex flex-col justify-center space-y-8 py-8">
                      <div className="text-5xl font-bold text-transparent bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text glow-text">
                        ❌ NOT SELECTED
                      </div>
                      <div className="text-3xl text-white">Sorry, {playerName}. Not this time.</div>
                      <div className="text-xl text-purple-300 bg-red-900/30 p-6 rounded-2xl border border-red-500/50 max-w-2xl mx-auto">
                        {remainingSpots} players advance to Round {parseInt(round) + 1}.
                      </div>
                      <Button
                        onClick={() => setStage("alexAudio")}
                        className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-10 py-6 text-2xl font-bold mx-auto rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300"
                      >
                        🎤 Hear from Alex
                      </Button>
                    </div>
                  ) : stage === "complete" ? (
                    <div className="text-center flex-1 flex flex-col justify-center space-y-8 py-8">
                      <div className="text-5xl font-bold text-transparent bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text">
                        🍀 LUCKY POOL
                      </div>
                      <div className="text-3xl text-white">Welcome, {playerName}!</div>
                      <div className="text-xl text-purple-300 bg-yellow-900/30 p-6 rounded-2xl border border-yellow-500/50 max-w-2xl mx-auto">
                        🎲 Wait for another chance in Round {parseInt(round) + 1}!
                      </div>
                      <Button
                        onClick={handleContinue}
                        className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white px-10 py-6 text-2xl font-bold mx-auto rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300"
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
  );
}

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function Lobby() {
  const [playerName, setPlayerName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const [videoStarted, setVideoStarted] = useState(false);
  const [inputEnabled, setInputEnabled] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);
  const [logoCentered, setLogoCentered] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName.trim()) {
      setError('Please enter a valid name');
      return;
    }
    setLoading(true);
    setError('');
    try {
      // Note: localStorage won't work in Claude artifacts, use state management in production
      localStorage.setItem('playerName', playerName.trim());
      await new Promise((r) => setTimeout(r, 500));
      router.push('/game/1');
    } catch (err: any) {
      setError('Failed to save player name. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Improved spacing logic to prevent overlapping
  const getContentPosition = () => {
    if (logoCentered) {
      // After video ends: push content well below the centered logo
      return 'pt-[calc(50vh+160px)] md:pt-[calc(50vh+180px)]';
    } else if (videoStarted && !videoEnded) {
      // During video: push content much further down to avoid overlap
      return 'mt-[500px] md:mt-[520px]';
    } else {
      // Initial state: reasonable spacing
      return 'mt-[420px] md:mt-[450px]';
    }
  };

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center text-white overflow-hidden">
      {/* Background */}
      <Image
        src="/images/lobby-background.jpg"
        alt="Lobby Background"
        fill
        className={`object-cover z-0 transition-all duration-500 ${
          videoStarted && !inputEnabled ? 'blur-md' : ''
        }`}
        priority
      />

      {/* Intro video */}
      {!videoEnded && (
        <div className="absolute top-48 md:top-44 z-10 w-full flex justify-center px-4">
          <video
            src="/video/alex(Welcome).mp4"
            autoPlay
            playsInline
            className="w-full max-w-xl md:max-w-2xl rounded-xl shadow-2xl"
            onPlay={() => {
              setVideoStarted(true);
              // Enable input after 15 seconds
              setTimeout(() => setInputEnabled(true), 15000);
            }}
            onEnded={() => {
              setVideoEnded(true);
              setLogoCentered(true);
            }}
          />
        </div>
      )}

      {/* GOT GAME logo with smoother animation */}
      <div
        className={`fixed left-1/2 -translate-x-1/2 z-20 transition-all duration-1000 ease-in-out will-change-transform pointer-events-none
        ${logoCentered 
          ? 'top-1/2 -translate-y-1/2 scale-110' 
          : 'top-6 md:top-8'
        }`}
      >
        <div className="relative">
          <Image
            src="/images/Gotgamelogo.png"
            alt="GG Logo"
            width={260}
            height={260}
            className="drop-shadow-2xl"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 to-blue-400/20 rounded-full blur-xl -z-10" />
        </div>
      </div>

      {/* Center Content with improved positioning */}
      <div className={`relative z-20 flex flex-col items-center justify-center w-full max-w-md px-4 ${getContentPosition()}`}>
        {/* Only show form when input is enabled or video has ended */}
        <div className={`transition-all duration-500 ${
          inputEnabled || videoEnded ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'
        }`}>
          <h1 className="text-3xl md:text-4xl font-extrabold text-center mb-6">
            <span className="flex items-center justify-center gap-2">
              <Image 
                src="/images/Chevron Down.png" 
                alt="Arrow" 
                width={16} 
                height={16} 
                className="animate-bounce"
              />
              ENTER NAME
            </span>
          </h1>

          <form onSubmit={handleSubmit} className="w-full flex flex-col items-center gap-4">
            <Input
              type="text"
              placeholder="PLAYER 1"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              maxLength={20}
              required
              disabled={!inputEnabled && !videoEnded}
              className={`rounded-[12px] py-3 px-6 text-center text-xl font-bold text-[#A757E7] bg-white/90 placeholder:text-gray-500
                shadow-[inset_4px_4px_8px_rgba(0,0,0,0.2),inset_-4px_-4px_8px_rgba(255,255,255,0.5)]
                border-[3px] border-[#d0c7ff] outline-none focus:ring-2 focus:ring-[#A757E7] 
                focus:border-[#A757E7] transition-all duration-300 hover:shadow-lg
                ${(!inputEnabled && !videoEnded) ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02]'}`}
            />

            {error && (
              <p className="text-red-400 font-semibold bg-red-900/20 px-4 py-2 rounded-lg border border-red-400/30">
                {error}
              </p>
            )}

            {playerName.trim() && (
              <Button
                type="submit"
                disabled={loading || (!inputEnabled && !videoEnded)}
                className="text-lg mt-2 font-extrabold bg-gradient-to-r from-white to-gray-100 text-purple-700 
                  py-3 px-8 rounded-full hover:scale-105 hover:shadow-xl transition-all duration-300
                  disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                  shadow-lg border-2 border-purple-200"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-purple-700 border-t-transparent rounded-full animate-spin"></div>
                    Starting Game...
                  </span>
                ) : (
                  'PLAY NOW'
                )}
              </Button>
            )}
          </form>
        </div>
      </div>

      {/* Footer Controls with improved styling */}
      <div className="absolute bottom-6 w-full px-8 flex justify-between text-xs font-bold text-white items-center z-10">
        <div className="flex gap-6 items-center">
          <button className="flex items-center gap-1 hover:text-purple-300 transition-colors duration-200 cursor-pointer">
            <Image src="/images/Chevron Down.png" alt="Arrow" width={10} height={10} />
            <span>RULES</span>
          </button>
          <button className="flex items-center gap-1 hover:text-purple-300 transition-colors duration-200 cursor-pointer">
            <Image src="/images/Chevron Down.png" alt="Arrow" width={10} height={10} />
            <span>FAQ</span>
          </button>
        </div>
        <div className="flex items-center gap-2">
          <span>BG MUSIC</span>
          <button className="text-white/80 hover:text-white transition-colors duration-200 cursor-pointer">
            ON / OFF
          </button>
        </div>
      </div>
    </main>
  );
}
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
 
 
 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName.trim()) return;
 
    setLoading(true);
    setError('');
 
    try {
      const res = await fetch('http://localhost:5000/api/names', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: playerName }),
      });
 
      const data = await res.json();
 
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save name');
      }
 
      localStorage.setItem('playerName', playerName);
      router.push('/game/1');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
 
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center text-white overflow-hidden">
      {/* Background */}
      <Image
        src="/images/lobby-background.jpg"
        alt="Lobby Background"
        fill
        className={`object-cover z-0 transition duration-500 ${videoStarted && !inputEnabled ? 'blur-md' : ''}`}
        priority
      />
   
    {!videoEnded && (
      <div className="absolute top-40 z-10 w-full flex justify-center">
        <video
          src="/video/alex(Welcome).mp4"
          autoPlay
          playsInline
          className="w-full max-w-xl rounded-xl shadow-xl"
          onPlay={() => {
            setVideoStarted(true);
            setTimeout(() => setInputEnabled(true), 15000); // enable input at 15s
          }}
          onEnded={() => setVideoEnded(true)}
        />
      </div>
    )}
 
 
 
      {/* Top Logo - Made Much Bigger */}
      <div className="absolute top-8 z-10 flex justify-center w-full">
        <div className="relative">
          <Image 
            src="/images/Gotgamelogo.png" 
            alt="GG Logo" 
            width={200} 
            height={200}
            className="drop-shadow-2xl"
          />
          {/* Optional: Add a subtle glow effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 to-blue-400/20 rounded-full blur-xl -z-10"></div>
        </div>
      </div>
 
      {/* Center Content - Adjusted positioning */}
      <div className="relative z-20 mt-[380px] flex flex-col items-center justify-center w-full max-w-md px-4">
        <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-4">
          <span className="flex items-center gap-2">
            <Image src="/images/Chevron Down.png" alt="Arrow" width={18} height={18} />
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
          disabled={!inputEnabled}
          className={`rounded-[12px] py-3 px-6 text-center text-xl font-bold text-[#A757E7] bg-white/80 placeholder:text-gray-400
            shadow-[inset_4px_4px_8px_rgba(0,0,0,0.2),inset_-4px_-4px_8px_rgba(255,255,255,0.5)]
            border-[3px] border-[#d0c7ff] outline-none focus:ring-2 focus:ring-[#A757E7] transition
            ${!inputEnabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        />
 
 
          {error && <p className="text-red-500 font-semibold">{error}</p>}
 
          {playerName.trim() && (
            <Button
              type="submit"
              disabled={loading}
              className="text-lg mt-2 font-extrabold bg-white text-purple-700 py-2 px-6 rounded-full hover:scale-105 transition"
            >
              {loading ? 'Saving...' : 'PLAY NOW'}
            </Button>
          )}
        </form>
      </div>
 
      {/* Footer Controls */}
      <div className="absolute bottom-6 w-full px-8 flex justify-between text-xs font-bold text-white items-center z-10">
        <div className="flex gap-6 items-center">
          <div className="flex items-center gap-1">
            <Image src="/images/Chevron Down.png" alt="Arrow" width={10} height={10} />
            <span>RULES</span>
          </div>
          <div className="flex items-center gap-1">
            <Image src="/images/Chevron Down.png" alt="Arrow" width={10} height={10} />
            <span>FAQ</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span>BG MUSIC</span>
          <span className="text-white/80">ON / OFF</span>
        </div>
      </div>
    </main>
  );
}
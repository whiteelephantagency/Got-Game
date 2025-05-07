'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function Lobby() {
<<<<<<< HEAD
  const [playerName, setPlayerName] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [isBlurred, setIsBlurred] = useState(true)
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!playerName.trim()) return
    localStorage.setItem('playerName', playerName)
    router.push('/game/1')
  }

  const handleHostFinished = () => {
    setShowForm(true)
    setIsBlurred(false)
  }
=======
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
>>>>>>> 7e1c7a483c4c2702be9f940b54a3818fa42896e2

  return (
    <main className="relative min-h-screen flex flex-col text-white overflow-hidden">
      {/* Background Image */}
      <Image
        src="/images/lobby-background.jpg"
        alt="Lobby Background"
        fill
<<<<<<< HEAD
        className={`object-cover z-0 transition duration-700 ${isBlurred ? 'blur-md' : ''}`}
=======
        className={`object-cover z-0 transition duration-500 ${videoStarted && !inputEnabled ? 'blur-md' : ''}`}
>>>>>>> 7e1c7a483c4c2702be9f940b54a3818fa42896e2
        priority
      />
    
    {!videoEnded && (
      <div className="absolute top-20 z-10 w-full flex justify-center">
        <video
          src="/videos/alex-intro.mp4"
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



<<<<<<< HEAD
      {/* Centered Video (Alex the Host) */}
      {!showForm && (
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <video
            src="/video/host-alex.mp4"
            autoPlay
            playsInline
            onEnded={handleHostFinished}
            className="rounded-2xl w-[90vw] max-w-[720px] shadow-2xl"
          />
        </div>
      )}

      {/* Name Input Form */}
      {showForm && (
        <section className="flex-1 flex items-center justify-center relative z-10 mt-24">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-md flex flex-col items-center gap-4 px-4 transition-opacity duration-700 opacity-100"
          >
            <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-2">
              <span className="flex items-center gap-2">
                <Image
                  src="/images/Chevron Down.png"
                  alt="Arrow"
                  width={18}
                  height={18}
                />
                ENTER NAME
              </span>
            </h1>

            <Input
              type="text"
              placeholder="PLAYER 1"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              maxLength={20}
              required
              className="rounded-[12px] py-3 px-6 text-center text-xl font-bold text-[#A757E7] bg-white/80 placeholder:text-gray-400 
                shadow-[inset_4px_4px_8px_rgba(0,0,0,0.2),inset_-4px_-4px_8px_rgba(255,255,255,0.5)] 
                border-[3px] border-[#d0c7ff] outline-none focus:ring-2 focus:ring-[#A757E7] transition"
            />

            {playerName.trim() && (
              <Button
                type="submit"
                className="text-lg mt-2 font-extrabold bg-white text-purple-700 py-2 px-6 rounded-full hover:scale-105 transition"
              >
                PLAY NOW
              </Button>
            )}
          </form>
        </section>
      )}
=======
      {/* Top Logo */}
      <div className="absolute top-10 z-10">
        <Image src="/images/gg-icon.png" alt="GG Logo" width={60} height={60} />
      </div>

      {/* Center Content */}
      <div className="relative z-20 mt-[320px] flex flex-col items-center justify-center w-full max-w-md px-4">
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
>>>>>>> 7e1c7a483c4c2702be9f940b54a3818fa42896e2

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

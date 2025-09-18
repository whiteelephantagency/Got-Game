"use client";

import { useEffect, useRef, useState } from "react";

const MESSAGES = [
  "CoolCat: What equipment is she using right now?",
  "Kappa: just a totally normal affordable everyday PC 🧠🧠🧠",
  "PogChamp: wow will this be like the 10th win of the day??",
  "GivePLZ: 🐸💻📈 ULTRA SETTINGS",
  "Player1001: OMG I got it right! 😱",
  "Player1002: Who else picked B?",
  "Player1003: That was too easy.",
  "GameMaster: Round getting intense! 🔥",
  "QuizKing: Anyone else nervous? 😅",
  "BrainBox: Let's go! Next question!",
  "WisdomSeeker: This is my favorite round!",
  "ThinkTank: Good luck everyone! 🍀",
  "MindBender: Alex is the best host!",
  "QuestionMaster: Chat going crazy! 💯",
  "GamerGirl99: So many smart people here!",
];

interface ChatBoxProps {
  className?: string;
  theme?: 'default' | 'purple' | 'blue' | 'green' | 'gold';
  showStats?: boolean;
}

export default function ChatBox({ 
  className = "",
  theme = 'default',
  showStats = true 
}: ChatBoxProps) {
  const [chat, setChat] = useState<string[]>([]);
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setChat((prev) => [...prev, MESSAGES[index % MESSAGES.length]]);
      index++;
      if (chatRef.current) {
        chatRef.current.scrollTop = chatRef.current.scrollHeight;
      }
    }, 2000 + Math.random() * 1000); // Vary timing slightly
    return () => clearInterval(interval);
  }, []);

  // Theme configurations
  const themeConfig = {
    default: {
      bg: 'bg-[#1c0f32]',
      border: 'border-purple-500',
      accent: 'text-purple-400',
      input: 'bg-[#1c0f32] border-purple-500',
      button: 'text-purple-400 hover:text-purple-300'
    },
    purple: {
      bg: 'bg-purple-900/30',
      border: 'border-purple-400',
      accent: 'text-purple-300',
      input: 'bg-purple-900/50 border-purple-400',
      button: 'text-purple-300 hover:text-white'
    },
    blue: {
      bg: 'bg-blue-900/30',
      border: 'border-blue-400',
      accent: 'text-blue-300',
      input: 'bg-blue-900/50 border-blue-400',
      button: 'text-blue-300 hover:text-white'
    },
    green: {
      bg: 'bg-green-900/30',
      border: 'border-green-400',
      accent: 'text-green-300',
      input: 'bg-green-900/50 border-green-400',
      button: 'text-green-300 hover:text-white'
    },
    gold: {
      bg: 'bg-yellow-900/30',
      border: 'border-yellow-400',
      accent: 'text-yellow-300',
      input: 'bg-yellow-900/50 border-yellow-400',
      button: 'text-yellow-300 hover:text-white'
    }
  };

  const config = themeConfig[theme];

  return (
    <div className={`flex flex-col text-sm w-full h-full text-white font-medium p-4 ${className}`}>
      {/* Chat messages with enhanced spacing */}
      <div
        ref={chatRef}
        className="flex-1 overflow-y-auto px-4 py-3 space-y-3 scrollbar-thin scrollbar-thumb-purple-500/50 scrollbar-track-transparent hover:scrollbar-thumb-purple-400/70 transition-colors rounded-lg bg-black/20"
      >
        {chat.map((msg, i) => {
          const [username, ...messageParts] = msg.split(': ');
          const message = messageParts.join(': ');
          
          return (
            <div key={i} className="leading-relaxed group hover:bg-white/5 px-3 py-2 rounded-md transition-colors duration-200">
              <span className={`font-bold ${config.accent} mr-2`}>
                {username}:
              </span>
              <span className="text-white/90 leading-relaxed">
                {message}
              </span>
            </div>
          );
        })}
      </div>

      {/* Channel Management / Input with enhanced spacing */}
      {showStats && (
        <div className="mt-6 text-xs space-y-4 px-2">
          <div className="border-t border-white/10 pt-4">
            <p className={`${config.accent} font-semibold mb-3 flex items-center`}>
              <span className="text-lg mr-3">💬</span>
              LIVE CHAT
            </p>
            <p className="text-white/80 font-medium mb-2">/gotgame</p>
            <p className="text-gray-400 mb-4 text-xs leading-relaxed px-2">
              Join the conversation with players from around the world
            </p>
          </div>
          
          <div className={`flex items-center ${config.input} rounded-lg px-4 py-3 transition-colors hover:bg-opacity-70 shadow-sm`}>
            <input
              type="text"
              placeholder="Type your message..."
              className="bg-transparent text-white text-sm flex-1 focus:outline-none placeholder-gray-400 px-2"
            />
            <button className={`ml-3 px-2 py-1 ${config.button} transition-colors text-lg hover:scale-110 transform duration-200 rounded`}>
              ➤
            </button>
          </div>
          
          <div className="flex justify-between items-center pt-3 border-t border-white/10 px-2">
            <div className="flex items-center space-x-4">
              <span className={`${config.accent} flex items-center`}>
                <span className="animate-pulse mr-2">🔴</span>
                {Math.floor(Math.random() * 50 + 150)}K
              </span>
              <span className="text-white/60 text-xs">viewers</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-white font-bold text-sm">Got Game</span>
              <span className="text-xs bg-red-500 text-white px-3 py-1 rounded-full animate-pulse shadow-sm">
                LIVE
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
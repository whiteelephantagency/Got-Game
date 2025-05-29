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
];

export default function ChatBox() {
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
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col text-sm w-full h-full text-white font-medium">
      {/* Chat messages */}
      <div
        ref={chatRef}
        className="flex-1 overflow-y-auto pr-2 space-y-1 scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-transparent"
      >
        {chat.map((msg, i) => (
          <div key={i} className="whitespace-pre-line leading-snug">
            {msg}
          </div>
        ))}
      </div>

      {/* Channel Management / Input */}
      <div className="mt-4 text-xs">
        <p className="text-purple-300 font-semibold mb-1">CHANNEL MANAGEMENT</p>
        <p className="text-white font-medium">/sharedchat</p>
        <p className="text-gray-400 mb-2">
          Start a new Shared Chat or join one in your existing collaboration
        </p>
        <div className="flex items-center bg-[#1c0f32] border border-purple-500 rounded px-2 py-1">
          <input
            type="text"
            placeholder="/sharedchat"
            className="bg-transparent text-white text-sm flex-1 focus:outline-none"
          />
          <button className="ml-2 text-purple-400 hover:text-white transition">
            ➤
          </button>
        </div>
        <div className="flex justify-between mt-2 text-purple-300">
          <span>🧿 177K</span>
          <span className="text-white font-bold">Chat</span>
        </div>
      </div>
    </div>
  );
}

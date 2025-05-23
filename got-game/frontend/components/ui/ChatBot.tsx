"use client"

import { useEffect, useRef, useState } from "react"

const SAMPLE_COMMENTS = [
  "Let's go! 🔥",
  "OMG I got it right! 😍",
  "Trick question 😭",
  "I'm ready for round 2 💪",
  "NOOO I tapped the wrong one 😭",
  "Who else picked B?",
  "That was too easy."
]

export default function HQChatBot() {
  const [messages, setMessages] = useState<string[]>([])
  const chatRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const interval = setInterval(() => {
      setMessages((prev) => {
        const next = [...prev, SAMPLE_COMMENTS[Math.floor(Math.random() * SAMPLE_COMMENTS.length)]]
        return next.slice(-20) // limit to last 20 messages
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight
    }
  }, [messages])

  return (
    <div className="h-64 w-full bg-black/60 text-white p-2 rounded-lg shadow-inner overflow-y-auto text-sm" ref={chatRef}>
      {messages.map((msg, idx) => (
        <div key={idx} className="mb-1 animate-fadeIn">
          <span className="text-purple-300">Player{1000 + idx}:</span> {msg}
        </div>
      ))}
    </div>
  )
}

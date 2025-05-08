// components/ui/ChatBot.tsx
"use client"

import { useState } from "react"
import { MessageSquare } from "lucide-react"

export default function ChatBot() {
  const [messages, setMessages] = useState<string[]>([])
  const [input, setInput] = useState("")
  const [isOpen, setIsOpen] = useState(false)

  const handleSend = () => {
    if (input.trim()) {
      setMessages((prev) => [...prev, input])
      setInput("")
    }
  }

  const toggleChat = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div className="fixed bottom-6 right-6 z-20">
      {/* Chat Icon */}
      {!isOpen && (
        <button
          onClick={toggleChat}
          className="bg-purple-600 p-4 rounded-full shadow-lg text-white hover:bg-purple-700 transition-all"
        >
          <MessageSquare className="w-6 h-6" />
        </button>
      )}

      {/* Chat Box */}
      {isOpen && (
        <div className="bg-purple-900 p-4 rounded-lg shadow-lg w-64">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-white text-lg font-bold">ChatBot</h3>
            <button onClick={toggleChat} className="text-white font-bold text-lg">
              ✕
            </button>
          </div>

          <div className="overflow-y-auto max-h-40 bg-gray-800 p-2 rounded-lg mb-2">
            {messages.map((msg, idx) => (
              <div key={idx} className="text-white text-sm mb-1">
                {msg}
              </div>
            ))}
          </div>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="w-full p-2 rounded-lg bg-gray-700 text-white mb-2"
          />
          <button
            onClick={handleSend}
            className="w-full bg-purple-600 p-2 rounded-lg text-white font-bold"
          >
            Send
          </button>
        </div>
      )}
    </div>
  )
}

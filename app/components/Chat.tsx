"use client";

import { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";

interface Message {
  _id: string;
  senderId: string;
  chatRoomId: string;
  message: string;
  createdAt: string;
}

interface ChatProps {
  chatRoomId: string;
  currentUserId: string;
  userType: "user" | "hospital";
}

export default function Chat({ chatRoomId, currentUserId, userType }: ChatProps) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom when messages update
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const backendUrl = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000";
    const newSocket = io(backendUrl);
    setSocket(newSocket);

    newSocket.on("connect", () => {
      // Join the chat room once connected
      newSocket.emit(
        "joinRoom",
        { chatRoomId, userId: currentUserId, userType },
        (res: any) => {
          if (res?.error) {
            setError(res.error);
          } else if (res?.success) {
            setMessages(res.messages || []);
          }
        }
      );
    });

    newSocket.on("receiveMessage", (message: Message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [chatRoomId, currentUserId, userType]);

  const handleSendMessage = () => {
    if (!inputValue.trim() || !socket) return;
    
    socket.emit(
      "sendMessage",
      {
        chatRoomId,
        senderId: currentUserId,
        message: inputValue
      },
      (res: any) => {
        if (res?.error) {
          setError(res.error);
        } else if (res?.success && res.message) {
          setMessages((prev) => [...prev, res.message]);
        }
      }
    );
    
    setInputValue("");
  };

  if (error) {
    return (
      <div className="p-4 border border-red-500 rounded bg-red-50 text-red-700">
        <h3 className="font-bold">Error joining chat</h3>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[500px] max-w-2xl mx-auto border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 font-semibold shrink-0">
        Chat Room
      </div>
      
      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50 flex flex-col space-y-3">
        {messages.length === 0 ? (
          <div className="text-gray-400 text-center text-sm my-auto">
            No messages yet. Be the first to say hi!
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.senderId === currentUserId;
            return (
              <div
                key={msg._id}
                className={`flex flex-col max-w-[80%] ${
                  isMe ? "self-end items-end" : "self-start items-start"
                }`}
              >
                <div
                  className={`px-4 py-2 rounded-2xl ${
                    isMe
                      ? "bg-blue-600 text-white rounded-br-none"
                      : "bg-gray-200 text-gray-800 rounded-bl-none"
                  }`}
                >
                  {msg.message}
                </div>
                <span className="text-xs text-gray-400 mt-1">
                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-100 bg-white flex space-x-2 shrink-0">
        <input
          type="text"
          className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
          placeholder="Type your message..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
        />
        <button
          onClick={handleSendMessage}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6 py-2 font-medium transition-colors cursor-pointer"
        >
          Send
        </button>
      </div>
    </div>
  );
}

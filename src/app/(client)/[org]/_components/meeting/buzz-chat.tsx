"use client";

import React, { useState, useRef, useEffect, useContext } from "react";
import { X, SendHorizontal, MessageSquareOff } from "lucide-react";
import { cn } from "~/lib/utils";
import { DataContext } from "~/store/GlobalState";
import { PostRequest } from "~/utils/new-request";
import { useParams } from "next/navigation";

interface ChatSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChatSidebar = ({ isOpen, onClose }: ChatSidebarProps) => {
  const { state, dispatch } = useContext(DataContext);
  const { user, buzzChats } = state;
  const [inputValue, setInputValue] = useState("");
  const [isSending, setIsSending] = useState(false);

  const { id } = useParams();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [buzzChats]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputValue.trim() || isSending) return;

    const newMessage = {
      content: inputValue.trim(),
    };

    setIsSending(true);
    try {
      const res = await PostRequest(`/buzz/${id}/message`, newMessage);

      // PostRequest returns the error instead of throwing, so only clear the
      // input once the message was actually sent; on failure keep the text.
      if (res?.status === 200 || res?.status === 201) {
        setInputValue("");
      }
    } finally {
      setIsSending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="h-full bg-[#1e1e1e] border border-zinc-700 rounded-xl flex flex-col overflow-hidden ml-4">
      <div className="flex items-center justify-between px-6 py-4">
        <h2 className="text-white text-[18px] font-normal tracking-tight">
          In-call messages
        </h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-zinc-800 rounded-full transition-colors text-zinc-400"
        >
          <X size={20} />
        </button>
      </div>

      <div className="px-4 mb-2">
        <div className="bg-[#202124] border border-zinc-800 rounded-lg p-3 text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <MessageSquareOff size={14} className="text-blue-400" />
            <span className="text-[11px] text-zinc-400 font-medium">
              Continuous chat is OFF
            </span>
          </div>
          <p className="text-[11px] text-zinc-500 leading-relaxed">
            Messages won't be saved when the call ends.
          </p>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-4 custom-scrollbar flex flex-col-reverse gap-4"
      >
        {buzzChats?.length === 0 ? (
          <p className="text-zinc-400 text-sm text-center">
            No chat messages yet
          </p>
        ) : (
          [...buzzChats].reverse().map((msg: any) => {
            const isLocal = msg.user_id === user?.user_id;
            return (
              <div
                key={msg.created_at}
                className={cn(
                  "flex flex-col",
                  isLocal ? "items-end" : "items-start"
                )}
              >
                {!isLocal && (
                  <span className="text-[10px] text-zinc-500 mb-1 ml-1">
                    {msg.full_name}
                  </span>
                )}
                <div
                  className={cn(
                    "text-white px-4 py-2.5 rounded-2xl max-w-[85%]",
                    isLocal
                      ? "bg-[#004a77] rounded-tr-none"
                      : "bg-zinc-800 rounded-tl-none"
                  )}
                >
                  <p className="text-sm leading-snug">{msg.message}</p>
                </div>
                <span className="text-[10px] text-zinc-500 mt-1 px-1">
                  {new Date(msg.created_at).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            );
          })
        )}
      </div>

      <div className="px-4 py-4 mt-auto">
        <form
          onSubmit={handleSendMessage}
          className="relative group bg-[#202124] border border-zinc-700/50 rounded-full flex items-center px-4 py-1"
        >
          <input
            type="text"
            placeholder="Send a message"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full bg-transparent border-none py-2.5 text-zinc-200 text-sm focus:outline-none placeholder:text-zinc-500"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isSending}
            className={cn(
              "p-2 rounded-full transition-colors",
              inputValue.trim() && !isSending
                ? "text-blue-400 hover:bg-zinc-800"
                : "text-zinc-600"
            )}
          >
            <SendHorizontal size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatSidebar;

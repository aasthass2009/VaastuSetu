"use client";

import { useState, useRef, useEffect, useCallback } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  loading?: boolean;
};

// ── Constants ─────────────────────────────────────────────────────────────────

const WELCOME_MESSAGE: Message = {
  id: "welcome",
  role: "assistant",
  content:
    "Namaste! I'm Vastu Guru — your AI guide to Vastu Shastra. Ask me about directions, room placement, or remedies for your home.",
};

// ── Typing dots ───────────────────────────────────────────────────────────────

function TypingDots() {
  return (
    <span className="flex items-center gap-0.5 py-0.5">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-current opacity-60 animate-bounce"
          style={{ animationDelay: `${i * 100}ms`, animationDuration: "600ms" }}
        />
      ))}
    </span>
  );
}

// ── Message bubble ────────────────────────────────────────────────────────────

function Bubble({ msg }: { msg: Message }) {
  const isUser = msg.role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed whitespace-pre-wrap ${
          isUser
            ? "bg-[#C05A12] text-white rounded-br-sm"
            : "bg-white text-[#241B3A] border border-[#E8DFC8] rounded-bl-sm"
        }`}
      >
        {msg.loading && !msg.content ? <TypingDots /> : msg.content}
      </div>
    </div>
  );
}

// ── Main widget ───────────────────────────────────────────────────────────────

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);

  const sessionIdRef = useRef("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialise session ID once on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    let sid = sessionStorage.getItem("vs_chat_sid");
    if (!sid) {
      sid = `chat_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      sessionStorage.setItem("vs_chat_sid", sid);
    }
    sessionIdRef.current = sid;
  }, []);

  // Auto-scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when panel opens
  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || busy) return;

    const userMsgId = `u_${Date.now()}`;
    const asstMsgId = `a_${Date.now()}`;

    setMessages((prev) => [
      ...prev,
      { id: userMsgId, role: "user", content: text },
      { id: asstMsgId, role: "assistant", content: "", loading: true },
    ]);
    setInput("");
    setBusy(true);

    try {
      const history = messages
        .filter((m) => m.id !== "welcome")
        .slice(-10)
        .map((m) => ({ role: m.role, content: m.content }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          sessionId: sessionIdRef.current,
          history,
        }),
      });

      if (res.status === 503) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === asstMsgId
              ? {
                  ...m,
                  content:
                    "Our AI Vaastu Guide is coming soon — check back shortly! In the meantime, try the Vastu Score tool or explore the Room Guides.",
                  loading: false,
                }
              : m
          )
        );
        return;
      }

      if (!res.ok || !res.body) {
        throw new Error(`HTTP ${res.status}`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        setMessages((prev) =>
          prev.map((m) =>
            m.id === asstMsgId
              ? { ...m, content: accumulated, loading: false }
              : m
          )
        );
      }
    } catch {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === asstMsgId
            ? {
                ...m,
                content:
                  "Sorry, I couldn't connect right now. Please try again in a moment.",
                loading: false,
              }
            : m
        )
      );
    } finally {
      setBusy(false);
    }
  }, [input, busy, messages]);

  const handleKey = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        send();
      }
    },
    [send]
  );

  return (
    <div className="fixed bottom-4 right-3 z-50 flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      {/* ── Chat panel ─────────────────────────────────────────────────────── */}
      {open && (
        <div
          className="flex flex-col w-[min(360px,calc(100vw-1.5rem))] h-[min(520px,calc(100dvh-120px))] rounded-2xl shadow-2xl overflow-hidden border border-[#E8DFC8]"
          style={{ background: "#FBF5EA" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-[#241B3A] shrink-0">
            <div>
              <p className="text-[#FBF5EA] font-semibold text-[13px] leading-tight">
                Vastu Guru
              </p>
              <p className="text-[#B8860B] text-[11px] tracking-wide">
                VaastuSetu · AI-powered
              </p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="w-7 h-7 flex items-center justify-center text-[#FBF5EA]/60 hover:text-[#FBF5EA] rounded-full hover:bg-white/10 transition-colors"
              aria-label="Close chat"
            >
              <svg
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-4 h-4"
              >
                <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2.5 scroll-smooth">
            {messages.map((msg) => (
              <Bubble key={msg.id} msg={msg} />
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Input row */}
          <div className="px-3 py-2.5 bg-white border-t border-[#E8DFC8] flex items-center gap-2 shrink-0">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask about Vastu..."
              disabled={busy}
              className="flex-1 text-sm px-3 py-2 rounded-full bg-[#FBF5EA] border border-[#E8DFC8] text-[#241B3A] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#C05A12]/30 disabled:opacity-60"
            />
            <button
              onClick={send}
              disabled={busy || !input.trim()}
              aria-label="Send"
              className="w-9 h-9 rounded-full bg-[#C05A12] text-white flex items-center justify-center shrink-0 hover:bg-[#A04A0A] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path d="M3.105 2.289a.75.75 0 00-.826.95l1.414 4.925A1.5 1.5 0 005.135 9.25h6.115a.75.75 0 010 1.5H5.135a1.5 1.5 0 00-1.442 1.086l-1.414 4.926a.75.75 0 00.826.95 28.896 28.896 0 0015.293-7.154.75.75 0 000-1.115A28.897 28.897 0 003.105 2.289z" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* ── Floating trigger button ─────────────────────────────────────────── */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close Vastu Guru" : "Open Vastu Guru chat"}
        className="w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-105 active:scale-95"
        style={{ background: "#C05A12" }}
      >
        {open ? (
          <svg
            viewBox="0 0 24 24"
            fill="white"
            className="w-6 h-6"
          >
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
          </svg>
        ) : (
          <svg
            viewBox="0 0 24 24"
            fill="white"
            className="w-6 h-6"
          >
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12zM7 9h2v2H7zm4 0h2v2h-2zm4 0h2v2h-2z" />
          </svg>
        )}
      </button>
    </div>
  );
}

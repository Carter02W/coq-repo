"use client";

import { useState } from "react";

const Icon = ({ label }: { label: string }) => (
  <span className="select-none text-xs font-semibold tracking-wide uppercase opacity-80">
    {label}
  </span>
);

function HeaderNav() {
  return (
    <header className="pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center px-4 ">
      <div className="pointer-events-auto w-full max-w-6xl rounded-full border border-black/5 bg-white/70 shadow-xl shadow-black/5 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:border-white/10 dark:bg-neutral-900/60 dark:shadow-black/20">
        <nav className="flex items-center gap-2 px-3 py-2 sm:gap-3 sm:px-4 sm:py-3">

          { /* Logo */ }
          <div className="mr-2 flex items-center gap-2 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 px-3 py-1.5 text-white sm:mr-3 sm:px-4">
            <span className="text-xs font-semibold sm:text-sm">COQ</span>
          </div>

          {/* Buttons, left -> right */}
          <button className="rounded-full px-3 py-1.5 text-sm hover:bg-black/5 dark:hover:bg-white/10">
          <Icon label="Analysis" />
          </button>
          <button className="rounded-full px-3 py-1.5 text-sm hover:bg-black/5 dark:hover:bg-white/10">
          <Icon label="Flashcards" />
          </button>
          <button className="rounded-full px-3 py-1.5 text-sm hover:bg-black/5 dark:hover:bg-white/10">
          <Icon label="Notes" />
          </button>
          <button className="rounded-full px-3 py-1.5 text-sm hover:bg-black/5 dark:hover:bg-white/10">
          <Icon label="Q&A" />
          </button>


          {/* Spacer */}
          <div className="mx-2 hidden h-5 w-px bg-black/10 dark:bg-white/15 sm:block" />
          <div className="flex-1" />


          {/* User button */}
          <button className="group mr-1 flex items-center gap-2 rounded-full px-2 py-1.5 pr-2.5 hover:bg-black/5 dark:hover:bg-white/10">
            <div className="grid h-8 w-8 place-items-center overflow-hidden rounded-full bg-gradient-to-br from-amber-400 to-pink-500 text-xs font-bold text-white shadow">
            U
            </div>
            <span className="hidden text-sm opacity-80 sm:block">Log in</span>
          </button>
        </nav>
      </div>
    </header>
  );
}

function ChatBubble({ role, children }: { role: "user" | "assistant"; children: React.ReactNode }) {
  const isUser = role === "user";
  return (
    <div className={`flex w-full ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 text-[15px] leading-relaxed shadow-sm sm:max-w-[70%] ${
          isUser
            ? "bg-indigo-600 text-white"
            : "bg-white/80 ring-1 ring-black/5 dark:bg-neutral-900/70 dark:ring-white/10"
        }`}
      >
        {children}
      </div>
    </div>
  );
}

function BottomBar({ onSend }: { onSend: (text: string) => void }) {
  const [value, setValue] = useState("");
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 flex justify-center px-4 pb-4 pt-2">
      <div className="w-full max-w-3xl rounded-full border border-black/5 bg-white/80 shadow-2xl backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:border-white/10 dark:bg-neutral-900/60">
        <div className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5">
          <input
            placeholder="Send a message…"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="flex-1 bg-transparent px-1 text-[15px] outline-none placeholder:text-black/40 dark:placeholder:text-white/40"
          />
          <button
            onClick={() => {
              if (!value.trim()) return;
              onSend(value.trim());
              setValue("");
            }}
            className="rounded-full px-3 py-1.5 text-sm font-medium hover:bg-black/5 active:scale-[0.98] dark:hover:bg-white/10"
            aria-label="Send"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default function HomeMock() {
  const [messages, setMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([
    // { role: "assistant", content: "Hi Carter! I’m your study buddy. Ask me anything about your course or notes." },
    // { role: "user", content: "Summarize Chapter 3 for me." },
    // { role: "assistant", content: "Here’s a concise overview of Chapter 3… (placeholder text)." },
  ]);

  return (
    <div className="relative min-h-dvh bg-[radial-gradient(ellipse_at_top,rgba(120,119,198,0.08),transparent_45%),radial-gradient(ellipse_at_bottom,rgba(30,30,30,0.06),transparent_55%)] text-neutral-900 antialiased dark:text-neutral-100">
      <HeaderNav />


      {/* Page content spacing so header & bottombar don’t overlap */}
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-4 pb-32 pt-28 sm:gap-6 sm:pb-36">
        {/* Title / empty state */}
        {messages.length === 0 ? (
        <div className="grid place-items-center py-28 text-center">
          <h1 className="mb-2 text-2xl font-semibold sm:text-3xl">What are we studying today?</h1>
          <p className="max-w-xl text-balance text-sm opacity-70">
          Type a prompt below, or pick a tool from the header (Analysis, Flashcards, Notes, Q&A).
          </p>
        </div>
        ) : (
        <div className="flex flex-col gap-3">
          {messages.map((m, i) => (
          <ChatBubble key={i} role={m.role}>
          {m.content}
          </ChatBubble>
          ))}
        </div>
        )}
      </div>


      <BottomBar
        onSend={(text) =>
          setMessages((prev) => [...prev, { role: "user", content: text }, { role: "assistant", content: "(mock) This is where a response would appear." }])
        }
      />
    </div>
  );
}
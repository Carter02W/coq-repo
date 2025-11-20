"use client";

import { useState, useEffect } from "react";


type SideNavProps = {
  open: boolean;
  onClose: () => void;
  onSelectSession: (id: string) => void;
};

type ChatList = {
  _id: string;
  session_id: string;
  title: string;
};

function SideNav({open, onClose, onSelectSession}: SideNavProps) {
  const [chatList, setChatList] = useState<ChatList[]>([]);
  const [selectId, setSelectedId] = useState<string | null>(null);


   // populating list of chats everytime the sideNav renders
  useEffect(() => {

    // listChats() fetches and creates an array(ChatList) of all current saved sessions 
    const listChats = async () => {
      const res = await fetch("http://127.0.0.1:8080/listChats");

      const data = await res.json();
      setChatList(data);
      console.log("listChats() data = ", data)
    }

      listChats();
  }, []);

  // createChat() triggered when new chat button is clicked, fetches and creates an array(ChatList) of all current saved sessions after a new session has been created. ps should there be a main list of sessions in test-api and these functions just updated it? 
  const createChat = async () => {
    const createChatFunc = await fetch("http://127.0.0.1:8080/createChat", {
      method: "GET"
    });

    const data = await createChatFunc.json();
    console.log(data)
    setChatList(data);
    console.log("chat created, current chatList = " + data)

    if (data.length > 0) {  // calling handleChatClicked on new chats so that they are selected on creation and give home mock the current session_id
      const newChat = data[0];
      if (newChat.title === "New chat") {
        const sessionId = newChat.session_id;
        handleChatClicked(sessionId);
      }
    }

  }

  function handleChatClicked(id: string) {
    setSelectedId(id);
    onSelectSession(id);
        // this could call a function to update messages screen
    console.log("you clicked on a new chat " + id)
  }

  return (
    <>
      <aside
        id="app-sidenav"
        className={[
          "fixed inset-y-0 left-0 z-50 w-64 pointer-events-auto",
          "transition-transform duration-300 will-change-transform",
          open ? "translate-x-0" : "-translate-x-full",
          "lg:translate-x-0",
        ].join(" ")}
        //aria-hidden={!open}
      >
        <div className="flex h-dvh gap-2 border-r border-r-black/10 bg-neutral-50/30 dark:border-r-white/10 dark:bg-black/30 backdrop-blur shadow-xl">
          <nav className="flex h-full flex-col items-stretch w-full gap-1 p-3 sm:p-4">
            {/* Brand + close */}
            <div className="mb-1 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 px-3 py-2 text-white shadow">
                <span className="text-sm font-semibold tracking-wide">COQ</span>
              </div>
              <button
                onClick={onClose}
                className="rounded-md px-2 py-1 text-xs hover:bg-black/5 dark:hover:bg-white/10 lg:hidden"
                aria-label="Close sidebar"
              >
                Close
              </button>
            </div>

            {/* Primary Nav */}
            {["FLASHCARDS", "NOTES", "Q&A", "ANALYSIS"].map((label) => (
              <button
                key={label}
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-left hover:bg-black/5 dark:hover:bg-white/10"
              >
                {label}
              </button>
            ))}

            <div className="my-2 h-px bg-black/35 dark:bg-white/15" />

            {/* Chats */}
            <button 
              onClick={createChat} 
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-left hover:bg-black/5 dark:hover:bg-white/10"
            >
              NEW CHAT
            </button>

            <section className="flex-1 overflow-y-auto rounded-md scrollbar-hide">
              <ul className="space-y-1 pr-1">
                {chatList.map(chat => (
                  <li key={chat.session_id}>
                    <button 
                      onClick={() => {handleChatClicked(chat.session_id)}} 
                      className={[
                        "w-full truncate rounded-md px-3 py-2 text-left text-sm",
                        selectId === chat.session_id
                          ? "bg-black/10"
                          : "hover:bg-black/5"
                      ].join(" ")}
                    >
                      {chat.title}
                    </button>
                  </li>
                ))}
              </ul>
            </section>

            <div className="my-2 h-px bg-black/35 dark:bg-white/15" />

            {/* Login pill */}
            <div className="mb-1 flex items-center gap-2 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 px-3 py-2 text-white shadow">
              <span className="text-sm font-semibold tracking-wide">CW</span>
            </div>
          </nav>
        </div>
      </aside>

      {/* Drawer backdrop (only below lg) */}
      {/* Clicking it closes the drawer */}
      <button
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/40 lg:hidden ${open ? "block" : "hidden"}`}
        aria-label="Close sidebar backdrop"
      />
    </>
  );
}


type ChatBubbleProps = {
  role: "user" | "assistant";
  children: React.ReactNode;
};

function ChatBubble({ role, children }: ChatBubbleProps) {
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

type BottomBarProps = {
  onSend: (userInput: string) => void | Promise<void>;
  className?: string;
};

function BottomBar({ onSend, className = "" }: BottomBarProps) {
  const [value, setValue] = useState("");

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const v = value.trim();
    if (!v) return;
    void onSend(v);
    setValue("");
  };

  return (
    <div className={`fixed bottom-0 z-40 flex justify-center px-4 pb-4 pt-2 ${className}`}>
      <div className="w-full max-w-3xl rounded-full border border-black/5 bg-white/80 shadow-2xl backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:border-white/10 dark:bg-neutral-900/60">
        <form onSubmit={handleSubmit} className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5">
          <input
            placeholder="Send a message…"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="flex-1 bg-transparent px-1 text-[15px] outline-none placeholder:text-black/40 dark:placeholder:text-white/40"
          />
          <button
            type="submit"              // <— important
            className="rounded-full px-3 py-1.5 text-sm font-medium hover:bg-black/5 active:scale-[0.98] dark:hover:bg-white/10"
            aria-label="Send"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export default function HomeMock() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currSessionId, setCurrSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  //this will create a message list based off of the current session (ex. call on a function in test-api to pass a list of messages associated with currSessionId)
  useEffect(() => {
    if (!currSessionId) return;

    const findMessages = async () => {
      const res = await fetch("http://127.0.0.1:8080/listMessages", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          sessionId: currSessionId
        }),
      });

      const data = (await res.json()) as ChatMessage[];
      console.log("findMessages: ", data);

      setMessages(
        data.map((obj) => ({
          role: obj.role,
          content: obj.content,
        }))
      );
    }

    findMessages();
  }, [currSessionId]);
  
  useEffect(() => {
    console.log("homeMock messages changed: ", messages);
  }, [messages]);

  const handleSend = async(userInput: string) => {

    // 1) show the user's message immediately
    setMessages(prev => [...prev, { role: "user", content: userInput}]);
    console.log("handleSend current messages = ", messages)

    try {
      // 2) call python backend
      const res = await fetch("http://127.0.0.1:8080/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ 
          message: userInput,
          sessionId: currSessionId
        }),
      });

      if (!res.ok) throw new Error('HTTP ${res.status}'); 
      const data = await res.json();
      console.log(data);
      // 3) append assistant response
      setMessages(prev => [...prev, { role: "assistant", content: data.reply}]);
      
    
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setMessages(prev => [...prev, {role: "assistant", content: `Sorry, request failed: ${msg}`}]);
    }
  };


  console.log("current homeMoke sessionId = " + currSessionId);
  console.log("this is the current message list: " + JSON.stringify(messages))


    return (
  <div className="relative min-h-dvh bg-[radial-gradient(ellipse_at_top,rgba(120,119,198,0.08),transparent_45%),radial-gradient(ellipse_at_bottom,rgba(30,30,30,0.06),transparent_55%)] text-neutral-900 antialiased dark:text-neutral-100">
      {/* sidebar toggle */}
      <button onClick={() => setSidebarOpen(true)}
        className="fixed left-3 top-3 z-[60] rounded-lg px-3 py-2 text-sm shadow ring-1 ring-black/10 backdrop-blur bg-white/70 dark:bg-neutral-900/70 dark:ring-white/10 lg:hidden"
        aria-label="Open sidebar"
        aria-expanded={sidebarOpen}
        aria-controls="app-sidenav"
        >
        |||
      </button>

    <SideNav open={sidebarOpen} onClose={() => setSidebarOpen(false)} onSelectSession={setCurrSessionId}/>

    {/* Main content (kept centered) */}
    <div className="lg:pl-64">
      <div className="mx-auto w-full max-w-3xl flex flex-col gap-4 px-4 pb-32 pt-28 sm:gap-6 sm:pb-36">
        {messages.length === 0 ? (
          <div className="grid place-items-center py-28 text-center">
            <h1 className="mb-2 text-2xl font-semibold sm:text-3xl">What are we studying today?</h1>
            <p className="max-w-xl text-balance text-sm opacity-70">
              Type a prompt below, or pick a tool from the header (Analysis, Flashcards, Notes, Q&amp;A).
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

      {/* <ConversationNav />  ✅ add this outside main content */}
      <BottomBar onSend={handleSend} className="left-0 right-0 lg:left-64"/>
    </div>
  </div>
);
}
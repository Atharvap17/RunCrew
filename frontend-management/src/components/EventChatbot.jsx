import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import {
  HiPaperAirplane,
  HiX,
  HiTrash,
  HiRefresh,
  HiCalendar,
  HiTag,
  HiLocationMarker,
  HiMap,
  HiExternalLink,
} from "react-icons/hi";
import { FaRunning } from "react-icons/fa";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

const WELCOME_MESSAGE = {
  role: "assistant",
  content:
    "Ready for your next race? 🏃\n\nI'm your RunCrew assistant. Ask me about upcoming marathons, registration fees, race dates, locations, and routes.",
};

const SUGGESTION_CARDS = [
  {
    id: "events",
    title: "Upcoming Events",
    description: "Find your next race",
    icon: HiCalendar,
    message: "Which upcoming marathon events are available?",
  },
  {
    id: "fees",
    title: "Registration Fees",
    description: "Compare event prices",
    icon: HiTag,
    message: "What are the marathon registration fees?",
  },
  {
    id: "locations",
    title: "Race Locations",
    description: "Explore where events happen",
    icon: HiLocationMarker,
    message: "Tell me about marathon locations and event venues.",
  },
  {
    id: "routes",
    title: "Routes & Distances",
    description: "Learn about race routes",
    icon: HiMap,
    message: "Which marathons have route maps and distance details?",
  },
];

const MarkdownComponents = {
  p: ({ children }) => (
    <p className="mb-2.5 last:mb-0 leading-[1.65] text-[#F8FAFC]">{children}</p>
  ),
  h1: ({ children }) => (
    <h1 className="text-base font-bold text-[#F8FAFC] mt-3 mb-2 border-b border-[#262C34] pb-1 flex items-center gap-2">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-sm font-bold text-[#FF6B2C] mt-3 mb-1.5 flex items-center gap-1.5">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-xs font-bold text-amber-300 uppercase tracking-wider mt-2.5 mb-1">
      {children}
    </h3>
  ),
  ul: ({ children }) => (
    <ul className="my-2 space-y-1.5 pl-4 list-disc marker:text-[#FF6B2C] text-[#F8FAFC]">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="my-2 space-y-1.5 pl-4 list-decimal marker:text-[#FF6B2C] text-[#F8FAFC]">
      {children}
    </ol>
  ),
  li: ({ children }) => (
    <li className="pl-0.5 leading-relaxed text-[13.5px] text-[#F8FAFC]">{children}</li>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold text-white bg-white/10 px-1.5 py-0.5 rounded text-amber-200">
      {children}
    </strong>
  ),
  em: ({ children }) => (
    <em className="italic text-[#A1AAB5]">{children}</em>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-[#FF6B2C] hover:underline font-medium transition-colors inline-flex items-center gap-1"
    >
      {children} <HiExternalLink className="inline h-3 w-3" />
    </a>
  ),
  code: ({ children }) => (
    <code className="rounded-md border border-[#262C34] bg-black/50 px-1.5 py-0.5 text-xs text-amber-300 font-mono">
      {children}
    </code>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-l-2 border-[#FF6B2C] pl-3 py-1 my-2.5 bg-white/[0.03] text-[#A1AAB5] italic text-[13px] rounded-r-md">
      {children}
    </blockquote>
  ),
  table: ({ children }) => (
    <div className="overflow-x-auto my-3 rounded-xl border border-[#262C34] bg-[#14171B]">
      <table className="w-full text-left text-xs border-collapse">{children}</table>
    </div>
  ),
  th: ({ children }) => (
    <th className="bg-[#1C2127] p-2 font-semibold text-[#F8FAFC] border-b border-[#262C34] text-xs">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="p-2 border-b border-[#262C34]/50 text-[#A1AAB5] text-xs">{children}</td>
  ),
  hr: () => <hr className="my-3 border-[#262C34]" />,
};

export default function EventChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [lastFailedQuestion, setLastFailedQuestion] = useState(null);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading, isOpen]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  async function sendMessage(text = input) {
    const question = text.trim();

    if (!question || isLoading) return;

    setMessages((previous) => [
      ...previous,
      { role: "user", content: question },
    ]);
    setInput("");
    setIsLoading(true);
    setLastFailedQuestion(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/events/chatbot/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: question }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Unable to get a response. Please try again."
        );
      }

      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          content: data.answer || "I couldn't generate an answer right now.",
        },
      ]);
    } catch (error) {
      setLastFailedQuestion(question);
      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          content:
            error.message === "Failed to fetch"
              ? "Could not connect to the RunCrew server. Please check your network or try again."
              : error.message,
          isError: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleSubmit(event) {
    event?.preventDefault();
    sendMessage();
  }

  function clearChat() {
    setMessages([WELCOME_MESSAGE]);
    setLastFailedQuestion(null);
  }

  return (
    <div className="fixed bottom-4 right-4 z-[9999] font-sans sm:bottom-6 sm:right-6">
      {/* Professional Chat Window Container */}
      {isOpen && (
        <section
          style={{ boxSizing: "border-box" }}
          className="mb-3 flex h-[min(620px,calc(100dvh-100px))] w-[min(410px,calc(100vw-32px))] flex-col overflow-hidden rounded-2xl border border-[#262C34] bg-[#0B0D10] text-[#F8FAFC] shadow-[0_20px_70px_rgba(0,0,0,0.85)] animate-in fade-in slide-in-from-bottom-3 duration-200"
          aria-label="RunCrew AI Assistant"
        >
          {/* Header */}
          <div className="flex shrink-0 items-center justify-between border-b border-[#262C34] bg-[#1C2127] px-4 py-3.5 sm:px-5">
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#FF6B2C] to-[#E55A1F] text-white shadow-md shadow-[#FF6B2C]/20">
                <FaRunning className="h-4 w-4" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-bold tracking-tight text-[#F8FAFC] truncate">
                    RunCrew AI
                  </h2>
                  <span className="flex h-2 w-2 shrink-0 rounded-full bg-[#10B981]" title="Online" />
                </div>
                <p className="text-[11px] text-[#A1AAB5] truncate">
                  Your Marathon Assistant
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0 ml-2">
              {messages.length > 1 && (
                <button
                  type="button"
                  onClick={clearChat}
                  title="Clear conversation"
                  aria-label="Clear conversation"
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-[#A1AAB5] transition hover:bg-[#14171B] hover:text-[#EF4444]"
                >
                  <HiTrash className="h-4 w-4" />
                </button>
              )}

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close chat window"
                title="Close chat"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-[#A1AAB5] transition hover:bg-[#14171B] hover:text-[#F8FAFC]"
              >
                <HiX className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Conversation Stream Area */}
          <div className="flex-1 space-y-4 overflow-y-auto bg-[#14171B] px-4 py-4 sm:px-5 [scrollbar-color:#262C34_transparent] [scrollbar-width:thin]">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex items-start gap-2.5 ${
                  message.role === "user" ? "justify-end" : "justify-start"
                } animate-in fade-in duration-200`}
              >
                {message.role === "assistant" && (
                  <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-[#262C34] bg-[#1C2127] text-[#FF6B2C] shadow-sm">
                    <FaRunning className="h-3.5 w-3.5" />
                  </div>
                )}

                {message.role === "user" ? (
                  <div className="max-w-[85%] min-w-0 rounded-2xl rounded-br-xs bg-[#FF6B2C] px-4 py-2.5 text-[13.5px] font-medium text-white shadow-md shadow-[#FF6B2C]/10 whitespace-pre-wrap break-words leading-relaxed">
                    {message.content}
                  </div>
                ) : (
                  <div
                    className={`max-w-[88%] min-w-0 rounded-2xl rounded-bl-xs border ${
                      message.isError
                        ? "border-[#EF4444]/30 bg-[#EF4444]/10 text-[#FCA5A5]"
                        : "border-[#262C34] bg-[#1C2127] text-[#F8FAFC]"
                    } px-4 py-3 text-[13.5px] whitespace-pre-wrap break-words leading-relaxed shadow-sm`}
                  >
                    <ReactMarkdown components={MarkdownComponents}>
                      {message.content}
                    </ReactMarkdown>

                    {message.isError && lastFailedQuestion && (
                      <button
                        type="button"
                        onClick={() => sendMessage(lastFailedQuestion)}
                        className="mt-2.5 inline-flex items-center gap-1.5 rounded-lg border border-[#EF4444]/40 bg-[#EF4444]/20 px-2.5 py-1 text-xs font-semibold text-[#FCA5A5] transition hover:bg-[#EF4444]/30"
                      >
                        <HiRefresh className="h-3.5 w-3.5" /> Retry
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}

            {/* Typing Loading State */}
            {isLoading && (
              <div className="flex items-center gap-2.5 animate-in fade-in duration-200">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-[#262C34] bg-[#1C2127] text-[#FF6B2C] shadow-sm">
                  <FaRunning className="h-3.5 w-3.5 animate-pulse" />
                </div>

                <div className="flex items-center gap-3 rounded-2xl rounded-bl-xs border border-[#262C34] bg-[#1C2127] px-4 py-2.5 shadow-sm">
                  <span className="text-xs text-[#A1AAB5] font-medium">Finding event details…</span>
                  <div className="flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#FF6B2C] animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="h-1.5 w-1.5 rounded-full bg-[#FF6B2C] animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="h-1.5 w-1.5 rounded-full bg-[#FF6B2C] animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}

            {/* Empty State Suggestion Cards */}
            {messages.length === 1 && !isLoading && (
              <div className="pt-2 animate-in fade-in duration-300">
                <p className="mb-2.5 text-[10px] font-bold uppercase tracking-widest text-[#A1AAB5]">
                  EXPLORE RUNCREW
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {SUGGESTION_CARDS.map((card) => {
                    const IconComponent = card.icon;
                    return (
                      <button
                        type="button"
                        key={card.id}
                        onClick={() => sendMessage(card.message)}
                        className="group flex flex-col justify-between rounded-xl border border-[#262C34] bg-[#1C2127] p-3 text-left transition-all duration-200 hover:border-[#FF6B2C]/50 hover:bg-[#1C2127]/90 hover:shadow-md"
                      >
                        <div className="flex items-center gap-2 mb-1.5">
                          <IconComponent className="h-4 w-4 text-[#FF6B2C] shrink-0" />
                          <span className="text-xs font-bold text-[#F8FAFC] group-hover:text-white truncate">
                            {card.title}
                          </span>
                        </div>
                        <span className="text-[11px] text-[#A1AAB5] leading-snug">
                          {card.description}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Unified Input Composer */}
          <div className="shrink-0 border-t border-[#262C34] bg-[#0B0D10] px-4 py-3 sm:px-5">
            <form
              onSubmit={handleSubmit}
              className="flex items-center gap-2 rounded-xl border border-[#262C34] bg-[#14171B] px-3 py-1.5 transition-all duration-200 focus-within:border-[#FF6B2C] focus-within:ring-2 focus-within:ring-[#FF6B2C]/20"
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about a marathon…"
                maxLength={1000}
                disabled={isLoading}
                aria-label="Ask a question about marathons"
                className="w-full min-w-0 bg-transparent py-2 text-[13.5px] text-[#F8FAFC] outline-none placeholder:text-[#A1AAB5]/60 disabled:opacity-50"
              />

              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                aria-label="Send message"
                title="Send message"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#FF6B2C] to-[#E55A1F] text-white shadow-sm transition-all duration-200 hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:scale-100"
              >
                <HiPaperAirplane className="h-4 w-4 rotate-90" />
              </button>
            </form>
          </div>
        </section>
      )}

      {/* Floating Chat Launcher Button */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setIsOpen((previous) => !previous)}
          aria-label={isOpen ? "Close RunCrew chat" : "Open RunCrew assistant chat"}
          title="Chat with RunCrew Assistant"
          className={`group relative flex h-[58px] w-[58px] items-center justify-center rounded-2xl bg-gradient-to-br from-[#FF6B2C] to-[#E55A1F] text-white shadow-[0_8px_30px_rgba(255,107,44,0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_36px_rgba(255,107,44,0.5)] focus:outline-none focus:ring-4 focus:ring-[#FF6B2C]/30 ${
            isOpen ? "rounded-full" : ""
          }`}
        >
          {isOpen ? (
            <HiX className="h-6 w-6 text-white transition-transform group-hover:scale-110" />
          ) : (
            <div className="relative flex items-center justify-center">
              <FaRunning className="h-6 w-6 text-white transition-transform group-hover:scale-110" />
              <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full border-2 border-[#0B0D10] bg-[#10B981]" />
            </div>
          )}
        </button>
      </div>
    </div>
  );
}

"use client";

import { useState, useRef, useEffect } from "react";
import { PageShell, SectionHeader, FadeIn } from "@/src/components/dashboard/PageShell";
import { Send, Sparkles } from "lucide-react";

type Message = {
  id: string;
  role: "assistant" | "user";
  content: string;
  time: string;
};

const recommendations = [
  {
    id: "rec-1",
    text: "Mathematics needs attention",
    detail:
      "Based on your recent activity, you&apos;ve spent 40% less time on math this week. Consider scheduling a 2-hour focused session.",
  },
  {
    id: "rec-2",
    text: "Best focus time: 9:00 AM – 11:00 AM",
    detail:
      "Your productivity data shows peak performance during morning hours. Plan your hardest tasks in this window.",
  },
  {
    id: "rec-3",
    text: "Take more breaks",
    detail:
      "You had 3 study sessions longer than 90 minutes without a break. Try the Pomodoro technique to maintain focus.",
  },
  {
    id: "rec-4",
    text: "Weekly goal: 12 study hours",
    detail:
      "You&apos;re at 7.5 hours this week. A short daily push of ~1 hour will help you hit your target by Sunday.",
  },
];

const initialMessages: Message[] = [
  {
    id: "m-1",
    role: "assistant",
    content:
      "Hi! I&apos;m your AI Study Assistant. I analyzed your recent activity and have a few recommendations to help you stay on track.",
    time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  },
  ...recommendations.map((rec) => ({
    id: rec.id,
    role: "assistant" as const,
    content: `${rec.text}\n\n${rec.detail}`,
    time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  })),
];

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: `u-${Date.now()}`,
      role: "user",
      content: input.trim(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setSending(true);

    await new Promise((resolve) => setTimeout(resolve, 600));

    const responses = [
      "Great question! Based on your schedule, I'd recommend splitting that topic into 25-minute chunks.",
      "I've noticed you study best in the morning. Try moving that task to 9 AM for better retention.",
      "You're making solid progress. Keep your current pace and you'll hit your weekly goal by Thursday.",
      "Consider reviewing the key concepts from last week's session before starting new material.",
    ];

    const assistantMessage: Message = {
      id: `a-${Date.now()}`,
      role: "assistant",
      content: responses[Math.floor(Math.random() * responses.length)],
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, assistantMessage]);
    setSending(false);
  };

  return (
    <PageShell>
      <FadeIn>
        <SectionHeader label="Intelligence" title="AI Study Assistant" />
      </FadeIn>

      <FadeIn delay={0.05}>
        <div className="glass-card card-shadow flex h-[600px] flex-col rounded-3xl border border-slate-800/70">
          <div className="flex-1 space-y-4 overflow-y-auto p-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                 <div
                   className={`max-w-[80%] rounded-2xl px-4 py-3 text-base leading-relaxed ${
                     message.role === "user"
                       ? "gradient-primary text-white shadow-lg shadow-indigo-900/40"
                       : "border border-slate-800/70 bg-slate-900/40 text-slate-200"
                   }`}
                 >
                  <p className="whitespace-pre-line">{message.content}</p>
                  <span
                    className={`mt-2 block text-xs ${
                      message.role === "user" ? "text-indigo-200" : "text-slate-500"
                    }`}
                  >
                    {message.time}
                  </span>
                </div>
              </div>
            ))}
            {sending && (
              <div className="flex justify-start">
                 <div className="rounded-2xl border border-slate-800/70 bg-slate-900/40 px-4 py-3 text-base text-slate-400">
                   Thinking...
                 </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <form
            onSubmit={handleSend}
            className="flex items-center gap-3 border-t border-slate-800/70 p-4"
          >
            <Sparkles className="h-5 w-5 flex-shrink-0 text-indigo-400" />
             <input
               value={input}
               onChange={(e) => setInput(e.target.value)}
               placeholder="Ask for study tips, schedule advice, or motivation..."
               className="flex-1 rounded-xl border border-slate-700 bg-slate-900/50 px-4 py-2.5 text-base text-slate-100 outline-none focus:border-indigo-500"
             />
            <button
              type="submit"
              disabled={!input.trim() || sending}
              className="flex-shrink-0 rounded-xl gradient-primary p-2.5 text-white shadow-lg shadow-indigo-900/40 transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </FadeIn>
    </PageShell>
  );
}

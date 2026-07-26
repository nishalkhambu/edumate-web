"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Plus, CheckSquare, FileText, BookOpen, Play } from "lucide-react";

const actions = [
  { icon: <CheckSquare className="h-5 w-5" />, label: "Add Task", color: "from-indigo-500 to-violet-500" },
  { icon: <BookOpen className="h-5 w-5" />, label: "Add Exam", color: "from-rose-500 to-pink-500" },
  { icon: <FileText className="h-5 w-5" />, label: "Add Note", color: "from-emerald-500 to-teal-500" },
  { icon: <Play className="h-5 w-5" />, label: "Start Session", color: "from-amber-500 to-orange-500" },
];

export function QuickActions() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
      <AnimatePresence>
        {open &&
          actions.map((a, i) => (
            <motion.button
              key={a.label}
              initial={{ opacity: 0, y: 12, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.8 }}
              transition={{ duration: 0.18, delay: i * 0.04 }}
              className="flex items-center gap-2 rounded-full border border-slate-700 bg-[#1e293b] py-2 pl-3 pr-4 text-sm font-medium text-slate-100 shadow-xl shadow-black/40 hover:bg-[#243349]"
            >
              <span className={`flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br ${a.color} text-white`}>
                {a.icon}
              </span>
              {a.label}
            </motion.button>
          ))}
      </AnimatePresence>

      <motion.button
        whileTap={{ scale: 0.92 }}
        onClick={() => setOpen((v) => !v)}
        className="gradient-primary flex h-14 w-14 items-center justify-center rounded-full text-white shadow-2xl shadow-indigo-900/50"
      >
        <motion.span animate={{ rotate: open ? 45 : 0 }} transition={{ duration: 0.2 }}>
          <Plus className="h-6 w-6" />
        </motion.span>
      </motion.button>
    </div>
  );
}

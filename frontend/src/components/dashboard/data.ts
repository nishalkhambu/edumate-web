// Static demo data for the dashboard widgets.
// Replace with real API responses when study-planner endpoints are available.

export const weeklyAnalytics = [
  { day: "Mon", hours: 3.2, productivity: 72 },
  { day: "Tue", hours: 4.1, productivity: 80 },
  { day: "Wed", hours: 2.6, productivity: 64 },
  { day: "Thu", hours: 5.0, productivity: 88 },
  { day: "Fri", hours: 4.4, productivity: 83 },
  { day: "Sat", hours: 6.2, productivity: 92 },
  { day: "Sun", hours: 3.8, productivity: 76 },
];

export const schedule = [
  { time: "09:00", subject: "Data Structures", topic: "Graph Traversal (BFS/DFS)", status: "done" },
  { time: "11:00", subject: "Linear Algebra", topic: "Eigenvalues & Eigenvectors", status: "live" },
  { time: "14:00", subject: "Computer Networks", topic: "TCP Congestion Control", status: "upcoming" },
  { time: "16:00", subject: "Operating Systems", topic: "Process Scheduling", status: "upcoming" },
];

export const exams = [
  { id: 1, subject: "Data Structures", date: "Jul 22", days: 4, prep: 68 },
  { id: 2, subject: "Linear Algebra", date: "Jul 25", days: 7, prep: 82 },
  { id: 3, subject: "Computer Networks", date: "Jul 29", days: 11, prep: 45 },
];

export const tasks = [
  { id: 1, title: "Complete Java Assignment", due: "Today, 5:00 PM", done: false },
  { id: 2, title: "Review Linear Algebra Notes", due: "Today, 8:00 PM", done: false },
  { id: 3, title: "Submit DBMS Project Report", due: "Tomorrow, 12:00 PM", done: false },
  { id: 4, title: "Prepare OS Lab Experiment", due: "Jul 20", done: true },
];

export const goals = { daily: 78, weekly: 64 };

export const achievements = {
  xp: 2840,
  level: 12,
  badges: [
    { label: "Streak Master", icon: "🔥" },
    { label: "Early Bird", icon: "🌅" },
    { label: "Quiz Ace", icon: "🎯" },
  ],
};

export const notes = [
  { id: 1, title: "OS Process Scheduling", tag: "Operating Systems" },
  { id: 2, title: "Graph Algorithms", tag: "Data Structures" },
  { id: 3, title: "Eigen Values", tag: "Linear Algebra" },
];

export const insights = [
  { icon: "💡", title: "Best focus time", text: "You concentrate best between 8AM – 11AM.", color: "from-amber-500/20 to-orange-500/10 border-amber-500/30" },
  { icon: "🔥", title: "Streak", text: "You've maintained a 12-day study streak!", color: "from-rose-500/20 to-pink-500/10 border-rose-500/30" },
  { icon: "📈", title: "Improvement", text: "Mathematics improved by 18% this week.", color: "from-emerald-500/20 to-teal-500/10 border-emerald-500/30" },
  { icon: "✅", title: "Completion", text: "87% of your weekly tasks are complete.", color: "from-indigo-500/20 to-violet-500/10 border-indigo-500/30" },
];

// Agenda: mixed classes, tasks and exams for the timeline
export const agenda = [
  { id: 1, time: "08:00", type: "task", title: "Revise React Hooks", meta: "Personal goal", accent: "#8b5cf6" },
  { id: 2, time: "09:00", type: "class", title: "Data Structures", meta: "Graph Traversal (BFS/DFS) · Prof. Anderson", accent: "#6366f1" },
  { id: 3, time: "11:00", type: "class", title: "Linear Algebra", meta: "Eigenvalues & Eigenvectors · Dr. Martinez", accent: "#10b981" },
  { id: 4, time: "13:00", type: "task", title: "Submit DBMS Project Report", meta: "Due tomorrow · High priority", accent: "#f59e0b" },
  { id: 5, time: "14:00", type: "class", title: "Computer Networks", meta: "TCP Congestion Control · Prof. Kim", accent: "#ef4444" },
  { id: 6, time: "16:30", type: "exam", title: "OS Mock Test", meta: "Revision session · Lab 3", accent: "#f59e0b" },
  { id: 7, time: "18:00", type: "focus", title: "Deep Work Block", meta: "Silent study · 90 min", accent: "#6366f1" },
];

// Focus & productivity circular indicators
export const focusMetrics = [
  { label: "Study Hours", value: 34.3, suffix: "h", pct: 86, accent: "#6366f1" },
  { label: "Focus Time", value: 21, suffix: "h", pct: 70, accent: "#8b5cf6" },
  { label: "Consistency", value: 92, suffix: "%", pct: 92, accent: "#10b981" },
  { label: "Productivity", value: 84, suffix: "%", pct: 84, accent: "#f59e0b" },
];

// Subject performance for analytics
export const subjectPerformance = [
  { subject: "Mathematics", score: 88, trend: 18, color: "#6366f1" },
  { subject: "Physics", score: 81, trend: 12, color: "#8b5cf6" },
  { subject: "Data Structures", score: 74, trend: -3, color: "#10b981" },
  { subject: "Networks", score: 68, trend: 5, color: "#f59e0b" },
  { subject: "Operating Systems", score: 79, trend: 9, color: "#ef4444" },
];

export const todayFocus = "Complete React Revision";
export const streak = 12;
export const weeklyGoal = 64; // %
export const dailyGoal = 78; // %

export const notesDetailed = [
  { id: 1, title: "OS Process Scheduling", tag: "Operating Systems", edited: "2h ago", favorite: true },
  { id: 2, title: "Graph Algorithms", tag: "Data Structures", edited: "Yesterday", favorite: false },
  { id: 3, title: "Eigen Values", tag: "Linear Algebra", edited: "2d ago", favorite: true },
  { id: 4, title: "TCP Congestion Control", tag: "Computer Networks", edited: "3d ago", favorite: false },
  { id: 5, title: "React Hooks Cheatsheet", tag: "Web Dev", edited: "4d ago", favorite: false },
  { id: 6, title: "Probability Distributions", tag: "Mathematics", edited: "5d ago", favorite: true },
];

export type TimetableEntry = {
  day: number; // 0 Sun .. 6 Sat
  start: string;
  end: string;
  subject: string;
  type: "class" | "lab" | "study";
  color: string;
};

export const timetable: TimetableEntry[] = [
  { day: 1, start: "09:00", end: "10:30", subject: "Data Structures", type: "class", color: "#6366f1" },
  { day: 1, start: "11:00", end: "12:30", subject: "Linear Algebra", type: "class", color: "#10b981" },
  { day: 1, start: "14:00", end: "16:00", subject: "Computer Networks Lab", type: "lab", color: "#ef4444" },
  { day: 2, start: "09:00", end: "10:30", subject: "Operating Systems", type: "class", color: "#f59e0b" },
  { day: 2, start: "13:00", end: "15:00", subject: "Self Study", type: "study", color: "#8b5cf6" },
  { day: 3, start: "10:00", end: "11:30", subject: "Linear Algebra", type: "class", color: "#10b981" },
  { day: 3, start: "15:00", end: "17:00", subject: "DBMS Lab", type: "lab", color: "#ef4444" },
  { day: 4, start: "09:00", end: "10:30", subject: "Data Structures", type: "class", color: "#6366f1" },
  { day: 4, start: "11:00", end: "12:30", subject: "Operating Systems", type: "class", color: "#f59e0b" },
  { day: 5, start: "10:00", end: "12:00", subject: "Computer Networks", type: "class", color: "#ef4444" },
  { day: 5, start: "14:00", end: "16:00", subject: "Self Study", type: "study", color: "#8b5cf6" },
];

export type TaskItem = {
  id: string;
  title: string;
  course: string;
  priority: "high" | "medium" | "low";
  due: string;
};

export const taskBoard: Record<"todo" | "doing" | "done", TaskItem[]> = {
  todo: [
    { id: "t1", title: "Complete Java Assignment", course: "Web Dev", priority: "high", due: "Today" },
    { id: "t2", title: "Read OS paper on scheduling", course: "Operating Systems", priority: "medium", due: "Tomorrow" },
    { id: "t3", title: "Revise Graph algorithms", course: "Data Structures", priority: "low", due: "Jul 21" },
  ],
  doing: [
    { id: "d1", title: "DBMS Project Report", course: "Databases", priority: "high", due: "Tomorrow" },
    { id: "d2", title: "Linear Algebra exercises", course: "Mathematics", priority: "medium", due: "Jul 20" },
  ],
  done: [
    { id: "c1", title: "Submit lab attendance", course: "Networks", priority: "low", due: "Done" },
    { id: "c2", title: "Watch React tutorial", course: "Web Dev", priority: "medium", due: "Done" },
  ],
};

export const examDetail = [
  { id: 1, subject: "Data Structures", date: "Jul 22", days: 4, prep: 68, priority: "High", syllabus: 18, completed: 12 },
  { id: 2, subject: "Linear Algebra", date: "Jul 25", days: 7, prep: 82, priority: "Medium", syllabus: 15, completed: 13 },
  { id: 3, subject: "Computer Networks", date: "Jul 29", days: 11, prep: 45, priority: "Low", syllabus: 20, completed: 9 },
];

// 18 weeks x 7 days study heatmap (0..4 intensity)
export const studyHeatmap = Array.from({ length: 18 }, () =>
  Array.from({ length: 7 }, () => Math.floor(Math.random() * 5))
);

export const monthlyPerformance = [
  { month: "Jan", hours: 92 },
  { month: "Feb", hours: 104 },
  { month: "Mar", hours: 88 },
  { month: "Apr", hours: 120 },
  { month: "May", hours: 134 },
  { month: "Jun", hours: 118 },
  { month: "Jul", hours: 142 },
];

export const subjectBreakdown = [
  { subject: "Mathematics", hours: 38, color: "#6366f1" },
  { subject: "Data Structures", hours: 31, color: "#10b981" },
  { subject: "Operating Systems", hours: 27, color: "#f59e0b" },
  { subject: "Networks", hours: 22, color: "#ef4444" },
  { subject: "Web Dev", hours: 24, color: "#8b5cf6" },
];

export const sidebarNav = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Timetable", href: "/dashboard/timetable" },
  { name: "Tasks", href: "/dashboard/tasks" },
  { name: "Notes", href: "/dashboard/notes" },
  { name: "Progress", href: "/dashboard/progress" },
  { name: "Exam Planner", href: "/dashboard/exam-planner" },
];

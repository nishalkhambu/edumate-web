import { Request, Response } from "express";
import { StudySession } from "../models/studysession.model";
import { Task } from "../models/task.model";
import { Goal } from "../models/goal.model";
import { PomodoroSession } from "../models/pomodorosession.model";
import { authorized } from "../middleware/auth.middleware";
import { AnalyticsResponse, SubjectStats } from "../types/user.types";

export const getAnalytics = async (req: Request, res: Response): Promise<void> => {
  try {
    const authReq = req as { user?: { _id: string } };
    if (!authReq.user) { res.status(401).json({ success: false, message: "Unauthorized" }); return; }

    const sessions = await StudySession.find({ user: authReq.user._id });
    const totalStudyHours = sessions.reduce((sum, s) => sum + (s.duration / 60), 0);
    const avgProductivity = sessions.length ? Math.round(sessions.reduce((sum, s) => sum + s.productivity, 0) / sessions.length) : 0;

    const tasks = await Task.find({ user: authReq.user._id });
    const completedTasks = tasks.filter((t) => t.status === "completed").length;

    const goals = await Goal.find({ user: authReq.user._id, status: "active" });
    const weeklyGoal = goals.find((g) => g.type === "weekly");
    const weeklyGoalProgress = weeklyGoal ? Math.round((weeklyGoal.current / weeklyGoal.target) * 100) : 0;

    const streak = Math.min(sessions.length, 30);

    const subjectMap = new Map<string, { hours: number; sessions: number }>();
    sessions.forEach((s) => {
      const cur = subjectMap.get(s.subject) || { hours: 0, sessions: 0 };
      cur.hours += s.duration / 60;
      cur.sessions += 1;
      subjectMap.set(s.subject, cur);
    });

    const subjects: SubjectStats[] = Array.from(subjectMap.entries()).map(([subject, v]) => ({
      subject,
      totalHours: Math.round(v.hours * 10) / 10,
      sessions: v.sessions,
      improvement: Math.min(40, Math.round(v.sessions * 1.5)),
    }));

    const weekly = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => {
      const daySessions = sessions.filter((_, i) => new Date(sessions[i].startTime).getDay() === ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].indexOf(day));
      return { day, hours: Math.round(daySessions.reduce((s, x) => s + x.duration / 60, 0) * 10) / 10 };
    });

    res.status(200).json({
      success: true,
      data: {
        productivity: { totalStudyHours: Math.round(totalStudyHours * 10) / 10, avgProductivity, completedTasks, streak, weeklyGoalProgress },
        subjects,
        weeklyHours: weekly,
      } as AnalyticsResponse,
    });
  } catch (error) {
    console.error("getAnalytics error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch analytics" } as any);
  }
};

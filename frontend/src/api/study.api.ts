import { authFetch } from "@/src/api/auth.api";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "/api/v1";

async function handleResponse<T>(response: Response): Promise<T> {
  const data = await response.json();

  if (!response.ok) {
    const error = data as { message: string };
    throw new Error(error.message || "Request failed");
  }

  return data as T;
}

async function handleWrappedResponse<T>(response: Response): Promise<T> {
  const data = await response.json();

  if (!response.ok) {
    const error = data as { message: string };
    throw new Error(error.message || "Request failed");
  }

  const wrapped = data as { success: boolean; data: T };
  return wrapped.data;
}

export interface StudyPlan {
  id: string;
  title: string;
  subject: string;
  topic: string;
  deadline: string;
  progress: number;
  createdAt: string;
  updatedAt: string;
}

export interface StudyPlanPayload {
  title: string;
  subject: string;
  topic: string;
  deadline: string;
  progress?: number;
}

export interface TaskItem {
  id: string;
  title: string;
  description?: string;
  subject?: string;
  dueDate?: string;
  priority: "low" | "medium" | "high";
  status: "pending" | "in_progress" | "completed";
  createdAt: string;
}

export interface TaskPayload {
  title: string;
  description?: string;
  subject?: string;
  dueDate?: string;
  priority?: "low" | "medium" | "high";
  status?: "pending" | "in_progress" | "completed";
}

export interface SubjectItem {
  id: string;
  name: string;
  code?: string;
  instructor?: string;
  color?: string;
  createdAt: string;
}

export interface SubjectPayload {
  name: string;
  code?: string;
  instructor?: string;
  color?: string;
}

export interface Goal {
  id: string;
  title: string;
  description?: string;
  target: number;
  unit: string;
  type: "daily" | "weekly" | "monthly" | "custom";
  current: number;
  status: "active" | "completed" | "paused";
  deadline?: string;
  createdAt: string;
}

export interface GoalPayload {
  title: string;
  description?: string;
  target: number;
  current?: number;
  unit: string;
  type: "daily" | "weekly" | "monthly" | "custom";
  deadline?: string;
}

export interface StudySession {
  id: string;
  subject?: string;
  topic?: string;
  durationMinutes: number;
  startedAt: string;
  endedAt?: string;
  notes?: string;
}

export interface StudySessionPayload {
  subject?: string;
  topic?: string;
  durationMinutes: number;
  startedAt: string;
  endedAt?: string;
  notes?: string;
}

export interface PomodoroSession {
  id: string;
  mode: "focus" | "short_break" | "long_break";
  durationMinutes: number;
  completedAt: string;
}

export interface PomodoroPayload {
  mode: "focus" | "short_break" | "long_break";
  durationMinutes: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  read: boolean;
  createdAt: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon?: string;
  unlockedAt?: string;
}

export interface AnalyticsOverview {
  studyHours: number;
  tasksCompleted: number;
  goalsAchieved: number;
  streak: number;
}

export interface NoteItem {
  id: string;
  title: string;
  content: string;
  tag: string;
  favorite: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NotePayload {
  title: string;
  content?: string;
  tag?: string;
  favorite?: boolean;
}

export interface TimetableEntryItem {
  id: string;
  subject: string;
  day: number;
  start: string;
  end: string;
  type: string;
  color: string;
  createdAt: string;
  updatedAt: string;
}

export interface TimetableEntryPayload {
  subject: string;
  day: number;
  start: string;
  end: string;
  type?: string;
  color?: string;
}

export interface ExamPlanItem {
  id: string;
  subject: string;
  date: string;
  days: number;
  prep: number;
  priority: string;
  syllabus: number;
  completed: number;
  createdAt: string;
  updatedAt: string;
}

export interface ExamPlanPayload {
  subject: string;
  date: string;
  days: number;
  prep?: number;
  priority?: string;
  syllabus?: number;
  completed?: number;
}

export async function listStudyPlansApi(): Promise<StudyPlan[]> {
  const response = await authFetch(`${API_BASE_URL}/study-plans`, {
    method: "GET",
  });

  return handleWrappedResponse<StudyPlan[]>(response);
}

export async function createStudyPlanApi(
  payload: StudyPlanPayload
): Promise<StudyPlan> {
  const response = await authFetch(`${API_BASE_URL}/study-plans`, {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return handleWrappedResponse<StudyPlan>(response);
}

export async function updateStudyPlanApi(
  id: string,
  payload: Partial<StudyPlanPayload>
): Promise<StudyPlan> {
  const response = await authFetch(`${API_BASE_URL}/study-plans/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });

  return handleWrappedResponse<StudyPlan>(response);
}

export async function deleteStudyPlanApi(
  id: string
): Promise<{ success: true }> {
  const response = await authFetch(`${API_BASE_URL}/study-plans/${id}`, {
    method: "DELETE",
  });

  return handleWrappedResponse<{ success: true }>(response);
}

export async function listTasksApi(): Promise<TaskItem[]> {
  const response = await authFetch(`${API_BASE_URL}/tasks`, {
    method: "GET",
  });

  return handleWrappedResponse<TaskItem[]>(response);
}

export async function createTaskApi(payload: TaskPayload): Promise<TaskItem> {
  const response = await authFetch(`${API_BASE_URL}/tasks`, {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return handleWrappedResponse<TaskItem>(response);
}

export async function updateTaskApi(
  id: string,
  payload: TaskPayload
): Promise<TaskItem> {
  const response = await authFetch(`${API_BASE_URL}/tasks/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });

  return handleWrappedResponse<TaskItem>(response);
}

export async function deleteTaskApi(id: string): Promise<{ success: true }> {
  const response = await authFetch(`${API_BASE_URL}/tasks/${id}`, {
    method: "DELETE",
  });

  return handleWrappedResponse<{ success: true }>(response);
}

export async function listSubjectsApi(): Promise<SubjectItem[]> {
  const response = await authFetch(`${API_BASE_URL}/subjects`, {
    method: "GET",
  });

  return handleWrappedResponse<SubjectItem[]>(response);
}

export async function createSubjectApi(payload: SubjectPayload): Promise<SubjectItem> {
  const response = await authFetch(`${API_BASE_URL}/subjects`, {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return handleWrappedResponse<SubjectItem>(response);
}

export async function listGoalsApi(): Promise<Goal[]> {
  const response = await authFetch(`${API_BASE_URL}/goals`, {
    method: "GET",
  });

  return handleWrappedResponse<Goal[]>(response);
}

export async function createGoalApi(payload: GoalPayload): Promise<Goal> {
  const response = await authFetch(`${API_BASE_URL}/goals`, {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return handleWrappedResponse<Goal>(response);
}

export async function updateGoalApi(
  id: string,
  payload: Partial<GoalPayload>
): Promise<Goal> {
  const response = await authFetch(`${API_BASE_URL}/goals/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });

  return handleWrappedResponse<Goal>(response);
}

export async function listStudySessionsApi(): Promise<StudySession[]> {
  const response = await authFetch(`${API_BASE_URL}/study-sessions`, {
    method: "GET",
  });

  return handleWrappedResponse<StudySession[]>(response);
}

export async function createStudySessionApi(
  payload: StudySessionPayload
): Promise<StudySession> {
  const response = await authFetch(`${API_BASE_URL}/study-sessions`, {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return handleWrappedResponse<StudySession>(response);
}

export async function createPomodoroApi(
  payload: PomodoroPayload
): Promise<PomodoroSession> {
  const response = await authFetch(`${API_BASE_URL}/pomodoro`, {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return handleWrappedResponse<PomodoroSession>(response);
}

export async function listNotificationsApi(): Promise<Notification[]> {
  const response = await authFetch(`${API_BASE_URL}/notifications`, {
    method: "GET",
  });

  return handleWrappedResponse<Notification[]>(response);
}

export async function markNotificationReadApi(
  id: string
): Promise<Notification> {
  const response = await authFetch(`${API_BASE_URL}/notifications/${id}/read`, {
    method: "POST",
  });

  return handleWrappedResponse<Notification>(response);
}

export async function markAllNotificationsReadApi(): Promise<{ success: true }> {
  const response = await authFetch(`${API_BASE_URL}/notifications/read-all`, {
    method: "POST",
  });

  return handleWrappedResponse<{ success: true }>(response);
}

export async function listAchievementsApi(): Promise<Achievement[]> {
  const response = await authFetch(`${API_BASE_URL}/achievements`, {
    method: "GET",
  });

  return handleWrappedResponse<Achievement[]>(response);
}

export async function getAnalyticsOverviewApi(): Promise<AnalyticsOverview> {
  const response = await authFetch(`${API_BASE_URL}/analytics/overview`, {
    method: "GET",
  });

  return handleWrappedResponse<AnalyticsOverview>(response);
}

export async function listNotesApi(): Promise<NoteItem[]> {
  const response = await authFetch(`${API_BASE_URL}/notes`, {
    method: "GET",
  });

  return handleWrappedResponse<NoteItem[]>(response);
}

export async function createNoteApi(payload: NotePayload): Promise<NoteItem> {
  const response = await authFetch(`${API_BASE_URL}/notes`, {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return handleWrappedResponse<NoteItem>(response);
}

export async function updateNoteApi(id: string, payload: NotePayload): Promise<NoteItem> {
  const response = await authFetch(`${API_BASE_URL}/notes/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });

  return handleWrappedResponse<NoteItem>(response);
}

export async function deleteNoteApi(id: string): Promise<{ success: true }> {
  const response = await authFetch(`${API_BASE_URL}/notes/${id}`, {
    method: "DELETE",
  });

  return handleWrappedResponse<{ success: true }>(response);
}

export async function listTimetableEntriesApi(): Promise<TimetableEntryItem[]> {
  const response = await authFetch(`${API_BASE_URL}/timetable`, {
    method: "GET",
  });

  return handleWrappedResponse<TimetableEntryItem[]>(response);
}

export async function createTimetableEntryApi(payload: TimetableEntryPayload): Promise<TimetableEntryItem> {
  const response = await authFetch(`${API_BASE_URL}/timetable`, {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return handleWrappedResponse<TimetableEntryItem>(response);
}

export async function updateTimetableEntryApi(id: string, payload: TimetableEntryPayload): Promise<TimetableEntryItem> {
  const response = await authFetch(`${API_BASE_URL}/timetable/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });

  return handleWrappedResponse<TimetableEntryItem>(response);
}

export async function deleteTimetableEntryApi(id: string): Promise<{ success: true }> {
  const response = await authFetch(`${API_BASE_URL}/timetable/${id}`, {
    method: "DELETE",
  });

  return handleWrappedResponse<{ success: true }>(response);
}

export async function listExamPlansApi(): Promise<ExamPlanItem[]> {
  const response = await authFetch(`${API_BASE_URL}/exams`, {
    method: "GET",
  });

  return handleWrappedResponse<ExamPlanItem[]>(response);
}

export async function createExamPlanApi(payload: ExamPlanPayload): Promise<ExamPlanItem> {
  const response = await authFetch(`${API_BASE_URL}/exams`, {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return handleWrappedResponse<ExamPlanItem>(response);
}

export async function updateExamPlanApi(id: string, payload: ExamPlanPayload): Promise<ExamPlanItem> {
  const response = await authFetch(`${API_BASE_URL}/exams/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });

  return handleWrappedResponse<ExamPlanItem>(response);
}

export async function deleteExamPlanApi(id: string): Promise<{ success: true }> {
  const response = await authFetch(`${API_BASE_URL}/exams/${id}`, {
    method: "DELETE",
  });

  return handleWrappedResponse<{ success: true }>(response);
}


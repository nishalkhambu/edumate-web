import type { Types } from "mongoose";

export type UserRole = "user" | "admin";
export type UserStatus = "active" | "inactive";

export interface UserResponse {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IUser {
  _id: { toString(): string };
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  status: UserStatus;
  emailVerified: boolean;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  refreshToken?: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  avatar?: string;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
}

export interface RegisterSuccessResponse {
  success: true;
  user: AuthUser & {
    createdAt: string;
    updatedAt: string;
  };
}

export interface LoginSuccessResponse {
  success: true;
  token: string;
  refreshToken: string;
  user: AuthUser;
}

export interface WhoamiSuccessResponse {
  success: true;
  user: AuthUser & {
    createdAt: string;
    updatedAt: string;
  };
}

export interface UpdateSuccessResponse {
  success: true;
  user: AuthUser & {
    createdAt: string;
    updatedAt: string;
  };
}

// Admin
export interface AdminUserResponse {
  success: true;
  user: AuthUser & { createdAt: string; updatedAt: string };
}

export interface AdminUserListResponse {
  success: true;
  data: AuthUser[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}

export interface AdminForbiddenResponse {
  success: false;
  message: string;
}

export interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
  role?: string;
  status?: string;
}

export interface UpdateUserDTO {
  name?: string;
  email?: string;
  role?: string;
  status?: string;
  password?: string;
}

export interface LoginUserDTO {
  email: string;
  password: string;
}

export interface RegisterUserDTO {
  name: string;
  email: string;
  password: string;
}

export interface UpdateUserProfileDTO {
  name?: string;
  email?: string;
  currentPassword?: string;
  newPassword?: string;
  avatar?: Express.Multer.File;
}

export type AuthActionResult<T> =
  | { success: true; data: T }
  | { success: false; message: string };

export interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
  role?: string;
  status?: string;
}

export interface UpdateUserDTO {
  name?: string;
  email?: string;
  role?: string;
  status?: string;
  password?: string;
}

export interface LoginUserDTO {
  email: string;
  password: string;
}

export interface RegisterUserDTO {
  name: string;
  email: string;
  password: string;
}

export interface UpdateUserProfileDTO {
  name?: string;
  email?: string;
  currentPassword?: string;
  newPassword?: string;
  avatar?: Express.Multer.File;
}

// Study Plan
export type StudyPlanStatus = "not-started" | "in-progress" | "completed" | "paused";
export type Priority = "low" | "medium" | "high";

export interface IStudyPlan {
  user: Types.ObjectId;
  title: string;
  subject: string;
  topic: string;
  description: string;
  studyHours: number;
  priority: Priority;
  deadline: Date;
  status: StudyPlanStatus;
  progress: number;
}

export interface StudyPlanResponse {
  id: string;
  userId: string;
  title: string;
  subject: string;
  topic: string;
  description: string;
  studyHours: number;
  priority: Priority;
  deadline: string;
  status: StudyPlanStatus;
  progress: number;
  createdAt: string;
  updatedAt: string;
}

// Task
export type TaskCategory = "study" | "assignment" | "exam" | "personal";
export type TaskStatus = "pending" | "in_progress" | "completed";

export interface ITask {
  user: Types.ObjectId;
  title: string;
  description: string;
  category: TaskCategory;
  priority: Priority;
  dueDate: Date;
  status: TaskStatus;
  isRecurring: boolean;
  recurringPattern?: string;
}

export interface TaskResponse {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: TaskCategory;
  priority: Priority;
  dueDate: string;
  status: TaskStatus;
  isRecurring: boolean;
  recurringPattern?: string;
  createdAt: string;
  updatedAt: string;
}

// Subject
export interface ISubject {
  user: Types.ObjectId;
  name: string;
  code: string;
  instructor: string;
  color: string;
  totalClasses: number;
  attendedClasses: number;
}

export interface SubjectResponse {
  id: string;
  userId: string;
  name: string;
  code: string;
  instructor: string;
  color: string;
  totalClasses: number;
  attendedClasses: number;
  attendancePct: number;
  createdAt: string;
  updatedAt: string;
}

// Goal
export type GoalType = "daily" | "weekly" | "monthly" | "long-term";
export type GoalStatus = "active" | "paused" | "completed";

export interface IGoal {
  user: Types.ObjectId;
  title: string;
  description: string;
  type: GoalType;
  target: number;
  current: number;
  unit: string;
  deadline: Date;
  status: GoalStatus;
}

export interface GoalResponse {
  id: string;
  userId: string;
  title: string;
  description: string;
  type: GoalType;
  target: number;
  current: number;
  unit: string;
  deadline: string;
  status: GoalStatus;
  progressPct: number;
  createdAt: string;
  updatedAt: string;
}

// Study Session
export interface IStudySession {
  user: Types.ObjectId;
  subject: string;
  topic: string;
  startTime: Date;
  endTime: Date;
  duration: number;
  notes: string;
  productivity: number;
}

export interface StudySessionResponse {
  id: string;
  userId: string;
  subject: string;
  topic: string;
  startTime: string;
  endTime: string;
  duration: number;
  notes: string;
  productivity: number;
  createdAt: string;
}

// Pomodoro
export type PomodoroMode = "focus" | "short-break" | "long-break";

export interface IPomodoroSession {
  user: Types.ObjectId;
  mode: PomodoroMode;
  duration: number;
  completedAt: Date;
  taskId?: Types.ObjectId;
}

export interface PomodoroSessionResponse {
  id: string;
  userId: string;
  mode: PomodoroMode;
  duration: number;
  completedAt: string;
  taskId?: string;
}

// Notification
export type NotificationType = "deadline" | "reminder" | "achievement" | "system";

export interface INotification {
  user: Types.ObjectId;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  relatedId?: Types.ObjectId;
}

export interface NotificationResponse {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  relatedId?: string;
  createdAt: string;
}

// Achievement
export interface IAchievement {
  user: Types.ObjectId;
  badge: string;
  title: string;
  description: string;
  earnedAt: Date;
}

export interface AchievementResponse {
  id: string;
  userId: string;
  badge: string;
  title: string;
  description: string;
  earnedAt: string;
}

// Analytics
export interface ProductivityStats {
  totalStudyHours: number;
  avgProductivity: number;
  completedTasks: number;
  streak: number;
  weeklyGoalProgress: number;
}

export interface SubjectStats {
  subject: string;
  totalHours: number;
  improvement: number;
  sessions: number;
}

export interface AnalyticsResponse {
  productivity: ProductivityStats;
  subjects: SubjectStats[];
  weeklyHours: { day: string; hours: number }[];
}

export interface INote {
  user: Types.ObjectId;
  title: string;
  content: string;
  tag: string;
  favorite: boolean;
}

export interface NoteResponse {
  id: string;
  userId: string;
  title: string;
  content: string;
  tag: string;
  favorite: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ITimetableEntry {
  user: Types.ObjectId;
  subject: string;
  day: number;
  start: string;
  end: string;
  type: "class" | "lab" | "study";
  color: string;
}

export interface TimetableEntryResponse {
  id: string;
  userId: string;
  subject: string;
  day: number;
  start: string;
  end: string;
  type: string;
  color: string;
  createdAt: string;
  updatedAt: string;
}

export interface IExamPlan {
  user: Types.ObjectId;
  subject: string;
  date: string;
  days: number;
  prep: number;
  priority: string;
  syllabus: number;
  completed: number;
}

export interface ExamPlanResponse {
  id: string;
  userId: string;
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

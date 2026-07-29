"use client";

import { toast } from "@/src/components/ui/toaster";
import {
  createStudyPlanApi,
  deleteStudyPlanApi,
  listStudyPlansApi,
  updateStudyPlanApi,
  type StudyPlan,
  type StudyPlanPayload,
  type TaskItem,
  type TaskPayload,
  type SubjectItem,
  type SubjectPayload,
  type Goal,
  type GoalPayload,
  type StudySession,
  type StudySessionPayload,
  type PomodoroSession,
  type PomodoroPayload,
  type Notification,
  type Achievement,
  type AnalyticsOverview,
  createTaskApi,
  listTasksApi,
  updateTaskApi,
  deleteTaskApi,
  createSubjectApi,
  listSubjectsApi,
  createGoalApi,
  listGoalsApi,
  updateGoalApi,
  createStudySessionApi,
  listStudySessionsApi,
  createPomodoroApi,
  listNotificationsApi,
  markNotificationReadApi,
  markAllNotificationsReadApi,
  listAchievementsApi,
  getAnalyticsOverviewApi,
  type NoteItem,
  type NotePayload,
  listNotesApi,
  createNoteApi,
  updateNoteApi,
  deleteNoteApi,
  type TimetableEntryItem,
  type TimetableEntryPayload,
  listTimetableEntriesApi,
  createTimetableEntryApi,
  updateTimetableEntryApi,
  deleteTimetableEntryApi,
  type ExamPlanItem,
  type ExamPlanPayload,
  listExamPlansApi,
  createExamPlanApi,
  updateExamPlanApi,
  deleteExamPlanApi,
} from "@/src/api/study.api";
import { AuthActionResult } from "@/src/types/auth.types";

export async function listStudyPlansAction(): Promise<AuthActionResult<StudyPlan[]>> {
  try {
    const data = await listStudyPlansApi();
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to load study plans",
    };
  }
}

export async function createStudyPlanAction(
  payload: StudyPlanPayload
): Promise<AuthActionResult<StudyPlan>> {
  try {
    const data = await createStudyPlanApi(payload);
    toast.success("Study plan created");
    return { success: true, data };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create study plan";
    toast.error(message);
    return { success: false, message };
  }
}

export async function updateStudyPlanAction(
  id: string,
  payload: Partial<StudyPlanPayload>
): Promise<AuthActionResult<StudyPlan>> {
  try {
    const data = await updateStudyPlanApi(id, payload);
    toast.success("Study plan updated");
    return { success: true, data };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update study plan";
    toast.error(message);
    return { success: false, message };
  }
}

export async function deleteStudyPlanAction(
  id: string
): Promise<AuthActionResult<null>> {
  try {
    await deleteStudyPlanApi(id);
    toast.success("Study plan deleted");
    return { success: true, data: null };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete study plan";
    toast.error(message);
    return { success: false, message };
  }
}

export async function listTasksAction(): Promise<AuthActionResult<TaskItem[]>> {
  try {
    const data = await listTasksApi();
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to load tasks",
    };
  }
}

export async function createTaskAction(
  payload: TaskPayload
): Promise<AuthActionResult<TaskItem>> {
  try {
    const data = await createTaskApi(payload);
    toast.success("Task created");
    return { success: true, data };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create task";
    toast.error(message);
    return { success: false, message };
  }
}

export async function updateTaskAction(
  id: string,
  payload: TaskPayload
): Promise<AuthActionResult<TaskItem>> {
  try {
    const data = await updateTaskApi(id, payload);
    toast.success("Task updated");
    return { success: true, data };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update task";
    toast.error(message);
    return { success: false, message };
  }
}

export async function deleteTaskAction(
  id: string
): Promise<AuthActionResult<null>> {
  try {
    await deleteTaskApi(id);
    toast.success("Task deleted");
    return { success: true, data: null };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete task";
    toast.error(message);
    return { success: false, message };
  }
}

export async function listSubjectsAction(): Promise<AuthActionResult<SubjectItem[]>> {
  try {
    const data = await listSubjectsApi();
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to load subjects",
    };
  }
}

export async function createSubjectAction(
  payload: SubjectPayload
): Promise<AuthActionResult<SubjectItem>> {
  try {
    const data = await createSubjectApi(payload);
    toast.success("Subject created");
    return { success: true, data };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create subject";
    toast.error(message);
    return { success: false, message };
  }
}

export async function listGoalsAction(): Promise<AuthActionResult<Goal[]>> {
  try {
    const data = await listGoalsApi();
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to load goals",
    };
  }
}

export async function createGoalAction(
  payload: GoalPayload
): Promise<AuthActionResult<Goal>> {
  try {
    const data = await createGoalApi(payload);
    toast.success("Goal created");
    return { success: true, data };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create goal";
    toast.error(message);
    return { success: false, message };
  }
}

export async function updateGoalAction(
  id: string,
  payload: Partial<GoalPayload>
): Promise<AuthActionResult<Goal>> {
  try {
    const data = await updateGoalApi(id, payload);
    toast.success("Goal updated");
    return { success: true, data };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update goal";
    toast.error(message);
    return { success: false, message };
  }
}

export async function listStudySessionsAction(): Promise<AuthActionResult<StudySession[]>> {
  try {
    const data = await listStudySessionsApi();
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to load study sessions",
    };
  }
}

export async function createStudySessionAction(
  payload: StudySessionPayload
): Promise<AuthActionResult<StudySession>> {
  try {
    const data = await createStudySessionApi(payload);
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to create study session",
    };
  }
}

export async function createPomodoroAction(
  payload: PomodoroPayload
): Promise<AuthActionResult<PomodoroSession>> {
  try {
    const data = await createPomodoroApi(payload);
    toast.success("Pomodoro session saved");
    return { success: true, data };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to save pomodoro session";
    toast.error(message);
    return { success: false, message };
  }
}

export async function listNotificationsAction(): Promise<AuthActionResult<Notification[]>> {
  try {
    const data = await listNotificationsApi();
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to load notifications",
    };
  }
}

export async function markNotificationReadAction(
  id: string
): Promise<AuthActionResult<Notification>> {
  try {
    const data = await markNotificationReadApi(id);
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to mark notification as read",
    };
  }
}

export async function markAllNotificationsReadAction(): Promise<AuthActionResult<null>> {
  try {
    await markAllNotificationsReadApi();
    toast.success("All notifications marked as read");
    return { success: true, data: null };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to mark all notifications as read";
    toast.error(message);
    return { success: false, message };
  }
}

export async function listAchievementsAction(): Promise<AuthActionResult<Achievement[]>> {
  try {
    const data = await listAchievementsApi();
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to load achievements",
    };
  }
}

export async function getAnalyticsOverviewAction(): Promise<AuthActionResult<AnalyticsOverview>> {
  try {
    const data = await getAnalyticsOverviewApi();
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to load analytics",
    };
  }
}

export async function listNotesAction(): Promise<AuthActionResult<NoteItem[]>> {
  try {
    const data = await listNotesApi();
    return { success: true, data };
  } catch (error) {
    return { success: false, message: error instanceof Error ? error.message : "Failed to load notes" };
  }
}

export async function createNoteAction(payload: NotePayload): Promise<AuthActionResult<NoteItem>> {
  try {
    const data = await createNoteApi(payload);
    toast.success("Note created");
    return { success: true, data };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create note";
    toast.error(message);
    return { success: false, message };
  }
}

export async function updateNoteAction(id: string, payload: NotePayload): Promise<AuthActionResult<NoteItem>> {
  try {
    const data = await updateNoteApi(id, payload);
    toast.success("Note updated");
    return { success: true, data };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update note";
    toast.error(message);
    return { success: false, message };
  }
}

export async function deleteNoteAction(id: string): Promise<AuthActionResult<null>> {
  try {
    await deleteNoteApi(id);
    toast.success("Note deleted");
    return { success: true, data: null };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete note";
    toast.error(message);
    return { success: false, message };
  }
}

export async function listTimetableEntriesAction(): Promise<AuthActionResult<TimetableEntryItem[]>> {
  try {
    const data = await listTimetableEntriesApi();
    return { success: true, data };
  } catch (error) {
    return { success: false, message: error instanceof Error ? error.message : "Failed to load timetable" };
  }
}

export async function createTimetableEntryAction(payload: TimetableEntryPayload): Promise<AuthActionResult<TimetableEntryItem>> {
  try {
    const data = await createTimetableEntryApi(payload);
    toast.success("Timetable entry created");
    return { success: true, data };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create timetable entry";
    toast.error(message);
    return { success: false, message };
  }
}

export async function updateTimetableEntryAction(id: string, payload: TimetableEntryPayload): Promise<AuthActionResult<TimetableEntryItem>> {
  try {
    const data = await updateTimetableEntryApi(id, payload);
    toast.success("Timetable entry updated");
    return { success: true, data };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update timetable entry";
    toast.error(message);
    return { success: false, message };
  }
}

export async function deleteTimetableEntryAction(id: string): Promise<AuthActionResult<null>> {
  try {
    await deleteTimetableEntryApi(id);
    toast.success("Timetable entry deleted");
    return { success: true, data: null };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete timetable entry";
    toast.error(message);
    return { success: false, message };
  }
}

export async function listExamPlansAction(): Promise<AuthActionResult<ExamPlanItem[]>> {
  try {
    const data = await listExamPlansApi();
    return { success: true, data };
  } catch (error) {
    return { success: false, message: error instanceof Error ? error.message : "Failed to load exam plans" };
  }
}

export async function createExamPlanAction(payload: ExamPlanPayload): Promise<AuthActionResult<ExamPlanItem>> {
  try {
    const data = await createExamPlanApi(payload);
    toast.success("Exam plan created");
    return { success: true, data };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create exam plan";
    toast.error(message);
    return { success: false, message };
  }
}

export async function updateExamPlanAction(id: string, payload: ExamPlanPayload): Promise<AuthActionResult<ExamPlanItem>> {
  try {
    const data = await updateExamPlanApi(id, payload);
    toast.success("Exam plan updated");
    return { success: true, data };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update exam plan";
    toast.error(message);
    return { success: false, message };
  }
}

export async function deleteExamPlanAction(id: string): Promise<AuthActionResult<null>> {
  try {
    await deleteExamPlanApi(id);
    toast.success("Exam plan deleted");
    return { success: true, data: null };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete exam plan";
    toast.error(message);
    return { success: false, message };
  }
}

"use server";

import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import type { TaskStatus, Priority } from "@/lib/types";

type CookieToSet = {
  name: string;
  value: string;
  options: CookieOptions;
};

async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: CookieToSet[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Server Components cannot set cookies
          }
        }
      }
    }
  );
}

async function getSession() {
  const supabase = await createClient();
  const {
    data: { session }
  } = await supabase.auth.getSession();
  return session;
}

async function ensureProfile() {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  const supabase = await createClient();
  const { error } = await supabase.from("profiles").upsert(
    {
      id: session.user.id,
      full_name:
        typeof session.user.user_metadata?.full_name === "string"
          ? session.user.user_metadata.full_name
          : session.user.email?.split("@")[0] || null
    },
    { onConflict: "id" }
  );

  if (error) throw error;

  return { session, supabase };
}

// Tasks
export async function createTask(
  title: string,
  description?: string,
  category = "General",
  priority: Priority = "Medium",
  dueDate?: string
) {
  const { session, supabase } = await ensureProfile();
  const normalizedDueAt = normalizeDueAt(dueDate);

  const { data, error } = await supabase
    .from("tasks")
    .insert({
      user_id: session.user.id,
      title,
      description,
      category,
      priority,
      status: "Today",
      due_at: normalizedDueAt
    })
    .select()
    .single();

  if (error) throw error;

  revalidatePath("/");
  return data;
}

export async function createTaskFromForm(formData: FormData) {
  const title = String(formData.get("title") || "").trim();
  if (!title) return;

  const priority = normalizePriority(formData.get("priority"));
  const dueDate = String(formData.get("dueDate") || "");
  await createTask(title, undefined, "General", priority, dueDate);
}

function normalizePriority(value: FormDataEntryValue | null): Priority {
  if (value === "Critical" || value === "High" || value === "Medium" || value === "Low") {
    return value;
  }

  return "Medium";
}

function normalizeDueAt(value?: string) {
  if (!value) return null;

  const trimmed = value.trim();
  if (!trimmed) return null;

  if (/^\d{2}:\d{2}$/.test(trimmed)) {
    const [hours, minutes] = trimmed.split(":").map(Number);
    const dueAt = new Date();
    dueAt.setHours(hours, minutes, 0, 0);
    return dueAt.toISOString();
  }

  const parsed = new Date(trimmed);
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
}

export async function updateTaskStatus(taskId: string, status: TaskStatus) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("tasks")
    .update({
      status,
      completed_at: status === "Done" ? new Date().toISOString() : null,
      updated_at: new Date().toISOString()
    })
    .eq("id", taskId)
    .eq("user_id", session.user.id)
    .select()
    .single();

  if (error) throw error;

  revalidatePath("/");
  return data;
}

export async function updateTaskStatusFromForm(formData: FormData) {
  const taskId = String(formData.get("taskId") || "");
  const status = normalizeTaskStatus(formData.get("status"));
  if (!taskId) return;

  await updateTaskStatus(taskId, status);
}

function normalizeTaskStatus(value: FormDataEntryValue | null): TaskStatus {
  if (value === "Backlog" || value === "Today" || value === "In Progress" || value === "Done") {
    return value;
  }

  return "Today";
}

export async function deleteTask(taskId: string) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  const supabase = await createClient();

  const { error } = await supabase
    .from("tasks")
    .delete()
    .eq("id", taskId)
    .eq("user_id", session.user.id);

  if (error) throw error;

  revalidatePath("/");
}

export async function deleteTaskFromForm(formData: FormData) {
  const taskId = String(formData.get("taskId") || "");
  if (!taskId) return;

  await deleteTask(taskId);
}

// Habits
export async function createHabit(
  name: string,
  category: string,
  cadence: "Daily" | "Weekly" | "Monthly"
) {
  const { session, supabase } = await ensureProfile();

  const { data, error } = await supabase
    .from("habits")
    .insert({
      user_id: session.user.id,
      name,
      category,
      cadence
    })
    .select()
    .single();

  if (error) throw error;

  revalidatePath("/");
  return data;
}

export async function completeHabitToday(habitId: string) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  const supabase = await createClient();

  const today = new Date().toISOString().split("T")[0];

  const { data, error } = await supabase
    .from("habit_logs")
    .insert({
      habit_id: habitId,
      user_id: session.user.id,
      completed_on: today
    })
    .select()
    .single();

  if (error && error.code !== "23505") throw error; // 23505 is unique constraint violation

  revalidatePath("/");
  return data;
}

export async function deleteHabit(habitId: string) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  const supabase = await createClient();

  const { error } = await supabase
    .from("habits")
    .delete()
    .eq("id", habitId)
    .eq("user_id", session.user.id);

  if (error) throw error;

  revalidatePath("/");
}

// Study Sessions
export async function logStudySession(
  subject: string,
  durationMinutes: number,
  targetMinutes = 0,
  notes?: string
) {
  const { session, supabase } = await ensureProfile();

  const now = new Date();
  const startedAt = new Date(now.getTime() - durationMinutes * 60000);

  const { data, error } = await supabase
    .from("study_sessions")
    .insert({
      user_id: session.user.id,
      subject,
      started_at: startedAt.toISOString(),
      ended_at: now.toISOString(),
      duration_minutes: durationMinutes,
      target_minutes: targetMinutes,
      notes
    })
    .select()
    .single();

  if (error) throw error;

  revalidatePath("/");
  return data;
}

// Journals
export async function createJournalEntry(
  gratitude: string,
  reflection: string,
  growthNote?: string
) {
  const { session, supabase } = await ensureProfile();

  const today = new Date().toISOString().split("T")[0];

  const { data, error } = await supabase
    .from("journals")
    .upsert({
      user_id: session.user.id,
      entry_date: today,
      gratitude,
      reflection,
      growth_note: growthNote
    })
    .select()
    .single();

  if (error) throw error;

  revalidatePath("/");
  return data;
}

export async function saveTodayTargetsFromForm(formData: FormData) {
  const targets = String(formData.get("targets") || "").trim();
  await updateTodayJournal({ gratitude: targets });
}

export async function saveQuickNoteFromForm(formData: FormData) {
  const note = String(formData.get("quickNote") || "").trim();
  await updateTodayJournal({ reflection: note });
}

async function updateTodayJournal(updates: { gratitude?: string; reflection?: string; growthNote?: string }) {
  const { session, supabase } = await ensureProfile();
  const today = new Date().toISOString().split("T")[0];

  const { data: existing, error: fetchError } = await supabase
    .from("journals")
    .select("gratitude, reflection, growth_note")
    .eq("user_id", session.user.id)
    .eq("entry_date", today)
    .maybeSingle();

  if (fetchError) throw fetchError;

  const { data, error } = await supabase
    .from("journals")
    .upsert(
      {
        user_id: session.user.id,
        entry_date: today,
        gratitude: updates.gratitude ?? existing?.gratitude ?? "",
        reflection: updates.reflection ?? existing?.reflection ?? "",
        growth_note: updates.growthNote ?? existing?.growth_note ?? "",
        updated_at: new Date().toISOString()
      },
      { onConflict: "user_id,entry_date" }
    )
    .select()
    .single();

  if (error) throw error;

  revalidatePath("/");
  return data;
}

// Goals
export async function createGoal(
  title: string,
  description: string,
  cadence: "Daily" | "Weekly" | "Monthly" | "Yearly",
  targetDate?: string
) {
  const { session, supabase } = await ensureProfile();

  const { data, error } = await supabase
    .from("goals")
    .insert({
      user_id: session.user.id,
      title,
      description,
      cadence,
      target_date: targetDate
    })
    .select()
    .single();

  if (error) throw error;

  revalidatePath("/");
  return data;
}

export async function createGoalWithDailyTaskFromForm(formData: FormData) {
  const title = String(formData.get("title") || "").trim();
  if (!title) return;

  const cadence = normalizeGoalCadence(formData.get("cadence"));
  const dailyTask = String(formData.get("dailyTask") || "").trim();
  const dueDate = String(formData.get("dueDate") || "");
  const priority = normalizePriority(formData.get("priority"));

  await createGoal(title, "", cadence);

  if (dailyTask) {
    await createTask(dailyTask, `Daily task for goal: ${title}`, title, priority, dueDate);
  }
}

function normalizeGoalCadence(value: FormDataEntryValue | null) {
  if (value === "Daily" || value === "Weekly" || value === "Monthly" || value === "Yearly") {
    return value;
  }

  return "Daily";
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/");
}

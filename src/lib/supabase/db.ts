import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import type {
  Habit,
  Task,
  Goal,
  StudySession,
  JournalEntry,
  Achievement,
  Profile,
  HistoryDay
} from "@/lib/types";

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

export async function getSession() {
  const supabase = await createClient();
  const {
    data: { session }
  } = await supabase.auth.getSession();
  return session;
}

export async function getProfile(): Promise<Profile | null> {
  const supabase = await createClient();
  const session = await getSession();

  if (!session) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", session.user.id)
    .single();

  if (error) {
    console.error("Error fetching profile:", error);
    return null;
  }

  return data;
}

export async function getHabits(): Promise<Habit[]> {
  const supabase = await createClient();
  const session = await getSession();

  if (!session) return [];

  const { data, error } = await supabase
    .from("habits")
    .select("id, name, category, cadence, reminder_time")
    .eq("user_id", session.user.id)
    .is("archived_at", null)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching habits:", error);
    return [];
  }

  // Get today's completion status
  const today = new Date().toISOString().split("T")[0];
  const { data: logs } = await supabase
    .from("habit_logs")
    .select("habit_id")
    .eq("user_id", session.user.id)
    .eq("completed_on", today);

  const completedHabitIds = new Set(logs?.map((log) => log.habit_id) || []);

  return data.map((habit) => ({
    id: habit.id,
    name: habit.name,
    category: habit.category,
    cadence: habit.cadence,
    streak: 0, // Calculate from logs if needed
    completedToday: completedHabitIds.has(habit.id),
    completionRate: 0 // Calculate from logs if needed
  }));
}

export async function getTasks(): Promise<Task[]> {
  const supabase = await createClient();
  const session = await getSession();

  if (!session) return [];

  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("user_id", session.user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching tasks:", error);
    return [];
  }

  return data.map((task) => ({
    id: task.id,
    title: task.title,
    category: task.category,
    priority: task.priority,
    status: task.status,
    dueDate: formatDueDate(task.due_at),
    tags: task.tags || []
  }));
}

function formatDueDate(value: string | null) {
  if (!value) return "No time";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "No time";

  const today = new Date();
  const sameDay =
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate();

  return sameDay
    ? date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
    : date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export async function getGoals(): Promise<Goal[]> {
  const supabase = await createClient();
  const session = await getSession();

  if (!session) return [];

  const { data, error } = await supabase
    .from("goals")
    .select("id, title, cadence, progress")
    .eq("user_id", session.user.id)
    .is("archived_at", null)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching goals:", error);
    return [];
  }

  // Get milestones count
  const { data: milestones } = await supabase
    .from("goal_milestones")
    .select("goal_id, completed_at")
    .eq("user_id", session.user.id);

  return data.map((goal) => {
    const goalMilestones = milestones?.filter((m) => m.goal_id === goal.id) || [];
    const completedMilestones = goalMilestones.filter((m) => m.completed_at).length;

    return {
      id: goal.id,
      title: goal.title,
      cadence: goal.cadence,
      progress: goal.progress,
      milestones: goalMilestones.length,
      completedMilestones
    };
  });
}

export async function getStudySessions(): Promise<StudySession[]> {
  const supabase = await createClient();
  const session = await getSession();

  if (!session) return [];

  const { data, error } = await supabase
    .from("study_sessions")
    .select("*")
    .eq("user_id", session.user.id)
    .order("started_at", { ascending: false })
    .limit(10);

  if (error) {
    console.error("Error fetching study sessions:", error);
    return [];
  }

  return data.map((session) => ({
    id: session.id,
    subject: session.subject,
    minutes: session.duration_minutes,
    targetMinutes: session.target_minutes,
    date: new Date(session.started_at).toLocaleDateString("en-US", { weekday: "short" })
  }));
}

export async function getJournalEntries(): Promise<JournalEntry[]> {
  const supabase = await createClient();
  const session = await getSession();

  if (!session) return [];

  const { data, error } = await supabase
    .from("journals")
    .select("*")
    .eq("user_id", session.user.id)
    .order("entry_date", { ascending: false })
    .limit(5);

  if (error) {
    console.error("Error fetching journal entries:", error);
    return [];
  }

  return data.map((entry) => ({
    id: entry.id,
    date: isToday(entry.entry_date)
      ? "Today"
      : new Date(entry.entry_date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    mood: "Focused",
    gratitude: entry.gratitude || "",
    reflection: entry.reflection || ""
  }));
}

export async function getHistorySnapshots({
  from,
  to
}: {
  from?: string;
  to?: string;
} = {}): Promise<HistoryDay[]> {
  const supabase = await createClient();
  const session = await getSession();

  if (!session) return [];

  const { fromDate, toDate, fromTimestamp, toTimestamp } = resolveHistoryRange({ from, to });

  const [journalsRes, tasksRes, studyRes, scoresRes] = await Promise.all([
    supabase
      .from("journals")
      .select("entry_date, gratitude, reflection")
      .eq("user_id", session.user.id)
      .gte("entry_date", fromDate)
      .lte("entry_date", toDate)
      .order("entry_date", { ascending: false }),
    supabase
      .from("tasks")
      .select("id, title, category, priority, status, due_at, tags, created_at")
      .eq("user_id", session.user.id)
      .gte("created_at", fromTimestamp)
      .lte("created_at", toTimestamp)
      .order("created_at", { ascending: false }),
    supabase
      .from("study_sessions")
      .select("id, subject, duration_minutes, target_minutes, started_at")
      .eq("user_id", session.user.id)
      .gte("started_at", fromTimestamp)
      .lte("started_at", toTimestamp)
      .order("started_at", { ascending: false }),
    supabase
      .from("productivity_scores")
      .select("score_date, total_score")
      .eq("user_id", session.user.id)
      .gte("score_date", fromDate)
      .lte("score_date", toDate)
      .order("score_date", { ascending: false })
  ]);

  if (journalsRes.error) {
    console.error("Error fetching history journals:", journalsRes.error);
  }
  if (tasksRes.error) {
    console.error("Error fetching history tasks:", tasksRes.error);
  }
  if (studyRes.error) {
    console.error("Error fetching history study sessions:", studyRes.error);
  }
  if (scoresRes.error) {
    console.error("Error fetching history scores:", scoresRes.error);
  }

  const dayMap = new Map<string, HistoryDay>();
  const ensureDay = (dateKey: string) => {
    if (!dayMap.has(dateKey)) {
      dayMap.set(dateKey, {
        date: dateKey,
        label: formatHistoryLabel(dateKey),
        targets: "",
        quickNote: "",
        tasks: [],
        studySessions: [],
        score: undefined
      });
    }

    return dayMap.get(dateKey)!;
  };

  const journals = journalsRes.data ?? [];
  journals.forEach((entry) => {
    if (!entry.entry_date) return;
    const day = ensureDay(entry.entry_date);
    day.targets = entry.gratitude || "";
    day.quickNote = entry.reflection || "";
  });

  const tasks = tasksRes.data ?? [];
  tasks.forEach((task) => {
    const dateKey = task.created_at ? toDateKey(task.created_at) : null;
    if (!dateKey) return;
    const day = ensureDay(dateKey);
    day.tasks.push({
      id: task.id,
      title: task.title,
      category: task.category,
      priority: task.priority,
      status: task.status,
      dueDate: formatDueDate(task.due_at),
      tags: task.tags || []
    });
  });

  const studySessions = studyRes.data ?? [];
  studySessions.forEach((session) => {
    const dateKey = session.started_at ? toDateKey(session.started_at) : null;
    if (!dateKey) return;
    const day = ensureDay(dateKey);
    day.studySessions.push({
      id: session.id,
      subject: session.subject,
      minutes: session.duration_minutes,
      targetMinutes: session.target_minutes,
      date: new Date(session.started_at).toLocaleDateString("en-US", { weekday: "short" })
    });
  });

  const scores = scoresRes.data ?? [];
  scores.forEach((score) => {
    if (!score.score_date) return;
    const day = ensureDay(score.score_date);
    day.score = score.total_score;
  });

  return Array.from(dayMap.values()).sort((a, b) => (a.date < b.date ? 1 : -1));
}

function isToday(value: string) {
  const date = new Date(value);
  const today = new Date();

  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
}

function toDateKey(value: string | Date) {
  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) return null;

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatHistoryLabel(dateKey: string) {
  const date = new Date(`${dateKey}T00:00:00`);

  if (Number.isNaN(date.getTime())) return dateKey;

  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function resolveHistoryRange({ from, to }: { from?: string; to?: string }) {
  const today = new Date();
  const fallbackTo = toDateKey(today) ?? new Date().toISOString().split("T")[0];
  const fallbackFromDate = new Date(today);
  fallbackFromDate.setDate(fallbackFromDate.getDate() - 30);
  const fallbackFrom = toDateKey(fallbackFromDate) ?? fallbackTo;

  const fromKey = normalizeDateKey(from) ?? fallbackFrom;
  const toKey = normalizeDateKey(to) ?? fallbackTo;

  const [fromDate, toDate] = fromKey <= toKey ? [fromKey, toKey] : [toKey, fromKey];
  const fromTimestamp = new Date(`${fromDate}T00:00:00.000Z`).toISOString();
  const toTimestamp = new Date(`${toDate}T23:59:59.999Z`).toISOString();

  return { fromDate, toDate, fromTimestamp, toTimestamp };
}

function normalizeDateKey(value?: string | null) {
  if (!value) return null;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;

  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return null;

  return value;
}

export async function getAchievements(): Promise<Achievement[]> {
  const supabase = await createClient();
  const session = await getSession();

  if (!session) return [];

  const { data, error } = await supabase
    .from("achievements")
    .select("*")
    .eq("user_id", session.user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching achievements:", error);
    return [];
  }

  return data.map((achievement) => ({
    id: achievement.id,
    name: achievement.name,
    description: achievement.description,
    earned: achievement.earned_at !== null
  }));
}

export async function getTodayScore(): Promise<number> {
  const supabase = await createClient();
  const session = await getSession();

  if (!session) return 0;

  const today = new Date().toISOString().split("T")[0];
  const { data } = await supabase
    .from("productivity_scores")
    .select("total_score")
    .eq("user_id", session.user.id)
    .eq("score_date", today)
    .single();

  return data?.total_score || 0;
}

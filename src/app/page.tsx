import {
  BookOpen,
  CheckCircle2,
  Flame,
  GraduationCap,
  Target
} from "lucide-react";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { GoalsSection } from "@/components/goals-section";
import { NotesSection } from "@/components/notes-section";
import { TodoSection } from "@/components/todo-section";
import { ProgressBar } from "@/components/ui/progress-bar";
import {
  getHabits,
  getTasks,
  getGoals,
  getStudySessions,
  getJournalEntries,
  getTodayScore,
  getSession
} from "@/lib/supabase/db";
import { percentage } from "@/lib/utils";
import { logStudySession } from "@/lib/actions";

export default async function Home() {
  const [session, habitsData, tasksData, goalsData, studySessionsData, journalEntriesData, todayScoreData] =
    await Promise.all([
      getSession(),
      getHabits(),
      getTasks(),
      getGoals(),
      getStudySessions(),
      getJournalEntries(),
      getTodayScore()
    ]);

  if (!session) {
    redirect("/auth");
  }

  const habits = habitsData;
  const tasks = tasksData;
  const goals = goalsData;
  const studySessions = studySessionsData;
  const journalEntries = journalEntriesData;
  const todayScore = todayScoreData;

  const completedTasks = tasks.filter((task) => task.status === "Done").length;
  const studyMinutes = studySessions.reduce((total, session) => total + session.minutes, 0);
  const studyTarget = studySessions.reduce((total, session) => total + session.targetMinutes, 0);
  const currentStreak = Math.max(14, ...habits.map((habit) => habit.streak));
  const todayTasks = tasks.filter((task) => task.status === "Today" || task.status === "Done");
  const todayEntry = journalEntries.find((entry) => entry.date === "Today");

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl space-y-5" id="home">
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <TodayMetric icon={CheckCircle2} label="Tasks Completed" value={`${completedTasks} / ${tasks.length}`} progress={percentage(completedTasks, tasks.length)} tone="blue" />
          <TodayMetric icon={GraduationCap} label="Study Hours" value={`${(studyMinutes / 60).toFixed(1)} hrs`} progress={studyTarget > 0 ? percentage(studyMinutes, studyTarget) : 0} tone="green" />
          <TodayMetric icon={Target} label="Focus Score" value={`${todayScore}%`} progress={todayScore} tone="purple" />
          <TodayMetric icon={Flame} label="Current Streak" value={`${currentStreak} days`} progress={Math.min(100, currentStreak * 5)} tone="orange" />
        </section>

        <section className="grid gap-5 xl:grid-cols-2">
          <TodoSection tasks={todayTasks} />
          <div className="space-y-4">
            <NotesSection todayEntry={todayEntry} />
            <StudySessionForm />
          </div>
        </section>

        <GoalsSection goals={goals} />
      </div>
    </AppShell>
  );
}

async function addStudySession(formData: FormData) {
  "use server";
  const subject = String(formData.get("subject") || "").trim();
  const minutes = Number(formData.get("minutes") || 0);
  if (!subject || minutes <= 0) return;
  await logStudySession(subject, minutes, 360);
}

function StudySessionForm() {
  return (
    <form action={addStudySession} className="grid gap-2 rounded-lg border border-line bg-mist/35 p-3 sm:grid-cols-[1fr_96px_auto]">
      <input className="h-9 rounded-md border border-line px-3 text-sm outline-none focus:border-green-600" name="subject" placeholder="Study subject" />
      <input className="h-9 rounded-md border border-line px-3 text-sm outline-none focus:border-green-600" min="1" name="minutes" placeholder="Minutes" type="number" />
      <button className="focus-ring inline-flex h-9 items-center justify-center gap-2 rounded-md bg-forest px-3 text-sm font-medium text-white disabled:opacity-50" type="submit">
        <BookOpen className="h-4 w-4" />
        Log
      </button>
    </form>
  );
}

function TodayMetric({ icon: Icon, label, value, progress, tone }: { icon: React.ElementType; label: string; value: string; progress: number; tone: "blue" | "green" | "purple" | "orange" }) {
  const colorMap = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    purple: "bg-purple-50 text-purple-600",
    orange: "bg-orange-50 text-orange-600"
  };

  return (
    <div className="rounded-lg border border-line bg-surface p-4 shadow-soft">
      <div className="mb-4 flex items-center gap-3">
        <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-full ${colorMap[tone]}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-medium text-ink/55">{label}</p>
          <p className="mt-1 text-xl font-bold text-ink">{value}</p>
        </div>
      </div>
      <ProgressBar value={progress} tone={tone === "green" ? "forest" : tone === "orange" ? "gold" : "sky"} />
    </div>
  );
}

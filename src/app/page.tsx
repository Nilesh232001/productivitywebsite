import {
  Award,
  BookOpen,
  Brain,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Flame,
  GraduationCap,
  ListChecks,
  MoreVertical,
  NotebookPen,
  Pin,
  Plus,
  Sparkles,
  Target,
  Trash2
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { ProductivityChart, StudyChart } from "@/components/charts/productivity-chart";
import { ProgressBar } from "@/components/ui/progress-bar";
import { StatCard } from "@/components/ui/stat-card";
import { achievements, goals, habits, journalEntries, studySessions, tasks, todayScore } from "@/lib/mock-data";
import { percentage } from "@/lib/utils";

const completedHabits = habits.filter((habit) => habit.completedToday).length;
const completedTasks = tasks.filter((task) => task.status === "Done").length;
const studyMinutes = studySessions.reduce((total, session) => total + session.minutes, 0);
const studyTarget = studySessions.reduce((total, session) => total + session.targetMinutes, 0);
const longestGoalStreak = 14;

const notes = [
  {
    id: "n1",
    title: "Today's Targets",
    tone: "warm",
    lines: ["Study 6 hours", "Complete all tasks", "Revise DBMS", "Solve 20 DSA questions", "Read and learn something new"]
  },
  {
    id: "n2",
    title: "Quick Note",
    tone: "cool",
    lines: ["Don't stop when you are tired,", "stop when you are done."]
  }
];

export default function Home() {
  return (
    <AppShell>
      <div className="mx-auto max-w-7xl space-y-8">
      <section className="space-y-5" id="home">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-forest">Today</p>
            <h1 className="mt-1 text-3xl font-semibold tracking-normal text-ink">Daily focus board</h1>
          </div>
          <button type="button" className="focus-ring inline-flex h-10 items-center gap-2 rounded-md bg-forest px-4 text-sm font-medium text-white">
            <Plus aria-hidden className="h-4 w-4" />
            Add target
          </button>
        </header>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <TodayMetric icon={CheckCircle2} label="Tasks Completed" value={`${completedTasks} / ${tasks.length}`} progress={percentage(completedTasks, tasks.length)} tone="blue" />
          <TodayMetric icon={GraduationCap} label="Study Hours" value={`${(studyMinutes / 60).toFixed(1)} hrs`} progress={75} tone="green" />
          <TodayMetric icon={Target} label="Focus Score" value={`${todayScore}%`} progress={todayScore} tone="purple" />
          <TodayMetric icon={Flame} label="Current Streak" value={`${longestGoalStreak} days`} progress={78} tone="orange" />
        </section>

        <section className="grid gap-5 xl:grid-cols-2" id="tasks">
          <Panel
            action="Add Task"
            icon={<ListChecks aria-hidden className="h-5 w-5 text-blue-600" />}
            title="Today's To-Do List"
          >
            <div className="mb-4 flex gap-6 border-b border-line text-xs font-medium text-ink/55">
              {["All", "Pending", "Completed"].map((tab, index) => (
                <button
                  className={`focus-ring border-b-2 px-1 pb-3 ${index === 0 ? "border-blue-600 text-blue-600" : "border-transparent"}`}
                  key={tab}
                  type="button"
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="space-y-1">
              {tasks.map((task) => (
                <div className="grid min-h-11 grid-cols-[24px_1fr_auto_auto_24px] items-center gap-3 rounded-md px-1 text-sm hover:bg-mist/70" key={task.id}>
                  <span className={`grid h-4 w-4 place-items-center rounded border ${task.status === "Done" ? "border-forest bg-forest text-white" : "border-line bg-white"}`}>
                    {task.status === "Done" ? <CheckCircle2 aria-hidden className="h-3 w-3" /> : null}
                  </span>
                  <span className={`font-medium ${task.status === "Done" ? "text-ink/45 line-through" : "text-ink"}`}>{task.title}</span>
                  <PriorityBadge priority={task.priority} />
                  <span className="whitespace-nowrap text-xs text-ink/55">{task.dueDate}</span>
                  <button aria-label={`More actions for ${task.title}`} className="focus-ring grid h-8 w-8 place-items-center rounded-md text-ink/45 hover:bg-white" type="button">
                    <MoreVertical aria-hidden className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
            <button type="button" className="focus-ring mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-md bg-blue-50 text-sm font-medium text-blue-700">
              <Plus aria-hidden className="h-4 w-4" />
              Add New Task
            </button>
          </Panel>

          <Panel
            action="Add Note"
            icon={<NotebookPen aria-hidden className="h-5 w-5 text-purple-600" />}
            title="Notes / Targets for Today"
          >
            <div className="space-y-4">
              {notes.map((note) => (
                <article
                  className={`rounded-lg border p-5 ${
                    note.tone === "warm" ? "border-amber-200 bg-amber-50" : "border-purple-100 bg-purple-50"
                  }`}
                  key={note.id}
                >
                  <h3 className="text-sm font-semibold text-ink">{note.title}</h3>
                  <div className="mt-3 space-y-1 text-sm leading-6 text-ink/75">
                    {note.lines.map((line) => (
                      <p key={line}>{note.tone === "warm" ? `• ${line}` : line}</p>
                    ))}
                  </div>
                  <div className="mt-4 flex justify-end gap-2">
                    <button aria-label={`Pin ${note.title}`} className="focus-ring grid h-8 w-8 place-items-center rounded-md text-ink/45 hover:bg-white/75" type="button">
                      <Pin aria-hidden className="h-4 w-4" />
                    </button>
                    <button aria-label={`Delete ${note.title}`} className="focus-ring grid h-8 w-8 place-items-center rounded-md text-ink/45 hover:bg-white/75" type="button">
                      <Trash2 aria-hidden className="h-4 w-4" />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </Panel>
        </section>

        <div id="goals">
        <Panel
          action="View All Goals"
          icon={<Target aria-hidden className="h-5 w-5 text-forest" />}
          title="All Goals"
        >
          <div className="space-y-4">
            {goals.map((goal, index) => (
              <div className="grid gap-3 rounded-md md:grid-cols-[220px_1fr_48px_24px] md:items-center" key={goal.id}>
                <div className="flex items-center gap-3">
                  <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-full ${goalIconStyles[index % goalIconStyles.length]}`}>
                    <Target aria-hidden className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-ink">{goal.title}</p>
                    <p className="text-xs text-ink/50">{goal.cadence} Goal</p>
                  </div>
                </div>
                <ProgressBar value={goal.progress} tone={goalProgressTones[index % goalProgressTones.length]} />
                <span className="text-sm font-semibold text-forest">{goal.progress}%</span>
                <button aria-label={`Open ${goal.title}`} className="focus-ring grid h-8 w-8 place-items-center rounded-md text-ink/45 hover:bg-mist" type="button">
                  <ChevronRight aria-hidden className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </Panel>
        </div>
      </section>

      <section className="space-y-5 scroll-mt-5" id="dashboard">
        <header>
          <p className="text-sm font-medium text-forest">Dashboard</p>
          <h2 className="mt-1 text-3xl font-semibold tracking-normal text-ink">Productivity overview</h2>
        </header>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard icon={Brain} label="Productivity score" value={`${todayScore}`} helper="Weighted from habits, tasks, study, goals, and journal." />
          <StatCard icon={Flame} label="Habits done" value={`${completedHabits}/${habits.length}`} helper="Two streaks need attention before midnight." tone="coral" />
          <StatCard icon={ListChecks} label="Task completion" value={`${percentage(completedTasks, tasks.length)}%`} helper="Critical work is still scheduled for today." tone="gold" />
          <StatCard icon={BookOpen} label="Study progress" value={`${studyMinutes}m`} helper={`${percentage(studyMinutes, studyTarget)}% of planned study minutes.`} tone="sky" />
        </section>

        <section className="grid gap-5 xl:grid-cols-[1.3fr_0.7fr]" id="analytics">
          <Panel action="Export" icon={<Sparkles aria-hidden className="h-5 w-5 text-gold" />} title="Productivity Trend">
            <ProductivityChart />
          </Panel>
          <Panel action="Report" icon={<Clock3 aria-hidden className="h-5 w-5 text-sky" />} title="Study Performance">
            <StudyChart />
          </Panel>
        </section>

        <section className="grid gap-5 xl:grid-cols-3">
          <div id="habits">
          <Panel action="New habit" icon={<Flame aria-hidden className="h-5 w-5 text-coral" />} title="Habit Tracker">
            <div className="space-y-3">
              {habits.map((habit) => (
                <div className="rounded-md border border-line p-3" key={habit.id}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium text-ink">{habit.name}</p>
                      <p className="text-xs text-ink/55">{habit.category} · {habit.cadence} · {habit.streak} day streak</p>
                    </div>
                    <span className={`grid h-7 w-7 place-items-center rounded-md ${habit.completedToday ? "bg-forest text-white" : "bg-mist text-ink/45"}`}>
                      <CheckCircle2 aria-hidden className="h-4 w-4" />
                    </span>
                  </div>
                  <div className="mt-3">
                    <ProgressBar value={habit.completionRate} />
                  </div>
                </div>
              ))}
            </div>
          </Panel>
          </div>

          <div id="journal">
          <Panel action="Write" icon={<NotebookPen aria-hidden className="h-5 w-5 text-purple-600" />} title="Journal and Mood">
            {journalEntries.map((entry) => (
              <article className="rounded-md border border-line p-4" key={entry.id}>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-forest">{entry.date}</span>
                  <span className="rounded-md bg-mist px-2 py-1 text-xs text-ink/70">{entry.mood}</span>
                </div>
                <p className="mt-3 text-sm text-ink/70">{entry.gratitude}</p>
                <p className="mt-2 text-sm text-ink/60">{entry.reflection}</p>
              </article>
            ))}
          </Panel>
          </div>

          <div id="settings">
          <Panel action="Manage" icon={<Award aria-hidden className="h-5 w-5 text-gold" />} title="Gamification">
            <div className="space-y-3">
              {achievements.map((achievement) => (
                <div className="flex items-start gap-3 rounded-md border border-line p-3" key={achievement.id}>
                  <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-md ${achievement.earned ? "bg-gold/15 text-gold" : "bg-mist text-ink/40"}`}>
                    <Award aria-hidden className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="font-medium text-ink">{achievement.name}</p>
                    <p className="text-xs leading-5 text-ink/60">{achievement.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </Panel>
          </div>
        </section>

        <section className="grid gap-5 xl:grid-cols-2">
          <div id="study">
          <Panel action="Log session" icon={<BookOpen aria-hidden className="h-5 w-5 text-sky" />} title="Study Tracker">
            <div className="space-y-3">
              {studySessions.map((session) => (
                <div className="rounded-md border border-line p-3" key={session.id}>
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-medium text-ink">{session.subject}</p>
                      <p className="text-xs text-ink/55">{session.date} · {session.minutes} of {session.targetMinutes} minutes</p>
                    </div>
                    <Clock3 aria-hidden className="h-4 w-4 text-sky" />
                  </div>
                  <div className="mt-3">
                    <ProgressBar value={percentage(session.minutes, session.targetMinutes)} tone="sky" />
                  </div>
                </div>
              ))}
            </div>
          </Panel>
          </div>

          <div id="calendar">
          <Panel action="Open" icon={<Clock3 aria-hidden className="h-5 w-5 text-orange-600" />} title="Calendar Focus">
            <div className="grid grid-cols-7 gap-1 text-center text-xs text-ink/55">
              {Array.from({ length: 35 }, (_, index) => (
                <div className={`grid aspect-square place-items-center rounded-md ${[2, 7, 12, 18, 24].includes(index) ? "bg-forest text-white" : "bg-mist"}`} key={index}>
                  {index + 1}
                </div>
              ))}
            </div>
          </Panel>
          </div>
        </section>
      </section>
      </div>
    </AppShell>
  );
}

function Panel({
  action,
  children,
  icon,
  title
}: {
  action: string;
  children: React.ReactNode;
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <section className="rounded-lg border border-line bg-white p-5 shadow-soft">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {icon}
          <h2 className="text-lg font-semibold text-ink">{title}</h2>
        </div>
        <button type="button" className="focus-ring inline-flex h-9 items-center gap-2 rounded-md px-2 text-sm font-medium text-blue-600 hover:bg-blue-50">
          <Plus aria-hidden className="h-4 w-4" />
          {action}
        </button>
      </div>
      {children}
    </section>
  );
}

function TodayMetric({
  icon: Icon,
  label,
  progress,
  tone,
  value
}: {
  icon: typeof CheckCircle2;
  label: string;
  progress: number;
  tone: "blue" | "green" | "purple" | "orange";
  value: string;
}) {
  const styles = {
    blue: { bg: "bg-blue-50", text: "text-blue-600", bar: "bg-blue-600" },
    green: { bg: "bg-emerald-50", text: "text-emerald-600", bar: "bg-emerald-500" },
    purple: { bg: "bg-purple-50", text: "text-purple-600", bar: "bg-purple-600" },
    orange: { bg: "bg-orange-50", text: "text-orange-600", bar: "bg-orange-500" }
  }[tone];

  return (
    <section className="rounded-lg border border-line bg-white p-5 shadow-soft">
      <div className="flex items-center gap-4">
        <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-full ${styles.bg} ${styles.text}`}>
          <Icon aria-hidden className="h-6 w-6" />
        </span>
        <div className="min-w-0">
          <p className="text-xs font-medium text-ink/55">{label}</p>
          <p className="mt-1 text-xl font-semibold text-ink">{value}</p>
        </div>
      </div>
      <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-mist">
        <div className={`h-full rounded-full ${styles.bar}`} style={{ width: `${progress}%` }} />
      </div>
    </section>
  );
}

function PriorityBadge({ priority }: { priority: "Critical" | "High" | "Medium" | "Low" }) {
  const styles = {
    Critical: "bg-red-100 text-red-700",
    High: "bg-red-100 text-red-700",
    Medium: "bg-orange-100 text-orange-700",
    Low: "bg-blue-100 text-blue-700"
  };

  return <span className={`rounded-full px-3 py-1 text-xs font-semibold ${styles[priority]}`}>{priority}</span>;
}

const goalIconStyles = [
  "bg-emerald-50 text-emerald-600",
  "bg-blue-50 text-blue-600",
  "bg-purple-50 text-purple-600",
  "bg-orange-50 text-orange-600"
];

const goalProgressTones = ["forest", "sky", "coral", "gold"] as const;

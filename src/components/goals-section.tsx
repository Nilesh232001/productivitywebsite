import {
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Dumbbell,
  ListChecks,
  Plus,
  Target
} from "lucide-react";
import { createGoalWithDailyTaskFromForm } from "@/lib/actions";
import type { Goal } from "@/lib/types";
import { ProgressBar } from "@/components/ui/progress-bar";

export function GoalsSection({ goals }: { goals: Goal[] }) {
  return (
    <section className="rounded-lg border border-line bg-surface p-5 shadow-soft" id="goals">
      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex items-center gap-2">
          <Target className="h-5 w-5 text-purple-600" />
          <div>
            <h2 className="text-lg font-semibold text-ink">All Goals</h2>
            <p className="text-xs text-ink/55">Set a goal and attach a daily todo habit.</p>
          </div>
        </div>
        <GoalForm />
      </div>

      {goals.length > 0 ? (
        <div className="space-y-3">
          {goals.map((goal, index) => (
            <GoalRow goal={goal} index={index} key={goal.id} />
          ))}
        </div>
      ) : (
        <div className="grid min-h-28 place-items-center rounded-lg border border-dashed border-line bg-mist/35 px-4 text-center text-sm text-ink/55">
          No goals yet. Add a goal and optionally create its daily task.
        </div>
      )}
    </section>
  );
}

function GoalForm() {
  return (
    <form action={createGoalWithDailyTaskFromForm} className="grid w-full gap-2 sm:grid-cols-2 lg:grid-cols-[minmax(150px,1fr)_112px_minmax(150px,1fr)_88px_96px_auto]">
      <input
        className="h-9 rounded-md border border-line px-3 text-sm outline-none focus:border-purple-600"
        maxLength={120}
        name="title"
        placeholder="Goal title"
        required
      />
      <select className="h-9 rounded-md border border-line px-2 text-sm outline-none focus:border-purple-600" defaultValue="Daily" name="cadence">
        <option>Daily</option>
        <option>Weekly</option>
        <option>Monthly</option>
        <option>Yearly</option>
      </select>
      <input
        className="h-9 rounded-md border border-line px-3 text-sm outline-none focus:border-blue-500"
        maxLength={120}
        name="dailyTask"
        placeholder="Daily task, e.g. gym"
      />
      <input className="h-9 rounded-md border border-line px-2 text-sm outline-none focus:border-blue-500" name="dueDate" type="time" />
      <select className="h-9 rounded-md border border-line px-2 text-sm outline-none focus:border-blue-500" defaultValue="Medium" name="priority">
        <option>High</option>
        <option>Medium</option>
        <option>Low</option>
      </select>
      <button className="focus-ring inline-flex h-9 w-full items-center justify-center gap-1 rounded-md bg-purple-600 px-3 text-sm font-medium text-white hover:bg-purple-700 sm:col-span-2 lg:col-span-1" type="submit">
        <Plus className="h-4 w-4" />
        Add
      </button>
    </form>
  );
}

function GoalRow({ goal, index }: { goal: Goal; index: number }) {
  const icons = [Target, BookOpen, ListChecks, Dumbbell, CheckCircle2];
  const Icon = icons[index % icons.length];
  const tones = ["forest", "sky", "coral", "gold"] as const;
  const badgeStyles = ["bg-emerald-50 text-emerald-600", "bg-blue-50 text-blue-600", "bg-purple-50 text-purple-600", "bg-orange-50 text-orange-600"];

  return (
    <div className="grid min-h-14 grid-cols-[36px_1fr_minmax(120px,48%)_44px_24px] items-center gap-3">
      <div className={`grid h-9 w-9 place-items-center rounded-full ${badgeStyles[index % badgeStyles.length]}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-ink">{goal.title}</p>
        <p className="text-xs text-ink/55">{goal.cadence} Goal</p>
      </div>
      <ProgressBar value={goal.progress} tone={tones[index % tones.length]} />
      <span className="text-right text-sm font-semibold text-blue-600">{goal.progress}%</span>
      <ChevronRight className="h-4 w-4 text-ink/35" />
    </div>
  );
}

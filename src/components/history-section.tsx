"use client";

import { useMemo, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  NotebookPen,
  Timer
} from "lucide-react";
import type { HistoryDay } from "@/lib/types";
import { ProgressBar } from "@/components/ui/progress-bar";

export function HistorySection({ history }: { history: HistoryDay[] }) {
  const [activeDate, setActiveDate] = useState(history[0]?.date ?? "");

  const activeDay = useMemo(() => {
    if (!history.length) return null;
    return history.find((day) => day.date === activeDate) ?? history[0];
  }, [activeDate, history]);

  const summary = useMemo(() => {
    if (!activeDay) {
      return {
        tasksDone: 0,
        tasksTotal: 0,
        studyMinutes: 0,
        studyTarget: 0
      };
    }

    const tasksDone = activeDay.tasks.filter((task) => task.status === "Done").length;
    const tasksTotal = activeDay.tasks.length;
    const studyMinutes = activeDay.studySessions.reduce((total, session) => total + session.minutes, 0);
    const studyTarget = activeDay.studySessions.reduce((total, session) => total + session.targetMinutes, 0);

    return { tasksDone, tasksTotal, studyMinutes, studyTarget };
  }, [activeDay]);

  return (
    <section className="rounded-lg border border-line bg-surface p-5 shadow-soft" id="history">
      <div className="mb-4 flex items-center gap-2">
        <CalendarDays className="h-5 w-5 text-forest" />
        <div>
          <h2 className="text-lg font-semibold text-ink">History</h2>
          <p className="text-xs text-ink/55">Review past days and performance snapshots.</p>
        </div>
      </div>

      {history.length === 0 ? (
        <div className="grid min-h-28 place-items-center rounded-lg border border-dashed border-line bg-mist/35 px-4 text-center text-sm text-ink/55">
          No history entries yet. Add notes, tasks, or study sessions to build daily summaries.
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-[220px_1fr]">
          <div className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible">
            {history.map((day) => {
              const isActive = day.date === activeDay?.date;

              return (
                <button
                  className={`focus-ring flex shrink-0 items-center gap-2 rounded-md px-3 py-2 text-left text-sm font-medium ${
                    isActive ? "bg-forest text-white" : "bg-mist/40 text-ink/70 hover:bg-mist"
                  }`}
                  key={day.date}
                  onClick={() => setActiveDate(day.date)}
                  type="button"
                >
                  <span className="block text-xs uppercase tracking-wide opacity-80">
                    {day.label}
                  </span>
                  {typeof day.score === "number" ? (
                    <span className="ml-auto text-xs font-semibold">{day.score}%</span>
                  ) : null}
                </button>
              );
            })}
          </div>

          {activeDay ? (
            <div className="space-y-4">
              <div className="grid gap-3 lg:grid-cols-3">
                <div className="rounded-lg border border-line bg-mist/30 p-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-ink">
                    <CheckCircle2 className="h-4 w-4 text-blue-600" />
                    Tasks Completed
                  </div>
                  <p className="mt-2 text-2xl font-semibold text-ink">
                    {summary.tasksDone} / {summary.tasksTotal}
                  </p>
                </div>
                <div className="rounded-lg border border-line bg-mist/30 p-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-ink">
                    <Timer className="h-4 w-4 text-emerald-600" />
                    Study Time
                  </div>
                  <p className="mt-2 text-2xl font-semibold text-ink">
                    {(summary.studyMinutes / 60).toFixed(1)} hrs
                  </p>
                </div>
                <div className="rounded-lg border border-line bg-mist/30 p-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-ink">
                    <ClipboardList className="h-4 w-4 text-purple-600" />
                    Productivity Score
                  </div>
                  {typeof activeDay.score === "number" ? (
                    <div className="mt-3">
                      <ProgressBar label="Score" value={activeDay.score} tone="forest" />
                    </div>
                  ) : (
                    <p className="mt-2 text-sm text-ink/55">No score logged.</p>
                  )}
                </div>
              </div>

              <div className="grid gap-3 lg:grid-cols-2">
                <div className="rounded-lg border border-line bg-surface p-4">
                  <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-ink">
                    <NotebookPen className="h-4 w-4 text-gold" />
                    Targets
                  </div>
                  <p className="whitespace-pre-line text-sm text-ink/70">
                    {activeDay.targets || "No targets saved for this day."}
                  </p>
                </div>
                <div className="rounded-lg border border-line bg-surface p-4">
                  <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-ink">
                    <NotebookPen className="h-4 w-4 text-purple-600" />
                    Quick Note
                  </div>
                  <p className="whitespace-pre-line text-sm text-ink/70">
                    {activeDay.quickNote || "No notes saved for this day."}
                  </p>
                </div>
              </div>

              <div className="grid gap-3 lg:grid-cols-2">
                <div className="rounded-lg border border-line bg-surface p-4">
                  <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-ink">
                    <ClipboardList className="h-4 w-4 text-blue-600" />
                    Todo List
                  </div>
                  {activeDay.tasks.length ? (
                    <div className="space-y-2">
                      {activeDay.tasks.map((task) => (
                        <div className="flex items-center justify-between gap-3 rounded-md border border-line/60 bg-mist/20 px-3 py-2 text-sm" key={task.id}>
                          <div className="min-w-0">
                            <p className="truncate font-medium text-ink">{task.title}</p>
                            <p className="text-xs text-ink/55">{task.priority} priority</p>
                          </div>
                          <span className="text-xs font-semibold text-ink/60">{task.status}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-ink/55">No tasks logged for this day.</p>
                  )}
                </div>

                <div className="rounded-lg border border-line bg-surface p-4">
                  <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-ink">
                    <Timer className="h-4 w-4 text-emerald-600" />
                    Study Sessions
                  </div>
                  {activeDay.studySessions.length ? (
                    <div className="space-y-2">
                      {activeDay.studySessions.map((session) => (
                        <div className="flex items-center justify-between gap-3 rounded-md border border-line/60 bg-mist/20 px-3 py-2 text-sm" key={session.id}>
                          <div>
                            <p className="font-medium text-ink">{session.subject}</p>
                            <p className="text-xs text-ink/55">Target {session.targetMinutes} min</p>
                          </div>
                          <span className="text-xs font-semibold text-ink/60">{session.minutes} min</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-ink/55">No study sessions logged for this day.</p>
                  )}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      )}
    </section>
  );
}

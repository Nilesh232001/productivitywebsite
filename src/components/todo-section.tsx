"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, Clock3, ListChecks, Plus, Trash2 } from "lucide-react";
import {
  createTaskFromForm,
  deleteTaskFromForm,
  updateTaskStatusFromForm
} from "@/lib/actions";
import type { Task } from "@/lib/types";

type TodoFilter = "All" | "Pending" | "Completed";

const filters: TodoFilter[] = ["All", "Pending", "Completed"];

export function TodoSection({ tasks }: { tasks: Task[] }) {
  const [filter, setFilter] = useState<TodoFilter>("All");

  const visibleTasks = useMemo(() => {
    if (filter === "Pending") {
      return tasks.filter((task) => task.status !== "Done");
    }

    if (filter === "Completed") {
      return tasks.filter((task) => task.status === "Done");
    }

    return tasks;
  }, [filter, tasks]);

  const pendingCount = tasks.filter((task) => task.status !== "Done").length;
  const completedCount = tasks.length - pendingCount;

  return (
    <section className="rounded-lg border border-line bg-surface p-5 shadow-soft">
      <div className="mb-4 flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
        <div className="flex items-center gap-2">
          <ListChecks className="h-5 w-5 text-blue-600" />
          <div>
            <h2 className="text-lg font-semibold text-ink">Todo</h2>
            <p className="text-xs text-ink/55">
              {pendingCount} pending, {completedCount} completed
            </p>
          </div>
        </div>
        <TaskForm />
      </div>

      <div className="mb-3 flex items-center gap-2 border-b border-line pb-3 text-xs font-medium" id="tasks">
        {filters.map((item) => (
          <button
            className={`focus-ring rounded-md px-3 py-1.5 ${
              filter === item ? "bg-blue-50 text-blue-600" : "text-ink/55 hover:bg-mist hover:text-ink"
            }`}
            key={item}
            onClick={() => setFilter(item)}
            type="button"
          >
            {item}
          </button>
        ))}
      </div>

      {visibleTasks.length > 0 ? (
        <div className="space-y-1">
          {visibleTasks.map((task) => (
            <TaskRow key={task.id} task={task} />
          ))}
        </div>
      ) : (
        <div className="grid min-h-28 place-items-center rounded-lg border border-dashed border-line bg-mist/35 px-4 text-center text-sm text-ink/55">
          {filter === "Completed" ? "No completed tasks yet." : "No tasks for today yet."}
        </div>
      )}
    </section>
  );
}

function TaskForm() {
  return (
    <form action={createTaskFromForm} className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_96px_104px_auto] xl:w-auto">
      <input
        className="min-w-0 h-9 rounded-md border border-line px-3 text-sm outline-none focus:border-blue-500"
        maxLength={120}
        name="title"
        placeholder="New task"
        required
      />
      <select className="h-9 rounded-md border border-line px-2 text-sm outline-none focus:border-blue-500" defaultValue="Medium" name="priority">
        <option>High</option>
        <option>Medium</option>
        <option>Low</option>
      </select>
      <input className="min-w-0 h-9 rounded-md border border-line px-2 text-sm outline-none focus:border-blue-500" name="dueDate" type="time" />
      <button className="focus-ring inline-flex h-9 w-full items-center justify-center gap-1 rounded-md bg-blue-600 px-3 text-sm font-medium text-white hover:bg-blue-700 sm:col-span-2 xl:col-span-1 xl:w-auto" type="submit">
        <Plus className="h-4 w-4" />
        Add
      </button>
    </form>
  );
}

function TaskRow({ task }: { task: Task }) {
  const done = task.status === "Done";
  const nextStatus = done ? "Today" : "Done";

  return (
    <div className="grid min-h-12 grid-cols-[24px_1fr_auto_auto_32px] items-center gap-2 rounded-md px-1 text-sm hover:bg-mist/70 sm:grid-cols-[24px_1fr_auto_auto_auto_32px]">
      <form action={updateTaskStatusFromForm}>
        <input name="taskId" type="hidden" value={task.id} />
        <input name="status" type="hidden" value={nextStatus} />
        <button
          aria-label={done ? "Mark task pending" : "Mark task complete"}
          className={`grid h-4 w-4 place-items-center rounded border ${
            done ? "border-forest bg-forest text-white" : "border-line bg-surface hover:border-blue-500"
          }`}
          type="submit"
        >
          {done ? <CheckCircle2 className="h-3 w-3" /> : null}
        </button>
      </form>

      <div className="min-w-0">
        <p className={`truncate font-medium ${done ? "text-ink/45 line-through" : "text-ink"}`}>{task.title}</p>
        <p className="text-xs text-ink/45 sm:hidden">{task.dueDate}</p>
      </div>

      <PriorityBadge priority={task.priority} />
      <StatusBadge status={task.status} />
      <span className="hidden items-center gap-1 whitespace-nowrap text-xs text-ink/55 sm:inline-flex">
        <Clock3 className="h-3.5 w-3.5" />
        {task.dueDate}
      </span>

      <form action={deleteTaskFromForm}>
        <input name="taskId" type="hidden" value={task.id} />
        <button className="focus-ring grid h-8 w-8 place-items-center rounded-md text-ink/45 hover:bg-surface hover:text-coral" type="submit" title="Delete task">
          <Trash2 className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}

function PriorityBadge({ priority }: { priority: string }) {
  const styles: Record<string, string> = {
    Critical: "bg-coral/10 text-coral",
    High: "bg-coral/10 text-coral",
    Medium: "bg-gold/15 text-gold",
    Low: "bg-blue-50 text-blue-600"
  };

  return <span className={`rounded-full px-2 py-1 text-xs font-medium ${styles[priority] || styles.Medium}`}>{priority}</span>;
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Done: "bg-emerald-50 text-emerald-600",
    Today: "bg-sky/10 text-sky",
    "In Progress": "bg-purple-50 text-purple-600",
    Backlog: "bg-mist text-ink/60"
  };

  return <span className={`hidden rounded-full px-2 py-1 text-xs font-medium sm:inline-block ${styles[status] || styles.Today}`}>{status}</span>;
}

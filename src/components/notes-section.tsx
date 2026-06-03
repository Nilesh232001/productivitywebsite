import { NotebookPen, Save } from "lucide-react";
import {
  saveQuickNoteFromForm,
  saveTodayTargetsFromForm
} from "@/lib/actions";
import type { JournalEntry } from "@/lib/types";

const defaultTargets = [
  "Study 6 hours",
  "Complete all tasks",
  "Revise DBMS",
  "Solve 20 DSA questions",
  "Read and learn something new"
].join("\n");

export function NotesSection({ todayEntry }: { todayEntry?: JournalEntry }) {
  return (
    <section className="rounded-lg border border-line bg-surface p-5 shadow-soft" id="notes">
      <div className="mb-4 flex items-center gap-2">
        <NotebookPen className="h-5 w-5 text-purple-600" />
        <h2 className="text-lg font-semibold text-ink">Notes / Targets for Today</h2>
      </div>

      <div className="space-y-4">
        <NotepadCard
          action={saveTodayTargetsFromForm}
          defaultValue={todayEntry?.gratitude || defaultTargets}
          fieldName="targets"
          minRows={8}
          tone="gold"
          title="Today's Targets"
        />
        <NotepadCard
          action={saveQuickNoteFromForm}
          defaultValue={todayEntry?.reflection || ""}
          fieldName="quickNote"
          minRows={5}
          placeholder="Write a quick note for today..."
          tone="lavender"
          title="Quick Note"
        />
      </div>
    </section>
  );
}

function NotepadCard({
  action,
  defaultValue,
  fieldName,
  minRows,
  placeholder,
  title,
  tone
}: {
  action: (formData: FormData) => void | Promise<void>;
  defaultValue: string;
  fieldName: string;
  minRows: number;
  placeholder?: string;
  title: string;
  tone: "gold" | "lavender";
}) {
  const toneClass =
    tone === "gold"
      ? "border-gold/25 bg-gold/10 dark:border-gold/35 dark:bg-gold/12"
      : "border-gold/25 bg-gold/10 dark:border-gold/35 dark:bg-gold/12";
  const focusClass = tone === "gold" ? "focus:border-gold" : "focus:border-purple-500 dark:focus:border-purple-300";
  const buttonHoverClass = tone === "gold" ? "hover:bg-surface/70" : "hover:bg-surface/70";
  const textAreaClass =
    tone === "gold"
      ? "bg-surface/70"
      : "bg-surface/70";

  return (
    <form action={action} className={`rounded-lg border p-4 ${toneClass}`}>
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-ink">{title}</h3>
        <button className={`focus-ring inline-flex h-8 items-center gap-1 rounded-md px-2 text-xs font-medium text-blue-600 ${buttonHoverClass}`} type="submit">
          <Save className="h-3.5 w-3.5" />
          Save
        </button>
      </div>
      <textarea
        className={`min-h-28 w-full resize-y rounded-md border border-transparent px-3 py-2 text-sm leading-6 text-ink outline-none ${textAreaClass} ${focusClass}`}
        defaultValue={defaultValue}
        name={fieldName}
        placeholder={placeholder}
        rows={minRows}
      />
    </form>
  );
}

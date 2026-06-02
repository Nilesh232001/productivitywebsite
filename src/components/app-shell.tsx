import {
  BarChart3,
  BookOpen,
  CalendarDays,
  CheckSquare,
  Flame,
  Gauge,
  Home,
  NotebookPen,
  Settings,
  Target
} from "lucide-react";

const navItems = [
  { id: "home", label: "Home", icon: Home },
  { id: "dashboard", label: "Dashboard", icon: BarChart3 },
  { id: "habits", label: "Habits", icon: Flame },
  { id: "tasks", label: "Tasks", icon: CheckSquare },
  { id: "study", label: "Study", icon: BookOpen },
  { id: "goals", label: "Goals", icon: Target },
  { id: "journal", label: "Journal", icon: NotebookPen },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "calendar", label: "Calendar", icon: CalendarDays },
  { id: "settings", label: "Settings", icon: Settings }
];

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[260px_1fr]">
      <aside className="border-b border-line bg-white/92 px-4 py-4 lg:sticky lg:top-0 lg:h-screen lg:border-b-0 lg:border-r">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-md bg-forest text-white">
            <Gauge aria-hidden className="h-5 w-5" />
          </div>
          <div>
            <p className="text-lg font-semibold text-ink">Personal OS</p>
            <p className="text-xs text-ink/55">Productivity command center</p>
          </div>
        </div>
        <nav className="mt-6 flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const active = index === 0;

            return (
              <a
                className={`focus-ring flex min-h-10 shrink-0 items-center gap-3 rounded-md px-3 text-sm font-medium ${
                  active ? "bg-forest text-white" : "text-ink/70 hover:bg-mist hover:text-ink"
                }`}
                href={`#${item.id}`}
                key={item.label}
              >
                <Icon aria-hidden className="h-4 w-4" />
                <span>{item.label}</span>
              </a>
            );
          })}
        </nav>
      </aside>
      <main className="px-4 py-5 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}

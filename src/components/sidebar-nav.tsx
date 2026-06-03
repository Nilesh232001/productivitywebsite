"use client";

import { CalendarDays, CheckSquare, Home, NotebookPen, Target } from "lucide-react";
import { usePathname } from "next/navigation";

const iconMap = {
  home: Home,
  tasks: CheckSquare,
  notes: NotebookPen,
  goals: Target,
  history: CalendarDays
} as const;

type NavItem = {
  id: string;
  label: string;
  icon: keyof typeof iconMap;
  href: string;
};

export function SidebarNav({ items }: { items: readonly NavItem[] }) {
  const pathname = usePathname();

  return (
    <nav className="mt-6 flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible">
      {items.map((item) => {
        const Icon = iconMap[item.icon];
        const isHistory = item.href === "/history";
        const active = isHistory ? pathname === "/history" : pathname !== "/history" && item.id === "home";

        return (
          <a
            className={`focus-ring flex min-h-10 shrink-0 items-center gap-3 rounded-md px-3 text-sm font-medium ${
              active ? "bg-forest text-white" : "text-ink/70 hover:bg-mist hover:text-ink"
            }`}
            href={item.href}
            key={item.label}
          >
            <Icon aria-hidden className="h-4 w-4" />
            <span>{item.label}</span>
          </a>
        );
      })}
    </nav>
  );
}

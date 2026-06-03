import {
  Gauge,
  LogOut,
  User
} from "lucide-react";
import { signOut } from "@/lib/actions";
import { getProfile, getSession } from "@/lib/supabase/db";
import { SidebarNav } from "@/components/sidebar-nav";
import { ThemeToggle } from "@/components/theme-toggle";

const navItems = [
  { id: "home", label: "Home", icon: "home", href: "/#home" },
  { id: "tasks", label: "Tasks", icon: "tasks", href: "/#tasks" },
  { id: "notes", label: "Notes", icon: "notes", href: "/#notes" },
  { id: "goals", label: "Goals", icon: "goals", href: "/#goals" },
  { id: "history", label: "History", icon: "history", href: "/history" }
] as const;

async function handleSignOut() {
  "use server";
  await signOut();
}

export async function AppShell({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  const profile = await getProfile();

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[260px_1fr]">
      <aside className="border-b border-line bg-surface/92 px-4 py-4 lg:sticky lg:top-0 lg:h-screen lg:border-b-0 lg:border-r lg:flex lg:flex-col">
        <div className="flex items-start gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-md bg-forest text-white">
            <Gauge aria-hidden className="h-5 w-5" />
          </div>
          <div className="flex flex-1 items-start justify-between gap-3">
            <div>
              <p className="text-lg font-semibold text-ink">Personal OS</p>
              <p className="text-xs text-ink/55">Productivity command center</p>
            </div>
            <ThemeToggle />
          </div>
        </div>
        <SidebarNav items={navItems} />

        {/* User section at bottom */}
        <div className="mt-auto hidden border-t border-line pt-4 lg:block">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="h-8 w-8 rounded-full bg-forest/10 flex items-center justify-center">
              <User className="h-4 w-4 text-forest" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-ink truncate">
                {profile?.full_name || session?.user?.email || "User"}
              </p>
              <p className="text-xs text-ink/55 truncate">Level {profile?.level || 1}</p>
            </div>
          </div>
          {session ? (
            <form action={handleSignOut}>
              <button
                type="submit"
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-coral hover:bg-coral/10 rounded-md transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </form>
          ) : null}
        </div>
      </aside>
      <main className="px-4 py-5 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}

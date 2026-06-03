import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type StatCardProps = {
  label: string;
  value: string;
  helper: string;
  icon: LucideIcon;
  tone?: "forest" | "coral" | "gold" | "sky";
};

const tones = {
  forest: "bg-forest/10 text-forest",
  coral: "bg-coral/10 text-coral",
  gold: "bg-gold/10 text-gold",
  sky: "bg-sky/10 text-sky"
};

export function StatCard({ label, value, helper, icon: Icon, tone = "forest" }: StatCardProps) {
  return (
    <section className="rounded-lg border border-line bg-surface p-4 shadow-soft">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-ink/60">{label}</p>
          <p className="mt-2 text-3xl font-semibold tracking-normal text-ink">{value}</p>
        </div>
        <div className={cn("grid h-10 w-10 shrink-0 place-items-center rounded-md", tones[tone])}>
          <Icon aria-hidden className="h-5 w-5" />
        </div>
      </div>
      <p className="mt-3 text-sm text-ink/60">{helper}</p>
    </section>
  );
}

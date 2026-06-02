import { clamp, cn } from "@/lib/utils";

type ProgressBarProps = {
  value: number;
  label?: string;
  tone?: "forest" | "coral" | "gold" | "sky";
};

const tones = {
  forest: "bg-forest",
  coral: "bg-coral",
  gold: "bg-gold",
  sky: "bg-sky"
};

export function ProgressBar({ value, label, tone = "forest" }: ProgressBarProps) {
  const normalized = clamp(value);

  return (
    <div className="space-y-2">
      {label ? (
        <div className="flex items-center justify-between text-sm">
          <span className="text-ink/70">{label}</span>
          <span className="font-medium text-ink">{normalized}%</span>
        </div>
      ) : null}
      <div className="h-2 overflow-hidden rounded-full bg-mist">
        <div className={cn("h-full rounded-full", tones[tone])} style={{ width: `${normalized}%` }} />
      </div>
    </div>
  );
}

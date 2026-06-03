"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

const storageKey = "pos-theme";

type Theme = "light" | "dark";

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem(storageKey) as Theme | null;
    const system = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    const initial = saved ?? system;

    setTheme(initial);
    applyTheme(initial);

    if (saved) return;

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      const next = media.matches ? "dark" : "light";
      setTheme(next);
      applyTheme(next);
    };

    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, []);

  const handleToggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem(storageKey, next);
    applyTheme(next);
  };

  const label = theme === "dark" ? "Disable dark mode" : "Enable dark mode";

  if (!mounted) {
    return <div className="h-9 w-9" />;
  }

  return (
    <button
      aria-label={label}
      className="focus-ring grid h-9 w-9 place-items-center rounded-md border border-line bg-surface text-ink/70 hover:text-ink"
      onClick={handleToggle}
      type="button"
    >
      {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}

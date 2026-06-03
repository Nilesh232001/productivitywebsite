export type Priority = "Critical" | "High" | "Medium" | "Low";
export type GoalCadence = "Daily" | "Weekly" | "Monthly" | "Yearly";
export type Mood = "Focused" | "Calm" | "Tired" | "Stressed" | "Excited";
export type TaskStatus = "Backlog" | "Today" | "In Progress" | "Done";

export type Profile = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  timezone: string;
  xp: number;
  level: number;
  created_at: string;
  updated_at: string;
};

export type Habit = {
  id: string;
  name: string;
  category: string;
  cadence: "Daily" | "Weekly" | "Monthly";
  streak: number;
  completedToday: boolean;
  completionRate: number;
};

export type Task = {
  id: string;
  title: string;
  category: string;
  priority: Priority;
  status: TaskStatus;
  dueDate: string;
  tags: string[];
};

export type StudySession = {
  id: string;
  subject: string;
  minutes: number;
  targetMinutes: number;
  date: string;
};

export type Goal = {
  id: string;
  title: string;
  cadence: GoalCadence;
  progress: number;
  milestones: number;
  completedMilestones: number;
};

export type JournalEntry = {
  id: string;
  date: string;
  mood: Mood;
  gratitude: string;
  reflection: string;
};

export type HistoryDay = {
  date: string;
  label: string;
  targets: string;
  quickNote: string;
  tasks: Task[];
  studySessions: StudySession[];
  score?: number;
};

export type Achievement = {
  id: string;
  name: string;
  description: string;
  earned: boolean;
};

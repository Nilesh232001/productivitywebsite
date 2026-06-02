export type Priority = "Critical" | "High" | "Medium" | "Low";
export type GoalCadence = "Daily" | "Weekly" | "Monthly" | "Yearly";
export type Mood = "Focused" | "Calm" | "Tired" | "Stressed" | "Excited";

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
  status: "Backlog" | "Today" | "In Progress" | "Done";
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

export type Achievement = {
  id: string;
  name: string;
  description: string;
  earned: boolean;
};

import { calculateProductivityScore } from "@/lib/productivity-score";
import type { Achievement, Goal, Habit, JournalEntry, StudySession, Task } from "@/lib/types";

export const habits: Habit[] = [
  { id: "h1", name: "Morning planning", category: "Planning", cadence: "Daily", streak: 18, completedToday: true, completionRate: 91 },
  { id: "h2", name: "Deep work block", category: "Focus", cadence: "Daily", streak: 9, completedToday: true, completionRate: 84 },
  { id: "h3", name: "Read 20 pages", category: "Learning", cadence: "Daily", streak: 6, completedToday: false, completionRate: 72 },
  { id: "h4", name: "Evening review", category: "Reflection", cadence: "Daily", streak: 12, completedToday: false, completionRate: 78 }
];

export const tasks: Task[] = [
  { id: "t1", title: "Complete React Project", category: "Work", priority: "High", status: "Today", dueDate: "10:00 AM", tags: ["project"] },
  { id: "t2", title: "Study Data Structures", category: "Study", priority: "Medium", status: "Today", dueDate: "12:00 PM", tags: ["dsa"] },
  { id: "t3", title: "Read 30 pages of Book", category: "Learning", priority: "Low", status: "Today", dueDate: "02:00 PM", tags: ["reading"] },
  { id: "t4", title: "Workout", category: "Health", priority: "Low", status: "Done", dueDate: "06:00 PM", tags: ["fitness"] },
  { id: "t5", title: "Revise OS Notes", category: "Study", priority: "Medium", status: "Today", dueDate: "07:30 PM", tags: ["revision"] },
  { id: "t6", title: "Plan for Tomorrow", category: "Planning", priority: "Low", status: "Today", dueDate: "09:00 PM", tags: ["planning"] }
];

export const studySessions: StudySession[] = [
  { id: "s1", subject: "Algorithms", minutes: 85, targetMinutes: 120, date: "Mon" },
  { id: "s2", subject: "System Design", minutes: 60, targetMinutes: 90, date: "Tue" },
  { id: "s3", subject: "Mathematics", minutes: 45, targetMinutes: 60, date: "Wed" },
  { id: "s4", subject: "Writing", minutes: 35, targetMinutes: 45, date: "Thu" }
];

export const goals: Goal[] = [
  { id: "g1", title: "Crack GATE 2026", cadence: "Yearly", progress: 65, milestones: 12, completedMilestones: 8 },
  { id: "g2", title: "Complete DBMS Course", cadence: "Monthly", progress: 40, milestones: 10, completedMilestones: 4 },
  { id: "g3", title: "Finish 3 Mock Tests", cadence: "Weekly", progress: 66, milestones: 3, completedMilestones: 2 },
  { id: "g4", title: "Study 6 Hours", cadence: "Daily", progress: 75, milestones: 4, completedMilestones: 3 }
];

export const journalEntries: JournalEntry[] = [
  {
    id: "j1",
    date: "Today",
    mood: "Focused",
    gratitude: "A clear morning and enough uninterrupted time to plan.",
    reflection: "Energy was best before lunch. Keep the hardest work in that window."
  }
];

export const achievements: Achievement[] = [
  { id: "a1", name: "18-day planner", description: "Completed morning planning for 18 days.", earned: true },
  { id: "a2", name: "Focus builder", description: "Logged four deep work blocks this week.", earned: true },
  { id: "a3", name: "Streak shield", description: "Recover a habit before midnight.", earned: false }
];

export const productivityTrend = [
  { day: "Mon", score: 72, study: 85 },
  { day: "Tue", score: 78, study: 60 },
  { day: "Wed", score: 69, study: 45 },
  { day: "Thu", score: 84, study: 35 },
  { day: "Fri", score: 81, study: 95 },
  { day: "Sat", score: 88, study: 120 },
  { day: "Sun", score: 76, study: 55 }
];

const completedHabits = habits.filter((habit) => habit.completedToday).length;
const completedTasks = tasks.filter((task) => task.status === "Done").length;
const studyMinutes = studySessions.reduce((total, session) => total + session.minutes, 0);
const studyTargets = studySessions.reduce((total, session) => total + session.targetMinutes, 0);

export const todayScore = calculateProductivityScore({
  habitCompletion: (completedHabits / habits.length) * 100,
  taskCompletion: (completedTasks / tasks.length) * 100,
  studyProgress: (studyMinutes / studyTargets) * 100,
  goalProgress: Math.round(goals.reduce((total, goal) => total + goal.progress, 0) / goals.length),
  journalCompletion: journalEntries.length > 0 ? 100 : 0
});

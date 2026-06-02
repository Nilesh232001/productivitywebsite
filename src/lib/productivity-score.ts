import { clamp } from "@/lib/utils";

export type ProductivityScoreInput = {
  habitCompletion: number;
  taskCompletion: number;
  studyProgress: number;
  goalProgress: number;
  journalCompletion: number;
};

const weights = {
  habitCompletion: 0.3,
  taskCompletion: 0.3,
  studyProgress: 0.2,
  goalProgress: 0.1,
  journalCompletion: 0.1
} satisfies Record<keyof ProductivityScoreInput, number>;

export function calculateProductivityScore(input: ProductivityScoreInput) {
  const score = Object.entries(weights).reduce((total, [key, weight]) => {
    const value = input[key as keyof ProductivityScoreInput];
    return total + clamp(value) * weight;
  }, 0);

  return Math.round(score);
}

// Progressive Overload Recommendation Engine
import { WeightRecommendation, WorkoutLogEntry, LoggedSet, ExerciseWeightHistory } from '@/lib/database/types';
import { getWorkout, getLastCompletedWorkout, getSettings } from '@/lib/storage/storage';

/**
 * Gets weight recommendation based on the last session for the SAME workout type
 *
 * Rules:
 * - If user achieved 10 or more reps at their max weight last session: suggest +2.5 kg (progressive overload)
 * - If user achieved less than 10 reps: suggest same weight
 * - If no previous data: return no-data
 *
 * @param exerciseId - The exercise ID
 * @param repRange - Target rep range [min, max]
 * @param workoutType - The workout type (e.g., 'upper', 'lower', 'push', 'pull', 'legs')
 * @returns WeightRecommendation with action and suggested weight
 */
export function getWeightRecommendation(
  exerciseId: string,
  repRange: [number, number],
  workoutType?: string
): WeightRecommendation {
  const settings = getSettings();

  // Try to get data from per-workout-type exercise weights
  if (workoutType && settings?.exerciseWeights?.[workoutType]?.[exerciseId]) {
    const history = settings.exerciseWeights[workoutType][exerciseId];
    return calculateRecommendationFromHistory(history, repRange);
  }

  // Fallback: try last rotation's exercises
  const lastRotationExercises = settings?.lastRotationExercises || {};
  const lastRotationSets = lastRotationExercises[exerciseId];

  if (lastRotationSets && lastRotationSets.length > 0) {
    return calculateRecommendation(lastRotationSets, repRange);
  }

  // Fallback: check last completed workout
  const lastWorkout = getLastCompletedWorkout();
  if (!lastWorkout) {
    return { action: 'no-data', suggestedWeight: null };
  }

  const lastExerciseLog = lastWorkout.exercises.find((e) => e.exerciseId === exerciseId);
  if (!lastExerciseLog) {
    return { action: 'no-data', suggestedWeight: null };
  }

  return calculateRecommendation(lastExerciseLog.sets, repRange);
}

/**
 * Calculate recommendation from exercise weight history
 */
function calculateRecommendationFromHistory(
  history: { weight: number; reps: number; lastSessionDate: string },
  _repRange: [number, number]
): WeightRecommendation {
  const REPS_THRESHOLD = 10;

  if (history.reps >= REPS_THRESHOLD) {
    return {
      action: 'increase',
      suggestedWeight: Math.round((history.weight + 2.5) * 2) / 2,
      previousWeight: history.weight,
      previousReps: history.reps,
    };
  } else {
    return {
      action: 'maintain',
      suggestedWeight: history.weight,
      previousWeight: history.weight,
      previousReps: history.reps,
    };
  }
}

/**
 * Helper function to calculate recommendation from sets
 *
 * Simple progressive overload rule:
 * - If user achieved 10 or more reps at their max weight: suggest +2.5 kg
 * - If user achieved less than 10 reps: suggest same weight
 */
function calculateRecommendation(
  sets: LoggedSet[],
  _repRange: [number, number]
): WeightRecommendation {
  // Find max weight and max reps from completed working sets
  const completedWorkingSets = sets.filter((s) => s.completed && !s.isWarmup);
  if (completedWorkingSets.length === 0) {
    return { action: 'no-data', suggestedWeight: null };
  }

  // Get the maximum weight used
  const maxWeight = Math.max(...completedWorkingSets.map((s) => s.weight));
  
  // Get the maximum reps achieved at that max weight
  const setsAtMaxWeight = completedWorkingSets.filter((s) => s.weight === maxWeight);
  const maxRepsAtMaxWeight = Math.max(...setsAtMaxWeight.map((s) => s.reps));

  // Progressive overload: if user hit 10 or more reps, increase weight
  const REPS_THRESHOLD = 10;

  if (maxRepsAtMaxWeight >= REPS_THRESHOLD) {
    // Achieved 10+ reps - increase weight by 2.5 kg for progressive overload
    return {
      action: 'increase',
      suggestedWeight: Math.round((maxWeight + 2.5) * 2) / 2, // Round to nearest 0.5
      previousWeight: maxWeight,
      previousReps: maxRepsAtMaxWeight,
    };
  } else {
    // Less than 10 reps - stay at same weight
    return {
      action: 'maintain',
      suggestedWeight: maxWeight,
      previousWeight: maxWeight,
      previousReps: maxRepsAtMaxWeight,
    };
  }
}

/**
 * Gets the last session's best performance for an exercise within a specific workout type
 * Returns a formatted string for display in kg
 */
export function getLastSessionPerformance(
  exerciseId: string,
  workoutType?: string
): string | null {
  const settings = getSettings();

  // Try to get data from per-workout-type exercise weights
  if (workoutType && settings?.exerciseWeights?.[workoutType]?.[exerciseId]) {
    const history = settings.exerciseWeights[workoutType][exerciseId];
    return `${history.weight} kg × ${history.reps} reps`;
  }

  // Fallback: try last rotation's exercises
  const lastRotationExercises = settings?.lastRotationExercises || {};
  const lastRotationSets = lastRotationExercises[exerciseId];

  if (lastRotationSets && lastRotationSets.length > 0) {
    return formatPerformance(lastRotationSets);
  }

  // Fallback: check last completed workout
  const lastWorkout = getLastCompletedWorkout();
  if (!lastWorkout) return null;

  const lastExerciseLog = lastWorkout.exercises.find((e) => e.exerciseId === exerciseId);
  if (!lastExerciseLog) return null;

  return formatPerformance(lastExerciseLog.sets);
}

/**
 * Helper function to format performance display
 */
function formatPerformance(sets: LoggedSet[]): string | null {
  const completedWorkingSets = sets.filter((s) => s.completed && !s.isWarmup);
  if (completedWorkingSets.length === 0) return null;

  const maxWeight = Math.max(...completedWorkingSets.map((s) => s.weight));
  const setsAtMaxWeight = completedWorkingSets.filter((s) => s.weight === maxWeight);
  const maxReps = Math.max(...setsAtMaxWeight.map((s) => s.reps));

  return `${maxWeight} kg × ${maxReps} reps`;
}

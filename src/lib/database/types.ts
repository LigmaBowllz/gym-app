// Core TypeScript Types for Gym Tracker App

// Intensity type for last set
export type IntensityTarget =
  | { type: 'rpe'; value: number }
  | { type: 'failure' }
  | { type: 'myo-reps'; activationReps: number; miniSets: number }
  | { type: 'failure-with-llps'; description?: string }  // Failure + LLPs (Extend set)
  | { type: 'static-stretch'; duration: number };  // Static Stretch (seconds)

// Exercise definition
export interface Exercise {
  id: string;
  name: string;
  warmupSets: [number, number];  // e.g., [1, 2] means 1-2 warm-up sets
  workingSets: number;
  repRange: [number, number];  // e.g., [8, 10]
  earlySetRpe: number;         // RPE for all sets except last
  lastSetIntensity: IntensityTarget;
  notes?: string;
}

// Workout day definition
export interface WorkoutDay {
  id: string;
  name: string;
  muscleGroup: 'upper' | 'lower' | 'pull' | 'push' | 'legs';
  exercises: Exercise[];
}

// The 5-day workout cycle order
export const WORKOUT_CYCLE: string[] = ['upper', 'lower', 'pull', 'push', 'legs'];

// User's logged set
export interface LoggedSet {
  weight: number;       // in kg
  reps: number;
  completed: boolean;
  isWarmup: boolean;
}

// User's workout log entry
export interface WorkoutLogEntry {
  exerciseId: string;
  sets: LoggedSet[];
  plannedWorkingWeight?: number;
}

// User's workout session
export interface WorkoutSession {
  date: string;         // ISO date string (YYYY-MM-DD)
  dayId: string;        // Which day of the cycle was done
  exercises: WorkoutLogEntry[];
  completed: boolean;
  completedAt?: string;
}

// Per-exercise weight history for a specific workout type
export interface ExerciseWeightHistory {
  [exerciseId: string]: {
    weight: number;       // Last weight used (kg)
    reps: number;         // Last reps achieved
    lastSessionDate: string; // ISO date string of last session
  };
}

// User settings
export interface UserSettings {
  onboardingComplete: boolean;
  lastWorkoutDate: string | null;  // Track the last date a workout was completed
  currentDayIndex: number;         // Index in WORKOUT_CYCLE (0-4)
  rotationCount: number;           // Number of completed rotations
  lastRotationExercises: Record<string, LoggedSet[]>; // Last rotation's exercise data for recommendations
  lastSession: string | null;      // Last accessed workout type (e.g., 'upper', 'lower', etc.)
  exerciseWeights: Record<string, ExerciseWeightHistory>; // Per-workout-type exercise weight tracking
}

// Storage structure
export interface AppStorage {
  settings: UserSettings;
  workouts: Record<string, WorkoutSession>;  // key: date string (YYYY-MM-DD)
}

// Warm-up set calculation result
export interface WarmUpSet {
  weight: number;
  reps: string;
}

// Weight recommendation result
export interface WeightRecommendation {
  action: 'increase' | 'maintain' | 'no-data';
  suggestedWeight: number | null;
  previousWeight?: number;
  previousReps?: number;
}

// Day status for dashboard
export type DayStatus = 'completed' | 'available' | 'locked' | 'rest';


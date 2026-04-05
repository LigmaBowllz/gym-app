// Storage utilities for localStorage persistence
import { UserSettings, WorkoutSession } from '@/lib/database/types';

const SETTINGS_KEY = 'gym-tracker-settings';
const WORKOUTS_KEY = 'gym-tracker-workouts';
const VERSION_KEY = 'gym-tracker-version';
const CURRENT_VERSION = '2.0.0';

// Settings storage
export function getSettings(): UserSettings | null {
  try {
    const data = localStorage.getItem(SETTINGS_KEY);
    if (!data) return null;
    return JSON.parse(data) as UserSettings;
  } catch (error) {
    console.error('Error reading settings:', error);
    return null;
  }
}

export function saveSettings(settings: UserSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    localStorage.setItem(VERSION_KEY, CURRENT_VERSION);
  } catch (error) {
    console.error('Error saving settings:', error);
  }
}

// Workout storage
export function getWorkouts(): Record<string, WorkoutSession> {
  try {
    const data = localStorage.getItem(WORKOUTS_KEY);
    if (!data) return {};
    return JSON.parse(data) as Record<string, WorkoutSession>;
  } catch (error) {
    console.error('Error reading workouts:', error);
    return {};
  }
}

export function getWorkout(dateKey: string): WorkoutSession | null {
  try {
    const workouts = getWorkouts();
    return workouts[dateKey] || null;
  } catch (error) {
    console.error('Error reading workout:', error);
    return null;
  }
}

export function saveWorkout(dateKey: string, session: WorkoutSession): void {
  try {
    const workouts = getWorkouts();
    workouts[dateKey] = session;
    localStorage.setItem(WORKOUTS_KEY, JSON.stringify(workouts));
  } catch (error) {
    console.error('Error saving workout:', error);
  }
}

export function deleteWorkout(dateKey: string): void {
  try {
    const workouts = getWorkouts();
    delete workouts[dateKey];
    localStorage.setItem(WORKOUTS_KEY, JSON.stringify(workouts));
  } catch (error) {
    console.error('Error deleting workout:', error);
  }
}

// Get workout key format: YYYY-MM-DD (date string)
export function getDateKey(date: Date = new Date()): string {
  return date.toISOString().split('T')[0];
}

// Get all workouts sorted by date
export function getWorkoutHistory(): WorkoutSession[] {
  const workouts = getWorkouts();
  return Object.values(workouts)
    .filter(w => w.completed)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

// Get last completed workout
export function getLastCompletedWorkout(): WorkoutSession | null {
  const history = getWorkoutHistory();
  return history.length > 0 ? history[0] : null;
}

// Clear all data (for testing/reset)
export function clearAllData(): void {
  try {
    localStorage.removeItem(SETTINGS_KEY);
    localStorage.removeItem(WORKOUTS_KEY);
    localStorage.removeItem(VERSION_KEY);
  } catch (error) {
    console.error('Error clearing data:', error);
  }
}

// Get storage size (for debugging)
export function getStorageSize(): number {
  let total = 0;
  for (let key in localStorage) {
    if (localStorage.hasOwnProperty(key) && key.startsWith('gym-tracker')) {
      total += localStorage[key].length + key.length;
    }
  }
  return total;
}

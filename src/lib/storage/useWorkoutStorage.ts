// Custom hook for workout storage with React state synchronization
import { useState, useEffect, useCallback } from 'react';
import {
  UserSettings,
  WorkoutSession,
  WorkoutLogEntry,
  LoggedSet,
  WORKOUT_CYCLE,
} from '@/lib/database/types';
import {
  getSettings,
  saveSettings,
  getWorkout,
  saveWorkout,
  getDateKey,
} from '@/lib/storage/storage';

// Default settings
const defaultSettings: UserSettings = {
  onboardingComplete: false,
  lastWorkoutDate: null,
  currentDayIndex: 0,
  rotationCount: 0,
  lastRotationExercises: {},
  lastSession: null,
  exerciseWeights: {},
};

// Hook for user settings
export function useSettings() {
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const stored = getSettings();
    if (stored) {
      setSettings(stored);
    }
    setIsLoading(false);
  }, [refreshKey]);

  const refreshSettings = useCallback(() => {
    const stored = getSettings();
    if (stored) {
      setSettings(stored);
    }
  }, []);

  const updateSettings = useCallback((updates: Partial<UserSettings>) => {
    setSettings((prev: UserSettings) => {
      const newSettings = { ...prev, ...updates };
      saveSettings(newSettings);
      return newSettings;
    });
  }, []);

  const completeOnboarding = useCallback(() => {
    updateSettings({ onboardingComplete: true });
  }, [updateSettings]);

  return {
    settings,
    isLoading,
    updateSettings,
    completeOnboarding,
    refreshSettings,
  };
}

// Hook for workout session management
export function useWorkoutSession(dateKey: string, dayId: string) {
  const [session, setSession] = useState<WorkoutSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = getWorkout(dateKey);
    if (stored) {
      setSession(stored);
    } else {
      setSession(null);
    }
    setIsLoading(false);
  }, [dateKey]);

  const createSession = useCallback(() => {
    const newSession: WorkoutSession = {
      date: new Date().toISOString(),
      dayId,
      exercises: [],
      completed: false,
    };
    setSession(newSession);
    saveWorkout(dateKey, newSession);
    return newSession;
  }, [dayId, dateKey]);

  const updateSession = useCallback(
    (updates: Partial<WorkoutSession>) => {
      setSession((prev: WorkoutSession | null) => {
        if (!prev) return null;
        const newSession = { ...prev, ...updates };
        saveWorkout(dateKey, newSession);
        return newSession;
      });
    },
    [dateKey]
  );

  // Save all exercises at once
  const saveExercises = useCallback(
    (exercises: WorkoutLogEntry[]) => {
      setSession((prev: WorkoutSession | null) => {
        if (!prev) return null;
        const newSession = { ...prev, exercises };
        saveWorkout(dateKey, newSession);
        return newSession;
      });
    },
    [dateKey]
  );

  const completeWorkout = useCallback(
    (updateSettings?: boolean, exercises?: WorkoutLogEntry[], workoutType?: string) => {
      updateSession({
        completed: true,
        completedAt: new Date().toISOString(),
      });

      // Update settings to advance to next workout day
      if (updateSettings) {
        const settings = getSettings();
        if (settings) {
          const currentIndex = settings.currentDayIndex ?? 0;
          const nextIndex = (currentIndex + 1) % WORKOUT_CYCLE.length;
          
          // Check if we just completed the last day of the rotation (legs)
          const isCompletingRotation = currentIndex === WORKOUT_CYCLE.length - 1;
          
          // Build updated rotation exercises map
          const currentRotationExercises = { ...(settings.lastRotationExercises || {}) };
          
          // Build updated exercise weights per workout type
          const currentExerciseWeights = { ...(settings.exerciseWeights || {}) };
          
          // Store current workout's exercise data for future recommendations
          if (exercises && exercises.length > 0 && workoutType) {
            // Update rotation exercises
            exercises.forEach((exercise) => {
              currentRotationExercises[exercise.exerciseId] = exercise.sets;
              
              // Find the max weight and reps from completed working sets
              const completedWorkingSets = exercise.sets.filter((s) => s.completed && !s.isWarmup);
              if (completedWorkingSets.length > 0) {
                const maxWeight = Math.max(...completedWorkingSets.map((s) => s.weight));
                const setsAtMaxWeight = completedWorkingSets.filter((s) => s.weight === maxWeight);
                const maxReps = Math.max(...setsAtMaxWeight.map((s) => s.reps));
                
                // Initialize workout type weights if not exists
                if (!currentExerciseWeights[workoutType]) {
                  currentExerciseWeights[workoutType] = {};
                }
                
                // Update exercise weight history for this workout type
                currentExerciseWeights[workoutType][exercise.exerciseId] = {
                  weight: maxWeight,
                  reps: maxReps,
                  lastSessionDate: new Date().toISOString(),
                };
              }
            });
          }
          
          saveSettings({
            ...settings,
            lastWorkoutDate: dateKey,
            currentDayIndex: isCompletingRotation ? 0 : nextIndex,
            rotationCount: isCompletingRotation ? (settings.rotationCount || 0) + 1 : (settings.rotationCount || 0),
            lastRotationExercises: currentRotationExercises,
            lastSession: workoutType || null,
            exerciseWeights: currentExerciseWeights,
          });
        }
      }
    },
    [updateSession, dateKey]
  );

  return {
    session,
    isLoading,
    createSession,
    updateSession,
    saveExercises,
    completeWorkout,
  };
}

// Hook to update last session (when user clicks on a workout)
export function useLastSession() {
  const updateLastSession = useCallback((workoutType: string) => {
    const settings = getSettings();
    if (settings) {
      saveSettings({
        ...settings,
        lastSession: workoutType,
      });
    }
  }, []);

  return { updateLastSession };
}

// Hook to get day completion status for a specific date
export function useDayStatus(dateKey: string): 'completed' | 'available' {
  const [status, setStatus] = useState<'completed' | 'available'>('available');

  useEffect(() => {
    const workout = getWorkout(dateKey);

    if (workout?.completed) {
      setStatus('completed');
    } else {
      setStatus('available');
    }
  }, [dateKey]);

  return status;
}

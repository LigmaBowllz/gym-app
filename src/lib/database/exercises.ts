import { WorkoutDay, WORKOUT_CYCLE } from './types';

// Helper to create intensity targets
const rpe = (value: number) => ({ type: 'rpe' as const, value });
const failure = { type: 'failure' as const };
const failureWithLLPs = (description?: string) => ({ type: 'failure-with-llps' as const, description });
const staticStretch = (duration: number) => ({ type: 'static-stretch' as const, duration });
const myoReps = (activationReps: number, miniSets: number) => ({ type: 'myo-reps' as const, activationReps, miniSets });

// Helper to parse warm-up range string like "2-4" into tuple [2, 4]
const warmup = (range: string): [number, number] => {
  const [min, max] = range.split('-').map(Number);
  return [min, max ?? min];
};

// ============================================
// UPPER DAY
// ============================================
export const upperDay: WorkoutDay = {
  id: 'upper',
  name: 'Upper',
  muscleGroup: 'upper',
  exercises: [
    {
      id: 'incline-db-press',
      name: "45° Incline DB Press",
      warmupSets: [2, 3],
      workingSets: 4,
      repRange: [8, 12],
      earlySetRpe: 8,
      lastSetIntensity: failure,
    },
    {
      id: 'pec-deck',
      name: 'Pec Deck',
      warmupSets: [1, 2],
      workingSets: 3,
      repRange: [10, 15],
      earlySetRpe: 8,
      lastSetIntensity: failure,
    },
    {
      id: 'dual-handle-lat-pulldown',
      name: 'Dual-Handle Lat Pulldown',
      warmupSets: [1, 2],
      workingSets: 3,
      repRange: [10, 12],
      earlySetRpe: 8,
      lastSetIntensity: failure,
    },
    {
      id: 'high-cable-lateral-raise',
      name: 'High-Cable Lateral Raise',
      warmupSets: [1, 2],
      workingSets: 3,
      repRange: [12, 15],
      earlySetRpe: 8,
      lastSetIntensity: failure,
    },
    {
      id: 'smith-machine-row',
      name: 'Smith Machine Row',
      warmupSets: [1, 2],
      workingSets: 3,
      repRange: [8, 12],
      earlySetRpe: 8,
      lastSetIntensity: failure,
    },
    {
      id: 'overhead-cable-triceps-extension',
      name: 'Overhead Cable Triceps Extension (Bar)',
      warmupSets: [1, 1],
      workingSets: 3,
      repRange: [10, 15],
      earlySetRpe: 8,
      lastSetIntensity: failure,
    },
    {
      id: 'bayesian-cable-curl',
      name: 'Bayesian Cable Curl',
      warmupSets: [1, 1],
      workingSets: 3,
      repRange: [10, 15],
      earlySetRpe: 8,
      lastSetIntensity: failure,
    },
  ],
};

// ============================================
// LOWER DAY
// ============================================
export const lowerDay: WorkoutDay = {
  id: 'lower',
  name: 'Lower',
  muscleGroup: 'lower',
  exercises: [
    {
      id: 'lying-leg-curl',
      name: 'Lying Leg Curl',
      warmupSets: [2, 2],
      workingSets: 2,
      repRange: [10, 15],
      earlySetRpe: 8,
      lastSetIntensity: failureWithLLPs('Extend set'),
    },
    {
      id: 'smith-machine-squat',
      name: 'Smith Machine Squat',
      warmupSets: [2, 4],
      workingSets: 3,
      repRange: [8, 12],
      earlySetRpe: 8,
      lastSetIntensity: failure,
    },
    {
      id: 'barbell-rdl',
      name: 'Barbell RDL',
      warmupSets: [2, 4],
      workingSets: 3,
      repRange: [8, 12],
      earlySetRpe: 8,
      lastSetIntensity: failure,
    },
    {
      id: 'leg-extension',
      name: 'Leg Extension',
      warmupSets: [1, 2],
      workingSets: 2,
      repRange: [12, 15],
      earlySetRpe: 8,
      lastSetIntensity: failure,
    },
    {
      id: 'standing-calf-raise',
      name: 'Standing Calf Raise',
      warmupSets: [1, 2],
      workingSets: 2,
      repRange: [10, 15],
      earlySetRpe: 8,
      lastSetIntensity: staticStretch(30),
    },
    {
      id: 'cable-crunch',
      name: 'Cable Crunch',
      warmupSets: [1, 1],
      workingSets: 2,
      repRange: [10, 15],
      earlySetRpe: 8,
      lastSetIntensity: failure,
    },
  ],
};

// ============================================
// PULL DAY
// ============================================
export const pullDay: WorkoutDay = {
  id: 'pull',
  name: 'Pull',
  muscleGroup: 'pull',
  exercises: [
    {
      id: 'neutral-grip-lat-pulldown',
      name: 'Neutral-Grip Lat Pulldown',
      warmupSets: [2, 3],
      workingSets: 2,
      repRange: [8, 10],
      earlySetRpe: 8,
      lastSetIntensity: failure,
    },
    {
      id: 'chest-supported-machine-row',
      name: 'Chest-Supported Machine Row',
      warmupSets: [2, 3],
      workingSets: 3,
      repRange: [8, 10],
      earlySetRpe: 8,
      lastSetIntensity: failure,
    },
    {
      id: 'neutral-grip-seated-cable-row',
      name: 'Neutral-Grip Seated Cable Row',
      warmupSets: [1, 2],
      workingSets: 2,
      repRange: [10, 12],
      earlySetRpe: 8,
      lastSetIntensity: failureWithLLPs('Extend set'),
    },
    {
      id: 'cable-rear-delt-flye',
      name: "1-Arm 45° Cable Rear Delt Flye",
      warmupSets: [1, 2],
      workingSets: 2,
      repRange: [10, 12],
      earlySetRpe: 8,
      lastSetIntensity: myoReps(10, 3),
    },
    {
      id: 'machine-shrug',
      name: 'Machine Shrug',
      warmupSets: [2, 3],
      workingSets: 2,
      repRange: [10, 12],
      earlySetRpe: 8,
      lastSetIntensity: failure,
    },
    {
      id: 'ez-bar-cable-curl',
      name: 'EZ-Bar Cable Curl',
      warmupSets: [1, 1],
      workingSets: 2,
      repRange: [10, 12],
      earlySetRpe: 8,
      lastSetIntensity: failure,
    },
    {
      id: 'machine-preacher-curl',
      name: 'Machine Preacher Curl',
      warmupSets: [1, 1],
      workingSets: 1,
      repRange: [12, 15],
      earlySetRpe: 8,
      lastSetIntensity: myoReps(12, 3),
    },
  ],
};

// ============================================
// PUSH DAY
// ============================================
export const pushDay: WorkoutDay = {
  id: 'push',
  name: 'Push',
  muscleGroup: 'push',
  exercises: [
    {
      id: 'machine-chest-press',
      name: 'Machine Chest Press',
      warmupSets: [2, 4],
      workingSets: 4,
      repRange: [8, 12],
      earlySetRpe: 8,
      lastSetIntensity: failure,
    },
    {
      id: 'seated-db-shoulder-press',
      name: 'Seated DB Shoulder Press',
      warmupSets: [2, 3],
      workingSets: 3,
      repRange: [8, 12],
      earlySetRpe: 8,
      lastSetIntensity: failure,
    },
    {
      id: 'bottom-half-cable-flye',
      name: 'Bottom-Half Seated Cable Flye',
      warmupSets: [1, 2],
      workingSets: 3,
      repRange: [12, 15],
      earlySetRpe: 8,
      lastSetIntensity: failure,
    },
    {
      id: 'high-cable-lateral-raise-push',
      name: 'High-Cable Lateral Raise',
      warmupSets: [1, 1],
      workingSets: 3,
      repRange: [12, 15],
      earlySetRpe: 8,
      lastSetIntensity: failure,
    },
    {
      id: 'ez-bar-skull-crusher',
      name: 'EZ-Bar Skull Crusher',
      warmupSets: [1, 1],
      workingSets: 3,
      repRange: [10, 15],
      earlySetRpe: 8,
      lastSetIntensity: failure,
    },
    {
      id: 'triceps-pressdown-bar',
      name: 'Triceps Pressdown (Bar)',
      warmupSets: [1, 1],
      workingSets: 3,
      repRange: [10, 15],
      earlySetRpe: 8,
      lastSetIntensity: failure,
    },
  ],
};

// ============================================
// LEGS DAY
// ============================================
export const legsDay: WorkoutDay = {
  id: 'legs',
  name: 'Legs',
  muscleGroup: 'legs',
  exercises: [
    {
      id: 'hack-squat',
      name: 'Hack Squat',
      warmupSets: [2, 4],
      workingSets: 4,
      repRange: [8, 12],
      earlySetRpe: 8,
      lastSetIntensity: failure,
    },
    {
      id: 'seated-leg-curl',
      name: 'Seated Leg Curl',
      warmupSets: [1, 2],
      workingSets: 4,
      repRange: [10, 15],
      earlySetRpe: 8,
      lastSetIntensity: failure,
    },
    {
      id: 'walking-lunge',
      name: 'Walking Lunge',
      warmupSets: [2, 3],
      workingSets: 2,
      repRange: [10, 15],
      earlySetRpe: 8,
      lastSetIntensity: failure,
    },
    {
      id: 'leg-extension-legs',
      name: 'Leg Extension',
      warmupSets: [1, 2],
      workingSets: 3,
      repRange: [12, 15],
      earlySetRpe: 8,
      lastSetIntensity: failure,
    },
    {
      id: 'machine-hip-adduction',
      name: 'Machine Hip Adduction',
      warmupSets: [1, 2],
      workingSets: 3,
      repRange: [12, 15],
      earlySetRpe: 8,
      lastSetIntensity: failure,
    },
    {
      id: 'machine-hip-abduction',
      name: 'Machine Hip Abduction',
      warmupSets: [1, 2],
      workingSets: 3,
      repRange: [12, 15],
      earlySetRpe: 8,
      lastSetIntensity: failure,
    },
    {
      id: 'standing-calf-raise',
      name: 'Standing Calf Raise',
      warmupSets: [1, 2],
      workingSets: 3,
      repRange: [10, 15],
      earlySetRpe: 8,
      lastSetIntensity: failure,
    },
  ],
};

// ============================================
// WORKOUT CYCLE CONFIGURATION
// ============================================

// Map of day ID to workout day
export const workoutDays: Record<string, WorkoutDay> = {
  upper: upperDay,
  lower: lowerDay,
  pull: pullDay,
  push: pushDay,
  legs: legsDay,
};

// Helper to get day by ID
export function getWorkoutDayById(id: string): WorkoutDay | undefined {
  return workoutDays[id];
}

// Helper to get all workout days in cycle order
export function getWorkoutCycle(): WorkoutDay[] {
  return WORKOUT_CYCLE.map(id => workoutDays[id]);
}

// Helper to get the next day in the cycle
export function getNextDayId(currentDayId: string | null): string {
  if (!currentDayId) return WORKOUT_CYCLE[0];
  const currentIndex = WORKOUT_CYCLE.indexOf(currentDayId);
  if (currentIndex === -1) return WORKOUT_CYCLE[0];
  return WORKOUT_CYCLE[(currentIndex + 1) % WORKOUT_CYCLE.length];
}

// Helper to get today's recommended workout
export function getTodaysWorkout(lastWorkoutDate: string | null, currentDayIndex: number): WorkoutDay {
  // Ensure index is valid
  const safeIndex = (currentDayIndex >= 0 && currentDayIndex < WORKOUT_CYCLE.length)
    ? currentDayIndex
    : 0;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (!lastWorkoutDate) {
    return workoutDays[WORKOUT_CYCLE[safeIndex]];
  }
  
  const lastDate = new Date(lastWorkoutDate);
  lastDate.setHours(0, 0, 0, 0);
  
  const diffDays = Math.floor((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
  
  // If it's the same day, show the same workout
  if (diffDays === 0) {
    return workoutDays[WORKOUT_CYCLE[safeIndex]];
  }
  
  // If a day has passed, advance to next workout
  const nextIndex = (safeIndex + 1) % WORKOUT_CYCLE.length;
  return workoutDays[WORKOUT_CYCLE[nextIndex]];
}

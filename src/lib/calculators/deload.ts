// Intensity formatting utilities
import { Exercise } from '@/lib/database/types';

/**
 * Formats the intensity target for display
 */
export function formatIntensity(intensity: Exercise['lastSetIntensity']): string {
  switch (intensity.type) {
    case 'rpe':
      return `RPE ${intensity.value}`;
    case 'failure':
      return 'Failure';
    case 'myo-reps':
      return `Myo-reps (${intensity.activationReps}+${intensity.miniSets}×${intensity.miniSets})`;
    case 'failure-with-llps':
      return intensity.description ? `Failure + LLPs (${intensity.description})` : 'Failure + LLPs';
    case 'static-stretch':
      return `Static Stretch (${intensity.duration}s)`;
    default:
      const _exhaustiveCheck: never = intensity;
      return `Unknown intensity`;
  }
}

/**
 * Gets the effective RPE for an exercise
 */
export function getEffectiveRpe(
  exercise: Exercise,
  isLastSet: boolean = false
): string {
  if (isLastSet) {
    return formatIntensity(exercise.lastSetIntensity);
  }

  return `RPE ${exercise.earlySetRpe}`;
}

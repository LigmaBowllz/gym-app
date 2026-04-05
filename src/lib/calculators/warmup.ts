// Warm-Up Calculator - Implements exact protocol from Jeff Nippard's system
import { WarmUpSet } from '@/lib/database/types';

/**
 * Rounds a number to the nearest 2.5 kg
 */
export function roundToNearest2_5(weight: number): number {
  return Math.round(weight / 2.5) * 2.5;
}

/**
 * Calculates warm-up sets based on the exact protocol:
 * - 1 warm-up set: 60% for 6-10 reps
 * - 2 warm-up sets: 50% for 6-10, 70% for 4-6
 * - 3 warm-up sets: 45% for 6-10, 65% for 4-6, 85% for 3-4
 * - 4 warm-up sets: 45% for 6-10, 60% for 4-6, 75% for 3-5, 85% for 2-4
 * 
 * @param workingWeight - The planned working weight in kg
 * @param warmupSetsRequired - Number of warm-up sets (0-4)
 * @returns Array of warm-up sets with weight and rep targets
 */
export function calculateWarmUpSets(
  workingWeight: number,
  warmupSetsRequired: number
): WarmUpSet[] {
  if (warmupSetsRequired === 0 || workingWeight <= 0) {
    return [];
  }

  const warmUpSets: WarmUpSet[] = [];

  switch (warmupSetsRequired) {
    case 1:
      warmUpSets.push({
        weight: roundToNearest2_5(workingWeight * 0.60),
        reps: '6-10',
      });
      break;

    case 2:
      warmUpSets.push({
        weight: roundToNearest2_5(workingWeight * 0.50),
        reps: '6-10',
      });
      warmUpSets.push({
        weight: roundToNearest2_5(workingWeight * 0.70),
        reps: '4-6',
      });
      break;

    case 3:
      warmUpSets.push({
        weight: roundToNearest2_5(workingWeight * 0.45),
        reps: '6-10',
      });
      warmUpSets.push({
        weight: roundToNearest2_5(workingWeight * 0.65),
        reps: '4-6',
      });
      warmUpSets.push({
        weight: roundToNearest2_5(workingWeight * 0.85),
        reps: '3-4',
      });
      break;

    case 4:
      warmUpSets.push({
        weight: roundToNearest2_5(workingWeight * 0.45),
        reps: '6-10',
      });
      warmUpSets.push({
        weight: roundToNearest2_5(workingWeight * 0.60),
        reps: '4-6',
      });
      warmUpSets.push({
        weight: roundToNearest2_5(workingWeight * 0.75),
        reps: '3-5',
      });
      warmUpSets.push({
        weight: roundToNearest2_5(workingWeight * 0.85),
        reps: '2-4',
      });
      break;
  }

  return warmUpSets;
}

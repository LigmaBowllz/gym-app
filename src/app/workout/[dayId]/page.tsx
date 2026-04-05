// Active Workout Page
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAppContext } from '@/context/AppContext';
import { getWorkoutDayById, getNextDayId, getWorkoutCycle } from '@/lib/database/exercises';
import { calculateWarmUpSets } from '@/lib/calculators/warmup';
import { getWeightRecommendation, getLastSessionPerformance } from '@/lib/calculators/progressiveOverload';
import { formatIntensity } from '@/lib/calculators/deload';
import { useWorkoutSession } from '@/lib/storage/useWorkoutStorage';
import { getDateKey } from '@/lib/storage/storage';
import { LoggedSet, WorkoutLogEntry } from '@/lib/database/types';
import { 
  ArrowLeft, 
  Check, 
  Dumbbell, 
  Trophy, 
  Home, 
  Play, 
  Flame, 
  Target, 
  ChevronDown,
  ChevronUp,
  Zap,
  Activity,
} from 'lucide-react';

// Day-specific color configurations
const dayColors: Record<string, { gradient: string; iconBg: string; emoji: string }> = {
  upper: {
    gradient: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(34, 211, 238, 0.15) 100%)',
    iconBg: 'from-blue-500 to-cyan-400',
    emoji: '💪',
  },
  lower: {
    gradient: 'linear-gradient(135deg, rgba(168, 85, 247, 0.15) 0%, rgba(244, 114, 182, 0.15) 100%)',
    iconBg: 'from-purple-500 to-pink-400',
    emoji: '🦵',
  },
  pull: {
    gradient: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(45, 212, 191, 0.15) 100%)',
    iconBg: 'from-emerald-500 to-teal-400',
    emoji: '🔙',
  },
  push: {
    gradient: 'linear-gradient(135deg, rgba(249, 115, 22, 0.15) 0%, rgba(251, 191, 36, 0.15) 100%)',
    iconBg: 'from-orange-500 to-amber-400',
    emoji: '🫸',
  },
  legs: {
    gradient: 'linear-gradient(135deg, rgba(244, 63, 94, 0.15) 0%, rgba(248, 113, 113, 0.15) 100%)',
    iconBg: 'from-rose-500 to-red-400',
    emoji: '🏋️',
  },
};

// Confetti component for workout completion
function Confetti() {
  const [pieces, setPieces] = useState<Array<{ id: number; left: number; color: string; delay: number }>>([]);

  useEffect(() => {
    const colors = ['#00d4ff', '#7c3aed', '#00e676', '#ffab00', '#ff3b5c', '#f472b6', '#38bdf8'];
    const newPieces = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * 2,
    }));
    setPieces(newPieces);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {pieces.map((piece) => (
        <div
          key={piece.id}
          className="confetti-piece"
          style={{
            left: `${piece.left}%`,
            bottom: '-10px',
            backgroundColor: piece.color,
            animationDelay: `${piece.delay}s`,
            animationDuration: `${2 + Math.random() * 2}s`,
          }}
        />
      ))}
    </div>
  );
}

// Exercise Card Component
function ExerciseCard({
  exercise,
  dayId,
  plannedWeight,
  onWeightChange,
  warmUpSets,
  warmUpCompleted,
  onWarmUpToggle,
  completedSets,
  onSetLog,
  onSetComplete,
  index,
}: {
  exercise: any;
  dayId: string;
  plannedWeight: number;
  onWeightChange: (value: string) => void;
  warmUpSets: any[];
  warmUpCompleted: boolean[];
  onWarmUpToggle: (index: number) => void;
  completedSets: LoggedSet[];
  onSetLog: (setIndex: number, field: 'weight' | 'reps', value: string) => void;
  onSetComplete: (setIndex: number) => void;
  index: number;
}) {
  const [isExpanded, setIsExpanded] = useState(true);

  const lastSession = getLastSessionPerformance(exercise.id, dayId);
  const rec = getWeightRecommendation(exercise.id, exercise.repRange, dayId);

  return (
    <div 
      className="card animate-fade-in-up"
      style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'backwards' }}
    >
      {/* Exercise Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between mb-2"
      >
        <div className="flex items-center gap-3">
          <div className="icon-container-sm bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20">
            <Dumbbell className="w-4 h-4 text-accent-primary" />
          </div>
          <div className="text-left">
            <h2 className="text-h3 text-text-primary">{exercise.name}</h2>
            <div className="flex items-center gap-3 text-xs text-text-secondary mt-1">
              <span className="flex items-center gap-1">
                <Target className="w-3 h-3" />
                {exercise.workingSets} × {exercise.repRange[0]}-{exercise.repRange[1]}
              </span>
              <span className="flex items-center gap-1">
                <Activity className="w-3 h-3" />
                {exercise.earlySetRpe} RPE → {formatIntensity(exercise.lastSetIntensity)}
              </span>
            </div>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-text-muted" />
        ) : (
          <ChevronDown className="w-5 h-5 text-text-muted" />
        )}
      </button>

      {/* Last Session Badge */}
      {lastSession && (
        <div className="badge badge-info mb-3 flex items-center gap-1">
          <Zap className="w-3 h-3" />
          Last: {lastSession}
        </div>
      )}

      {/* Progressive Overload Recommendation */}
      {rec.action !== 'no-data' && rec.suggestedWeight !== null && (
        <div className="text-xs text-accent-success mb-3 flex items-center gap-1">
          <Flame className="w-3 h-3" />
          {rec.action === 'increase'
            ? `Try ${rec.suggestedWeight} kg (+2.5 kg)`
            : `Maintain ${rec.suggestedWeight} kg`}
        </div>
      )}

      {isExpanded && (
        <div className="animate-fade-in">
          {/* Planned Working Weight Input */}
          <div className="mb-4">
            <label className="text-xs text-text-secondary mb-2 block font-medium">
              Planned Working Weight (kg)
            </label>
            <input
              type="number"
              value={plannedWeight || ''}
              onChange={(e) => onWeightChange(e.target.value)}
              className="input-field text-lg font-bold text-center"
              placeholder="Enter weight..."
              min="0"
              step="2.5"
            />
          </div>

          {/* Warm-Up Sets */}
          {warmUpSets.length > 0 && (
            <div className="mb-4">
              <div className="text-xs text-text-secondary font-semibold mb-2 uppercase tracking-wide flex items-center gap-2">
                <Flame className="w-3 h-3 text-accent-warning" />
                Warm-Up Sets
              </div>
              <div className="space-y-2">
                {warmUpSets.map((ws, setIndex) => (
                  <button
                    key={setIndex}
                    onClick={() => onWarmUpToggle(setIndex)}
                    className={`w-full p-3 rounded-xl border flex items-center justify-between transition-all duration-300 ${
                      warmUpCompleted[setIndex]
                        ? 'bg-accent-success/20 border-accent-success shadow-glow-success'
                        : 'bg-background-input border-border-color hover:border-accent-primary/50'
                    }`}
                  >
                    <div className="text-left">
                      <span className="text-text-primary font-semibold">
                        Set {setIndex + 1}:
                      </span>
                      <span className="text-text-secondary ml-2">
                        {ws.weight} kg × {ws.reps} reps
                      </span>
                    </div>
                    <div
                      className={`w-7 h-7 rounded-lg border-2 flex items-center justify-center transition-all duration-300 ${
                        warmUpCompleted[setIndex]
                          ? 'bg-accent-success border-accent-success scale-110'
                          : 'border-text-muted'
                      }`}
                    >
                      {warmUpCompleted[setIndex] && (
                        <Check className="w-4 h-4 text-background-primary" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Working Sets */}
          <div>
            <div className="text-xs text-text-secondary font-semibold mb-2 uppercase tracking-wide flex items-center gap-2">
              <Dumbbell className="w-3 h-3 text-accent-primary" />
              Working Sets
            </div>
            <div className="space-y-3">
              {Array.from({ length: exercise.workingSets }, (_, setIndex) => {
                const set = completedSets[setIndex];
                const isLastSet = setIndex === exercise.workingSets - 1;

                return (
                  <div
                    key={setIndex}
                    className={`p-4 rounded-xl border transition-all duration-300 ${
                      set?.completed
                        ? 'bg-accent-success/10 border-accent-success/50 shadow-glow-success'
                        : 'bg-background-input border-border-color hover:border-accent-primary/30'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-text-primary font-semibold flex items-center gap-2">
                        Set {setIndex + 1}
                        {isLastSet && (
                          <span className="text-xs text-accent-secondary bg-accent-secondary/20 px-2 py-0.5 rounded-full">
                            Last Set
                          </span>
                        )}
                      </span>
                    </div>
                    <div className="flex gap-3">
                      <div className="flex-1">
                        <label className="text-xs text-text-secondary mb-1 block">Weight (kg)</label>
                        <input
                          type="number"
                          value={set?.weight || ''}
                          onChange={(e) => onSetLog(setIndex, 'weight', e.target.value)}
                          className="input-field text-center font-semibold"
                          placeholder="0"
                          min="0"
                          step="2.5"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="text-xs text-text-secondary mb-1 block">Reps</label>
                        <input
                          type="number"
                          value={set?.reps || ''}
                          onChange={(e) => onSetLog(setIndex, 'reps', e.target.value)}
                          className="input-field text-center font-semibold"
                          placeholder="0"
                          min="0"
                        />
                      </div>
                      <div className="flex items-end">
                        <button
                          onClick={() => onSetComplete(setIndex)}
                          className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center transition-all duration-300 ${
                            set?.completed
                              ? 'bg-accent-success border-accent-success scale-110 shadow-glow-success'
                              : 'border-text-muted hover:border-accent-primary/50'
                          }`}
                          aria-label={set?.completed ? 'Mark set as incomplete' : 'Mark set as complete'}
                        >
                          {set?.completed ? (
                            <Check className="w-6 h-6 text-background-primary" />
                          ) : (
                            <div className="w-3 h-3 rounded-full bg-text-muted" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function WorkoutPage() {
  const params = useParams();
  const router = useRouter();
  const { settings } = useAppContext();
  const dayId = params.dayId as string;

  const workoutDay = getWorkoutDayById(dayId);
  const dateKey = getDateKey();
  const colors = dayColors[dayId] || dayColors.upper;

  const {
    session,
    isLoading,
    createSession,
    saveExercises,
    completeWorkout,
  } = useWorkoutSession(dateKey, dayId);

  const [isWorkoutCompleted, setIsWorkoutCompleted] = useState(false);
  const [completedWorkoutData, setCompletedWorkoutData] = useState<{
    exercises: WorkoutLogEntry[];
    totalWorkingSets: number;
    totalWarmUpSets: number;
  } | null>(null);
  const [plannedWeights, setPlannedWeights] = useState<Record<string, number>>({});
  const [completedSets, setCompletedSets] = useState<Record<string, LoggedSet[]>>({});
  const [warmUpCompleted, setWarmUpCompleted] = useState<Record<string, boolean[]>>({});

  useEffect(() => {
    if (!session && workoutDay) {
      createSession();
    }

    if (workoutDay) {
      const initialWeights: Record<string, number> = {};
      const initialWarmUp: Record<string, boolean[]> = {};
      const initialSets: Record<string, LoggedSet[]> = {};

      workoutDay.exercises.forEach((exercise) => {
        const rec = getWeightRecommendation(exercise.id, exercise.repRange, dayId);
        initialWeights[exercise.id] = rec.suggestedWeight || 0;
        initialWarmUp[exercise.id] = Array(exercise.warmupSets[1]).fill(false);
        initialSets[exercise.id] = Array(exercise.workingSets).fill(null).map(() => ({
          weight: 0,
          reps: 0,
          completed: false,
          isWarmup: false,
        }));
      });

      setPlannedWeights(initialWeights);
      setWarmUpCompleted(initialWarmUp);
      setCompletedSets(initialSets);
    }
  }, [session, workoutDay, createSession, dayId]);

  if (!workoutDay) {
    return (
      <div className="min-h-screen bg-background-primary flex items-center justify-center">
        <div className="text-text-secondary">Workout day not found</div>
      </div>
    );
  }

  const handlePlannedWeightChange = useCallback((exerciseId: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    setPlannedWeights((prev) => ({ ...prev, [exerciseId]: numValue }));
  }, []);

  const handleWarmUpToggle = useCallback((exerciseId: string, setIndex: number) => {
    setWarmUpCompleted((prev) => {
      const updated = [...(prev[exerciseId] || [])];
      updated[setIndex] = !updated[setIndex];
      return { ...prev, [exerciseId]: updated };
    });
  }, []);

  const handleSetLog = useCallback((exerciseId: string, setIndex: number, field: 'weight' | 'reps', value: string) => {
    const numValue = parseFloat(value) || 0;
    setCompletedSets((prev) => {
      const exerciseSets = [...(prev[exerciseId] || [])];
      exerciseSets[setIndex] = {
        ...exerciseSets[setIndex],
        [field]: numValue,
      };
      return { ...prev, [exerciseId]: exerciseSets };
    });
  }, []);

  const handleSetComplete = useCallback((exerciseId: string, setIndex: number) => {
    setCompletedSets((prev) => {
      const exerciseSets = [...(prev[exerciseId] || [])];
      exerciseSets[setIndex] = {
        ...exerciseSets[setIndex],
        completed: !exerciseSets[setIndex].completed,
      };
      return { ...prev, [exerciseId]: exerciseSets };
    });
  }, []);

  const handleCompleteWorkout = () => {
    const exercises: WorkoutLogEntry[] = workoutDay.exercises.map((exercise) => {
      const warmUpSets = calculateWarmUpSets(
        plannedWeights[exercise.id] || 0,
        exercise.warmupSets[1]
      );

      const warmUpLoggedSets: LoggedSet[] = warmUpSets.map((ws, i) => ({
        weight: ws.weight,
        reps: parseInt(ws.reps.split('-')[0]) || 0,
        completed: warmUpCompleted[exercise.id]?.[i] || false,
        isWarmup: true,
      }));

      const workingSets = completedSets[exercise.id] || [];

      return {
        exerciseId: exercise.id,
        sets: [...warmUpLoggedSets, ...workingSets],
        plannedWorkingWeight: plannedWeights[exercise.id] || 0,
      };
    });

    let totalWorkingSets = 0;
    let totalWarmUpSets = 0;
    
    exercises.forEach((exercise) => {
      exercise.sets.forEach((set) => {
        if (set.completed) {
          if (set.isWarmup) {
            totalWarmUpSets++;
          } else {
            totalWorkingSets++;
          }
        }
      });
    });

    saveExercises(exercises);
    completeWorkout(true, exercises, dayId);
    
    setCompletedWorkoutData({
      exercises,
      totalWorkingSets,
      totalWarmUpSets,
    });
    
    setIsWorkoutCompleted(true);
  };

  const handleStartNextWorkout = () => {
    const nextDayId = getNextDayId(dayId);
    router.push(`/workout/${nextDayId}`);
  };

  const handleGoToDashboard = () => {
    router.push('/');
  };

  const totalSetsCompleted = completedWorkoutData
    ? completedWorkoutData.totalWorkingSets
    : Object.values(completedSets).reduce(
        (total, sets) => total + sets.filter((s) => s.completed).length,
        0
      );

  const totalWarmUpCompletedCount = completedWorkoutData
    ? completedWorkoutData.totalWarmUpSets
    : Object.values(warmUpCompleted).reduce(
        (total, warmUps) => total + warmUps.filter(Boolean).length,
        0
      );

  const nextDayId = getNextDayId(dayId);
  const nextWorkoutDay = getWorkoutDayById(nextDayId);
  const nextColors = dayColors[nextDayId] || dayColors.upper;

  // Calculate progress
  const totalSets = workoutDay.exercises.reduce((acc, ex) => acc + ex.workingSets, 0);
  const completedSetsCount = Object.values(completedSets).reduce(
    (total, sets) => total + sets.filter((s) => s.completed).length,
    0
  );
  const progressPercent = totalSets > 0 ? (completedSetsCount / totalSets) * 100 : 0;

  // Completion Summary Screen
  if (isWorkoutCompleted) {
    return (
      <div className="min-h-screen bg-background-primary relative overflow-hidden">
        <Confetti />
        
        {/* Background Effects */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-accent-success/10 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-accent-primary/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
        </div>

        <div className="relative flex flex-col items-center justify-center min-h-screen p-6">
          {/* Trophy Icon with Animation */}
          <div className="mb-6 animate-bounce-slow">
            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-accent-success/30 to-accent-primary/30 flex items-center justify-center glow-success">
              <Trophy className="w-14 h-14 text-accent-success" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-h1 bg-gradient-to-r from-accent-success to-accent-primary bg-clip-text text-transparent mb-2 text-center animate-fade-in-up">
            Workout Complete!
          </h1>
          <p className="text-text-secondary text-center mb-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            Great job crushing {workoutDay.name} day!
          </p>

          {/* Stats Card */}
          <div className="card w-full max-w-sm mb-8 animate-scale-in" style={{ animationDelay: '0.2s' }}>
            <div className="text-h3 text-text-primary mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-accent-primary" />
              Session Summary
            </div>
            <div className="space-y-4">
              {[
                { label: 'Exercises Completed', value: workoutDay.exercises.length, icon: <Dumbbell className="w-4 h-4" /> },
                { label: 'Working Sets', value: totalSetsCompleted, icon: <Flame className="w-4 h-4 text-accent-warning" /> },
                { label: 'Warm-Up Sets', value: totalWarmUpCompletedCount, icon: <Zap className="w-4 h-4 text-accent-primary" /> },
                { label: 'Total Sets', value: totalSetsCompleted + totalWarmUpCompletedCount, icon: <Trophy className="w-4 h-4 text-accent-success" /> },
              ].map((stat, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b border-border-color last:border-0">
                  <span className="text-text-secondary flex items-center gap-2">
                    {stat.icon}
                    {stat.label}
                  </span>
                  <span className="text-text-primary font-bold text-lg">{stat.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Next Workout Card */}
          {nextWorkoutDay && (
            <div 
              className="card w-full max-w-sm mb-8 animate-fade-in-up border-accent-primary/30"
              style={{ background: nextColors.gradient, animationDelay: '0.3s' }}
            >
              <div className="text-xs text-accent-primary font-medium uppercase tracking-wide mb-2">Next Workout</div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-h2 text-text-primary">{nextWorkoutDay.name}</div>
                  <div className="text-small text-text-secondary mt-1">
                    {nextWorkoutDay.exercises.length} exercises
                  </div>
                </div>
                <div 
                  className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl"
                  style={{ background: nextColors.gradient }}
                >
                  {nextColors.emoji}
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="w-full max-w-sm space-y-3 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <button
              onClick={handleStartNextWorkout}
              className="w-full btn-primary text-lg flex items-center justify-center gap-2"
            >
              <Play className="w-5 h-5" />
              Start Next Workout
            </button>
            <button
              onClick={handleGoToDashboard}
              className="w-full btn-secondary text-lg flex items-center justify-center gap-2"
            >
              <Home className="w-5 h-5" />
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-primary pb-28 relative">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-64 h-64 bg-accent-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-accent-secondary/5 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <div 
        className="relative p-4 pb-6 border-b border-border-color animate-fade-in-down"
        style={{ background: colors.gradient }}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-xl bg-background-card/50 border border-border-color hover:border-accent-primary/50 transition-all duration-300 min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5 text-text-primary" />
          </button>
          <div className="flex items-center gap-3 flex-1">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
              style={{ background: colors.gradient }}
            >
              {colors.emoji}
            </div>
            <div>
              <h1 className="text-h2 text-text-primary">{workoutDay.name}</h1>
              <div className="text-xs text-text-secondary">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs text-text-secondary mb-2">
            <span>Progress</span>
            <span className="text-accent-primary font-semibold">{completedSetsCount}/{totalSets} sets</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-bar-fill"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Exercises */}
      <div className="relative p-4 space-y-4">
        {workoutDay.exercises.map((exercise, index) => {
          const warmUpSets = calculateWarmUpSets(
            plannedWeights[exercise.id] || 0,
            exercise.warmupSets[1]
          );

          return (
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
              dayId={dayId}
              plannedWeight={plannedWeights[exercise.id] || 0}
              onWeightChange={(value) => handlePlannedWeightChange(exercise.id, value)}
              warmUpSets={warmUpSets}
              warmUpCompleted={warmUpCompleted[exercise.id] || []}
              onWarmUpToggle={(setIndex) => handleWarmUpToggle(exercise.id, setIndex)}
              completedSets={completedSets[exercise.id] || []}
              onSetLog={(setIndex, field, value) => handleSetLog(exercise.id, setIndex, field, value)}
              onSetComplete={(setIndex) => handleSetComplete(exercise.id, setIndex)}
              index={index}
            />
          );
        })}
      </div>

      {/* Complete Workout Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background-secondary/95 backdrop-blur-lg border-t border-border-color animate-slide-up">
        <button
          onClick={handleCompleteWorkout}
          className="w-full btn-primary text-lg flex items-center justify-center gap-2"
        >
          <Trophy className="w-5 h-5" />
          Complete Workout
        </button>
      </div>
    </div>
  );
}

// Dashboard Page
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/context/AppContext';
import { getWorkoutCycle } from '@/lib/database/exercises';
import { useLastSession } from '@/lib/storage/useWorkoutStorage';
import { Settings, ChevronRight, Flame, Trophy, TrendingUp, Calendar } from 'lucide-react';

const dayConfig: Record<string, {
  emoji: string;
  name: string;
  color: string;
  gradient: string;
  iconName: 'flame' | 'trending' | 'trophy' | 'calendar';
}> = {
  upper: {
    emoji: '💪',
    name: 'Upper Body',
    color: 'from-blue-500 to-cyan-400',
    gradient: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(34, 211, 238, 0.2) 100%)',
    iconName: 'flame' as const,
  },
  lower: {
    emoji: '🦵',
    name: 'Lower Body',
    color: 'from-purple-500 to-pink-400',
    gradient: 'linear-gradient(135deg, rgba(168, 85, 247, 0.2) 0%, rgba(244, 114, 182, 0.2) 100%)',
    iconName: 'trending' as const,
  },
  pull: {
    emoji: '🔙',
    name: 'Pull',
    color: 'from-emerald-500 to-teal-400',
    gradient: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(45, 212, 191, 0.2) 100%)',
    iconName: 'trophy' as const,
  },
  push: {
    emoji: '🫸',
    name: 'Push',
    color: 'from-orange-500 to-amber-400',
    gradient: 'linear-gradient(135deg, rgba(249, 115, 22, 0.2) 0%, rgba(251, 191, 36, 0.2) 100%)',
    iconName: 'flame' as const,
  },
  legs: {
    emoji: '🏋️',
    name: 'Legs',
    color: 'from-rose-500 to-red-400',
    gradient: 'linear-gradient(135deg, rgba(244, 63, 94, 0.2) 0%, rgba(248, 113, 113, 0.2) 100%)',
    iconName: 'calendar' as const,
  },
};

const iconMap = {
  flame: Flame,
  trending: TrendingUp,
  trophy: Trophy,
  calendar: Calendar,
};

export default function DashboardPage() {
  const router = useRouter();
  const { settings, isLoading } = useAppContext();
  const { updateLastSession } = useLastSession();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background-primary flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 animate-pulse-slow">
          <div className="w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center">
            <span className="text-3xl">🏋️</span>
          </div>
          <div className="text-text-secondary animate-fade-in">Loading your gains...</div>
        </div>
      </div>
    );
  }

  if (!settings.onboardingComplete) {
    router.push('/onboarding');
    return null;
  }

  const workoutCycle = getWorkoutCycle();
  const lastSession = settings.lastSession;

  const handleWorkoutClick = (dayId: string) => {
    updateLastSession(dayId);
    router.push(`/workout/${dayId}`);
  };

  return (
    <div className="min-h-screen bg-background-primary">
      {/* Animated Background Gradient */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-accent-primary/5 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent-secondary/5 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
      </div>

      {/* Header */}
      <div className="relative gradient-header p-6 pb-8 animate-fade-in-down">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-h1 bg-gradient-to-r from-accent-primary to-accent-secondary bg-clip-text text-transparent">
              What are we doing today?
            </h1>
            <p className="text-small text-text-secondary mt-1">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <button
            onClick={() => router.push('/onboarding')}
            className="p-3 rounded-xl bg-background-card/50 border border-border-color hover:border-accent-primary/50 transition-all duration-300 hover:scale-105"
            aria-label="Settings"
          >
            <Settings className="w-5 h-5 text-text-secondary hover:text-accent-primary transition-colors" />
          </button>
        </div>

        {/* Last Session Banner */}
        {lastSession && dayConfig[lastSession] && (
          <div 
            className="p-4 rounded-2xl border border-accent-primary/30 animate-fade-in-up"
            style={{ background: dayConfig[lastSession].gradient }}
          >
            <div className="flex items-center gap-3">
              <div className="icon-container-sm">
                <span className="text-xl">{dayConfig[lastSession].emoji}</span>
              </div>
              <div>
                <div className="text-xs text-accent-primary font-medium uppercase tracking-wide">Last Session</div>
                <div className="text-h3 text-text-primary">{dayConfig[lastSession].name}</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Workout List */}
      <div className="relative p-4 -mt-2">
        <div className="flex items-center gap-2 mb-4 px-2">
          <Flame className="w-5 h-5 text-accent-warning animate-bounce-slow" />
          <h2 className="text-h3 text-text-primary">Workouts</h2>
        </div>
        
        <div className="space-y-3">
          {workoutCycle.map((day, index) => {
            const config = dayConfig[day.id];
            const isLastSession = lastSession === day.id;
            
            return (
              <div
                key={day.id}
                onClick={() => handleWorkoutClick(day.id)}
                className="card cursor-pointer animate-fade-in-up group"
                style={{ 
                  animationDelay: `${index * 0.1}s`,
                  animationFillMode: 'backwards',
                  ...(isLastSession ? { borderColor: 'var(--accent-primary)', boxShadow: '0 0 20px rgba(0, 212, 255, 0.15)' } : {}),
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {/* Icon Container with Gradient */}
                    <div 
                      className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
                      style={{ background: config.gradient }}
                    >
                      {config.emoji}
                    </div>
                    
                    <div>
                      <div className="text-h3 text-text-primary group-hover:text-accent-primary transition-colors duration-300">
                        {day.name}
                      </div>
                      <div className="text-small text-text-secondary flex items-center gap-2 mt-1">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-background-input/50 text-xs">
                          {React.createElement(iconMap[config.iconName], { className: "w-3 h-3" })}
                          {day.exercises.length} exercises
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-text-secondary group-hover:text-accent-primary group-hover:translate-x-1 transition-all duration-300">
                    <ChevronRight className="w-6 h-6" />
                  </div>
                </div>
                
                {/* Progress indicator for last session */}
                {isLastSession && (
                  <div className="mt-3 pt-3 border-t border-accent-primary/20">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 progress-bar">
                        <div className="progress-bar-fill w-1/3" />
                      </div>
                      <span className="text-xs text-accent-primary">Continue</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

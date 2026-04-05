// Onboarding Page
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/context/AppContext';
import { Dumbbell, Target, TrendingUp, Zap, ChevronRight, Check } from 'lucide-react';

const features = [
  {
    icon: <Dumbbell className="w-6 h-6" />,
    title: '5-Day Split',
    description: 'Scientifically designed workout split for maximum gains',
    color: 'from-blue-500 to-cyan-400',
  },
  {
    icon: <Target className="w-6 h-6" />,
    title: 'Progressive Overload',
    description: 'Smart weight progression built into every workout',
    color: 'from-purple-500 to-pink-400',
  },
  {
    icon: <TrendingUp className="w-6 h-6" />,
    title: 'Track Everything',
    description: 'Log weights, reps, and monitor your progress over time',
    color: 'from-emerald-500 to-teal-400',
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: 'Smart Warm-ups',
    description: 'Auto-calculated warm-up sets based on your working weight',
    color: 'from-orange-500 to-amber-400',
  },
];

const workoutSplit = [
  { emoji: '💪', name: 'Upper Body', color: 'from-blue-500 to-cyan-400' },
  { emoji: '🦵', name: 'Lower Body', color: 'from-purple-500 to-pink-400' },
  { emoji: '🔙', name: 'Pull (Back & Biceps)', color: 'from-emerald-500 to-teal-400' },
  { emoji: '🫸', name: 'Push (Chest & Triceps)', color: 'from-orange-500 to-amber-400' },
  { emoji: '🏋️', name: 'Legs', color: 'from-rose-500 to-red-400' },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { completeOnboarding } = useAppContext();
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isAnimating) {
        setCurrentStep((prev) => (prev + 1) % features.length);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [isAnimating]);

  const handleStart = () => {
    setIsAnimating(true);
    completeOnboarding();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-background-primary relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-accent-primary/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-accent-secondary/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-accent-success/5 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '0.75s' }} />
      </div>

      <div className="relative flex flex-col items-center justify-center min-h-screen p-6">
        {/* Logo & Header */}
        <div className="text-center mb-8 animate-fade-in-down">
          <div className="relative inline-block mb-6">
            <div className="w-24 h-24 rounded-3xl bg-gradient-primary flex items-center justify-center animate-bounce-slow shadow-glow">
              <span className="text-5xl">🏋️</span>
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-accent-success flex items-center justify-center animate-pulse">
              <Zap className="w-4 h-4 text-background-primary" />
            </div>
          </div>
          <h1 className="text-h1 bg-gradient-to-r from-accent-primary via-accent-secondary to-accent-success bg-clip-text text-transparent mb-2">
            Gym Tracker
          </h1>
          <p className="text-body text-text-secondary">
            Your Daily Transformation Journey
          </p>
        </div>

        {/* Feature Carousel */}
        <div className="w-full max-w-md mb-8">
          <div className="relative">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`transition-all duration-500 ${
                  index === currentStep 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-4 absolute inset-0'
                }`}
              >
                <div className="card p-5 border-accent-primary/30">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center flex-shrink-0`}>
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="text-h3 text-text-primary mb-1">{feature.title}</h3>
                      <p className="text-small text-text-secondary">{feature.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Carousel Dots */}
          <div className="flex justify-center gap-2 mt-4">
            {features.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={`transition-all duration-300 rounded-full ${
                  index === currentStep 
                    ? 'w-8 h-2 bg-gradient-primary' 
                    : 'w-2 h-2 bg-text-muted hover:bg-text-secondary'
                }`}
                aria-label={`Go to feature ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Workout Split Preview */}
        <div className="w-full max-w-md mb-8 animate-fade-in-up" style={{ animationDelay: '0.3s', animationFillMode: 'backwards' }}>
          <div className="card p-5">
            <h2 className="text-h3 text-text-primary mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-accent-primary" />
              5-Day Split
            </h2>
            <div className="space-y-2">
              {workoutSplit.map((day, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-background-input/50 transition-colors duration-200"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${day.color} flex items-center justify-center text-lg`}>
                    {day.emoji}
                  </div>
                  <span className="text-body text-text-secondary">{day.name}</span>
                  <Check className="w-4 h-4 text-accent-success ml-auto" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="w-full max-w-md mb-8 animate-fade-in-up" style={{ animationDelay: '0.5s', animationFillMode: 'backwards' }}>
          <div className="card p-5">
            <h2 className="text-h3 text-text-primary mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-accent-warning" />
              How It Works
            </h2>
            <ul className="space-y-3">
              {[
                'Complete one workout per day',
                'Progress through the cycle automatically',
                'Track your weights and reps',
                'Progressive overload built-in',
                'Warm-up sets calculated for you',
              ].map((item, index) => (
                <li key={index} className="flex items-center gap-3 text-small text-text-secondary">
                  <div className="w-6 h-6 rounded-full bg-accent-primary/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs text-accent-primary font-bold">{index + 1}</span>
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Start Button */}
        <div className="w-full max-w-md animate-fade-in-up" style={{ animationDelay: '0.7s', animationFillMode: 'backwards' }}>
          <button
            onClick={handleStart}
            className="w-full btn-primary text-lg flex items-center justify-center gap-2 group"
          >
            Start Training
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { X, Play, Pause, RotateCcw, SkipForward } from 'lucide-react';

interface BreakTimerProps {
  durationSeconds?: number;
  onClose: () => void;
  onSkip?: () => void;
}

export default function BreakTimer({
  durationSeconds = 180, // 3 minutes default
  onClose,
  onSkip,
}: BreakTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState(durationSeconds);
  const [isRunning, setIsRunning] = useState(true);
  const [isFinished, setIsFinished] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Play a notification sound when timer finishes
  const playNotificationSound = useCallback(() => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioContextRef.current;
      
      // Create a pleasant beep sequence
      const playBeep = (frequency: number, startTime: number, duration: number) => {
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        oscillator.frequency.value = frequency;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.3, startTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
        
        oscillator.start(startTime);
        oscillator.stop(startTime + duration);
      };

      const now = ctx.currentTime;
      playBeep(880, now, 0.15);
      playBeep(880, now + 0.2, 0.15);
      playBeep(1100, now + 0.4, 0.3);
    } catch (error) {
      console.error('Failed to play notification sound:', error);
    }
  }, []);

  // Timer countdown logic
  useEffect(() => {
    if (!isRunning || timeRemaining <= 0) {
      if (timeRemaining <= 0 && isRunning) {
        setIsFinished(true);
        setIsRunning(false);
        playNotificationSound();
      }
      return;
    }

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, timeRemaining, playNotificationSound]);

  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate progress percentage
  const progressPercent = ((durationSeconds - timeRemaining) / durationSeconds) * 100;

  // Handle skip to end
  const handleSkip = () => {
    setIsFinished(true);
    setIsRunning(false);
    playNotificationSound();
    if (onSkip) {
      setTimeout(() => onSkip(), 500);
    }
  };

  // Handle reset
  const handleReset = () => {
    setTimeRemaining(durationSeconds);
    setIsRunning(true);
    setIsFinished(false);
  };

  // Handle close
  const handleClose = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-background-primary/90 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Timer Card */}
      <div className="relative w-full max-w-sm card animate-scale-in">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-background-input transition-colors"
          aria-label="Close timer"
        >
          <X className="w-5 h-5 text-text-secondary" />
        </button>

        {/* Title */}
        <div className="text-center mb-6">
          <h2 className="text-h2 text-text-primary mb-1">Rest Timer</h2>
          <p className="text-text-secondary text-sm">
            {isFinished ? 'Ready for your next set!' : 'Take a break before your next set'}
          </p>
        </div>

        {/* Timer Display */}
        <div className="flex flex-col items-center mb-6">
          {/* Circular Progress */}
          <div className="relative w-48 h-48 mb-4">
            {/* Background Circle */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                className="text-background-input"
              />
              {/* Progress Circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="url(#timerGradient)"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 45}`}
                strokeDashoffset={`${2 * Math.PI * 45 * (1 - progressPercent / 100)}`}
                className="transition-all duration-1000 ease-linear"
              />
              {/* Gradient Definition */}
              <defs>
                <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#22d3ee" />
                </linearGradient>
              </defs>
            </svg>
            
            {/* Time Display in Center */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-5xl font-bold ${isFinished ? 'text-accent-success' : 'text-text-primary'}`}>
                {formatTime(timeRemaining)}
              </span>
              {isFinished && (
                <span className="text-accent-success text-sm mt-1 animate-pulse">
                  Go!
                </span>
              )}
            </div>
          </div>

          {/* Quick Time Buttons */}
          {!isFinished && (
            <div className="flex gap-2 mb-4">
              {[30, 60, 90].map((seconds) => (
                <button
                  key={seconds}
                  onClick={() => {
                    setTimeRemaining(seconds);
                    setIsRunning(true);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-background-input border border-border-color text-text-secondary text-sm hover:border-accent-primary/50 hover:text-accent-primary transition-all"
                >
                  {seconds}s
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-3">
          {/* Reset Button */}
          <button
            onClick={handleReset}
            className="p-3 rounded-xl bg-background-input border border-border-color hover:border-accent-primary/50 transition-all"
            aria-label="Reset timer"
          >
            <RotateCcw className="w-5 h-5 text-text-secondary" />
          </button>

          {/* Play/Pause Button */}
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`p-4 rounded-xl transition-all ${
              isFinished
                ? 'bg-accent-success hover:bg-accent-success/90'
                : 'bg-accent-primary hover:bg-accent-primary/90'
            }`}
            aria-label={isRunning ? 'Pause timer' : 'Start timer'}
          >
            {isRunning ? (
              <Pause className="w-6 h-6 text-background-primary" />
            ) : (
              <Play className="w-6 h-6 text-background-primary" />
            )}
          </button>

          {/* Skip Button */}
          <button
            onClick={handleSkip}
            className="p-3 rounded-xl bg-background-input border border-border-color hover:border-accent-warning/50 transition-all"
            aria-label="Skip timer"
          >
            <SkipForward className="w-5 h-5 text-text-secondary" />
          </button>
        </div>
      </div>
    </div>
  );
}

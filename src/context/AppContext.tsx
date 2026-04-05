// Global App Context
'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useSettings } from '@/lib/storage/useWorkoutStorage';
import { UserSettings } from '@/lib/database/types';

interface AppContextType {
  settings: UserSettings;
  isLoading: boolean;
  updateSettings: (updates: Partial<UserSettings>) => void;
  completeOnboarding: () => void;
  refreshSettings: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const { settings, isLoading, updateSettings, completeOnboarding, refreshSettings } = useSettings();

  return (
    <AppContext.Provider value={{ settings, isLoading, updateSettings, completeOnboarding, refreshSettings }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
}
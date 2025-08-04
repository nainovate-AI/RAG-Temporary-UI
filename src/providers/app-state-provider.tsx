'use client';

import React, { useEffect } from 'react';
import { useDataLoader } from '@/stores';

interface AppStateProviderProps {
  children: React.ReactNode;
}

export function AppStateProvider({ children }: AppStateProviderProps) {
  const { loadAllData } = useDataLoader();

  useEffect(() => {
    // Load initial data when app mounts
    console.log('AppStateProvider mounted, loading initial data...');
    loadAllData();
  }, []);

  return <>{children}</>;
}
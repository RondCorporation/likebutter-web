'use client';

import { useUIStore } from '@/app/_stores/uiStore';
import { useCallback } from 'react';

export const useIsSettingsOpen = () =>
  useUIStore((state) => state.isSettingsOpen);
export const useInitialSettingsTab = () =>
  useUIStore((state) => state.initialSettingsTab);
export const useServerError = () => useUIStore((state) => state.serverError);

export const useOpenSettings = () => useUIStore((state) => state.openSettings);
export const useCloseSettings = () =>
  useUIStore((state) => state.closeSettings);
export const useSetServerError = () =>
  useUIStore((state) => state.setServerError);

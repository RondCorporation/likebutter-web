'use client';

import { useUIStore } from '@/stores/uiStore';

// 개별 상태를 위한 선택자들
export const useIsSettingsOpen = () => useUIStore(state => state.isSettingsOpen);
export const useInitialSettingsTab = () => useUIStore(state => state.initialSettingsTab);
export const useServerError = () => useUIStore(state => state.serverError);
export const useUIActions = () => useUIStore(state => ({
  openSettings: state.openSettings,
  closeSettings: state.closeSettings,
  setServerError: state.setServerError,
}));
'use client';

import { useUIStore } from '@/app/_stores/uiStore';
import { useCallback } from 'react';

// 개별 상태를 위한 선택자들
export const useIsSettingsOpen = () => useUIStore(state => state.isSettingsOpen);
export const useInitialSettingsTab = () => useUIStore(state => state.initialSettingsTab);
export const useServerError = () => useUIStore(state => state.serverError);

// 개별 액션 훅들 - 각각을 분리하여 안정적인 참조 유지
export const useOpenSettings = () => useUIStore(state => state.openSettings);
export const useCloseSettings = () => useUIStore(state => state.closeSettings);
export const useSetServerError = () => useUIStore(state => state.setServerError);
import { create } from 'zustand';

interface UIState {
  isSettingsOpen: boolean;
  initialSettingsTab: string;
  serverError: string | null;
  openSettings: (tab?: string) => void;
  closeSettings: () => void;
  setServerError: (error: string | null) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isSettingsOpen: false,
  initialSettingsTab: 'general',
  serverError: null,
  openSettings: (tab = 'general') =>
    set({ isSettingsOpen: true, initialSettingsTab: tab }),
  closeSettings: () =>
    set({ isSettingsOpen: false, initialSettingsTab: 'general' }),
  setServerError: (error: string | null) => set({ serverError: error }),
}));

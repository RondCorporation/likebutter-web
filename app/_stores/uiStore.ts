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
  initialSettingsTab: 'account', // Default tab
  serverError: null,
  openSettings: (tab = 'account') =>
    set({ isSettingsOpen: true, initialSettingsTab: tab }),
  closeSettings: () =>
    set({ isSettingsOpen: false, initialSettingsTab: 'account' }), // Reset tab on close
  setServerError: (error: string | null) => set({ serverError: error }),
}));

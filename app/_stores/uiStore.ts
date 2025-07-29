import { create } from 'zustand';

interface UIState {
  isSettingsOpen: boolean;
  initialSettingsTab: string;
  openSettings: (tab?: string) => void;
  closeSettings: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isSettingsOpen: false,
  initialSettingsTab: 'account', // Default tab
  openSettings: (tab = 'account') =>
    set({ isSettingsOpen: true, initialSettingsTab: tab }),
  closeSettings: () =>
    set({ isSettingsOpen: false, initialSettingsTab: 'account' }), // Reset tab on close
}));
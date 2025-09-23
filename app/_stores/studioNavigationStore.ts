import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface StudioToolState {
  lastVisited: string;
  scrollPosition?: number;
  formData?: any;
  preferences?: any;
}

interface StudioNavigationState {
  toolStates: Record<string, StudioToolState>;

  lastUsedTool: string;
  preloadedTools: string[];

  setToolState: (toolName: string, state: Partial<StudioToolState>) => void;
  getToolState: (toolName: string) => StudioToolState | undefined;
  setLastUsedTool: (toolName: string) => void;
  addPreloadedTool: (toolName: string) => void;
  clearToolState: (toolName: string) => void;
  clearAllStates: () => void;
}

const useStudioNavigationStore = create<StudioNavigationState>()(
  persist(
    (set, get) => ({
      toolStates: {},
      lastUsedTool: 'dashboard',
      preloadedTools: ['dashboard'],

      setToolState: (toolName, state) => {
        set((prev) => ({
          toolStates: {
            ...prev.toolStates,
            [toolName]: {
              ...prev.toolStates[toolName],
              ...state,
              lastVisited: new Date().toISOString(),
            },
          },
        }));
      },

      getToolState: (toolName) => {
        return get().toolStates[toolName];
      },

      setLastUsedTool: (toolName) => {
        set({ lastUsedTool: toolName });
      },

      addPreloadedTool: (toolName) => {
        set((prev) => ({
          preloadedTools: Array.from(
            new Set([...prev.preloadedTools, toolName])
          ),
        }));
      },

      clearToolState: (toolName) => {
        set((prev) => {
          const newToolStates = { ...prev.toolStates };
          delete newToolStates[toolName];
          return { toolStates: newToolStates };
        });
      },

      clearAllStates: () => {
        set({
          toolStates: {},
          lastUsedTool: 'dashboard',
          preloadedTools: ['dashboard'],
        });
      },
    }),
    {
      name: 'studio-navigation-store',
      partialize: (state) => ({
        lastUsedTool: state.lastUsedTool,
        preloadedTools: state.preloadedTools,

        toolStates: Object.fromEntries(
          Object.entries(state.toolStates).map(([key, value]) => [
            key,
            {
              lastVisited: value.lastVisited,

              preferences: value.preferences,
            },
          ])
        ),
      }),
    }
  )
);

export default useStudioNavigationStore;

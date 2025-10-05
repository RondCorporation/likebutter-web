import { create } from 'zustand';
import { getMySubscription } from '@/app/_lib/apis/subscription.api';
import { SubscriptionDetails } from '@/app/_types/subscription';

interface SubscriptionState {
  subscription: SubscriptionDetails | null;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
  fetchSubscription: () => Promise<void>;
  clearSubscription: () => void;
}

export const useSubscriptionStore = create<SubscriptionState>((set) => ({
  subscription: null,
  isLoading: false,
  isInitialized: false,
  error: null,

  fetchSubscription: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await getMySubscription();
      if (response.data) {
        set({
          subscription: response.data,
          isLoading: false,
          isInitialized: true,
          error: null,
        });
      } else {
        set({
          subscription: null,
          isLoading: false,
          isInitialized: true,
          error: null,
        });
      }
    } catch (err: any) {
      // 404 means no subscription, which is valid for FREE plan
      if (err.status === 404) {
        set({
          subscription: null,
          isLoading: false,
          isInitialized: true,
          error: null,
        });
      } else {
        set({
          subscription: null,
          isLoading: false,
          isInitialized: true,
          error: err.message || 'Failed to fetch subscription',
        });
      }
    }
  },

  clearSubscription: () => {
    set({
      subscription: null,
      isLoading: false,
      isInitialized: false,
      error: null,
    });
  },
}));

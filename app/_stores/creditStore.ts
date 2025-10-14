import { create } from 'zustand';
import { getCreditBalance, CreditBalance } from '@/app/_lib/apis/credit.api';

interface CreditState {
  creditBalance: CreditBalance | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchCreditBalance: () => Promise<void>;
  deductCredit: (amount: number) => void;
  addCredit: (amount: number) => void;
  refetchCredit: () => Promise<void>;
  setCreditBalance: (balance: CreditBalance) => void;
}

export const useCreditStore = create<CreditState>((set, get) => ({
  creditBalance: null,
  isLoading: false,
  error: null,

  fetchCreditBalance: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await getCreditBalance();

      if (response.status === 200 && response.data) {
        set({
          creditBalance: response.data,
          isLoading: false,
          error: null,
        });
      } else {
        throw new Error('Failed to fetch credit balance');
      }
    } catch (err: any) {
      // Don't log authentication errors (401) - these are expected for non-authenticated users
      const isAuthError = err.message?.includes('Authentication failed');

      set({
        error: err.message || 'Failed to fetch credit balance',
        isLoading: false,
      });

      if (!isAuthError) {
        console.error('Credit balance fetch error:', err);
      }
    }
  },

  deductCredit: (amount: number) => {
    const { creditBalance } = get();
    if (!creditBalance) return;

    const newBalance = Math.max(0, creditBalance.currentBalance - amount);
    set({
      creditBalance: {
        ...creditBalance,
        currentBalance: newBalance,
        totalSpent: creditBalance.totalSpent + amount,
      },
    });
  },

  addCredit: (amount: number) => {
    const { creditBalance } = get();
    if (!creditBalance) return;

    set({
      creditBalance: {
        ...creditBalance,
        currentBalance: creditBalance.currentBalance + amount,
        totalEarned: creditBalance.totalEarned + amount,
      },
    });
  },

  refetchCredit: async () => {
    await get().fetchCreditBalance();
  },

  setCreditBalance: (balance: CreditBalance) => {
    set({ creditBalance: balance });
  },
}));

'use client';

import { useEffect } from 'react';
import { useCreditStore } from '@/app/_stores/creditStore';
import { useAuth } from './useAuth';

export function useCredit() {
  const { creditBalance, isLoading, error, fetchCreditBalance, refetchCredit } =
    useCreditStore();
  const { isAuthenticated, isInitialized } = useAuth();

  useEffect(() => {
    // Only fetch credit balance if user is authenticated
    if (isInitialized && isAuthenticated && !creditBalance) {
      fetchCreditBalance();
    }

    // Listen for credit-updated events (e.g., from attendance)
    const handleCreditUpdate = () => {
      if (isAuthenticated) {
        refetchCredit();
      }
    };

    window.addEventListener('credit-updated', handleCreditUpdate);

    return () => {
      window.removeEventListener('credit-updated', handleCreditUpdate);
    };
  }, [creditBalance, fetchCreditBalance, refetchCredit, isAuthenticated, isInitialized]);

  return {
    creditBalance,
    currentBalance: creditBalance?.currentBalance || 0,
    isLoading,
    error,
    refetch: refetchCredit,
  };
}

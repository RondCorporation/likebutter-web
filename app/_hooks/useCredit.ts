'use client';

import { useEffect } from 'react';
import { useCreditStore } from '@/app/_stores/creditStore';

export function useCredit() {
  const { creditBalance, isLoading, error, fetchCreditBalance, refetchCredit } =
    useCreditStore();

  useEffect(() => {
    // Initial fetch
    if (!creditBalance) {
      fetchCreditBalance();
    }

    // Listen for credit-updated events (e.g., from attendance)
    const handleCreditUpdate = () => {
      refetchCredit();
    };

    window.addEventListener('credit-updated', handleCreditUpdate);

    return () => {
      window.removeEventListener('credit-updated', handleCreditUpdate);
    };
  }, [creditBalance, fetchCreditBalance, refetchCredit]);

  return {
    creditBalance,
    currentBalance: creditBalance?.currentBalance || 0,
    isLoading,
    error,
    refetch: refetchCredit,
  };
}

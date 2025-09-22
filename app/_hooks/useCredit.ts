'use client';

import { useState, useEffect } from 'react';
import { getCreditBalance, CreditBalance } from '@/app/_lib/apis/credit.api';

export function useCredit() {
  const [creditBalance, setCreditBalance] = useState<CreditBalance | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCreditBalance = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getCreditBalance();

      if (response.status === 200 && response.data) {
        setCreditBalance(response.data);
      } else {
        throw new Error('Failed to fetch credit balance');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch credit balance');
      console.error('Credit balance fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCreditBalance();

    // 크레딧 업데이트 이벤트 리스너 추가
    const handleCreditUpdate = () => {
      fetchCreditBalance();
    };

    window.addEventListener('credit-updated', handleCreditUpdate);

    return () => {
      window.removeEventListener('credit-updated', handleCreditUpdate);
    };
  }, []);

  return {
    creditBalance,
    currentBalance: creditBalance?.currentBalance || 0,
    isLoading,
    error,
    refetch: fetchCreditBalance,
  };
}
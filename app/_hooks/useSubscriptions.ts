'use client';

import useSWR from 'swr';
import { getSubscriptions } from '@/lib/apis/subscription.api.client';
import { Subscription } from '@/types/subscription';

export function useSubscriptions() {
  const { data, error, isLoading, mutate } = useSWR(
    '/subscriptions',
    async () => {
      const response = await getSubscriptions();
      return response.data || [];
    },
    {
      revalidateOnFocus: false,
      dedupingInterval: 30000, // 30초간 중복 요청 방지
      errorRetryCount: 3,
      errorRetryInterval: 5000,
    }
  );

  const activeSubscription =
    data?.find((s: Subscription) => s.status === 'ACTIVE') || null;

  return {
    subscriptions: data || [],
    activeSubscription,
    isLoading,
    isError: !!error,
    error,
    mutate,
  };
}

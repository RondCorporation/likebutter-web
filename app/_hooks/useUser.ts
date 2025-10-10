'use client';

import useSWR from 'swr';
import { getMe } from '@/lib/apis/user.api';
import { User } from '@/types/api';

export function useUser() {
  const { data, error, isLoading, mutate } = useSWR(
    'user-me',
    async () => {
      const response = await getMe();
      return response.data;
    },
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
      errorRetryCount: 3,
      errorRetryInterval: 5000,
    }
  );

  return {
    user: data,
    isLoading,
    isError: !!error,
    error,
    mutate,
  };
}

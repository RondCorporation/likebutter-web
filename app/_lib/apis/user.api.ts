import { apiFetch } from '../apiClient';
import { ApiResponse } from '@/app/_types/api';
import { User } from '@/app/_types/api';

export const getMe = (): Promise<ApiResponse<User>> => {
  if (typeof window === 'undefined') {
    return Promise.reject(
      new Error('getMe should only be called on client-side')
    );
  }

  return apiFetch<User>('/users/me', { method: 'GET' }, true);
};

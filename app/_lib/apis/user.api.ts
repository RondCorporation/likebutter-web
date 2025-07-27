import { apiFetch, ApiResponse } from '../apiClient';
import { User } from '@/stores/authStore';

export const getMe = (token?: string): Promise<ApiResponse<User>> => {
  return apiFetch<User>('/users/me', {}, true, token);
};

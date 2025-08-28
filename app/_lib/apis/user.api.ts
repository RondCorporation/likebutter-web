import { apiFetch, getAccessToken } from '../apiClient';
import { ApiResponse } from '@/app/_types/api';
import { User } from '@/app/_types/api';

export const getMe = (): Promise<ApiResponse<User>> => {
  if (typeof window === 'undefined') {
    console.log('🚫 getMe: Called on server-side, rejecting');
    return Promise.reject(new Error('getMe should only be called on client-side'));
  }
  
  const accessToken = getAccessToken();
  if (!accessToken) {
    console.log('⚠️ getMe: No access token found, but making API call anyway');
  } else {
    console.log('🔑 getMe: Access token found, making API call');
  }
  
  console.log('📡 getMe: Making API call to /users/me');
  // Always make the API call regardless of token presence
  // The server will return 401 if token is missing/invalid
  return apiFetch<User>('/users/me', { method: 'GET' }, true);
};

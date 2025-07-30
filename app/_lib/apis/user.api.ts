import { apiFetch, getAccessToken } from '../apiClient';
import { ApiResponse } from '@/app/_types/api';
import { User } from '@/stores/authStore';

export const getMe = (): Promise<ApiResponse<User>> => {
  const accessToken = getAccessToken();
  if (!accessToken) {
    // 액세스 토큰이 없으면, API 요청을 보내지 않고 즉시 거부된 Promise를 반환합니다.
    // 이렇게 하면 불필요한 네트워크 요청을 막고, 인증이 필요한 로직이 실행되는 것을 방지할 수 있습니다.
    return Promise.reject(new Error('Access token not found.'));
  }
  return apiFetch<User>('/users/me', { method: 'GET' }, true);
};

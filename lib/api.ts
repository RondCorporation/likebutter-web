import { useAuthStore } from '@/stores/authStore';
import {
  Page,
  Task,
  TaskImageUrlResponse,
  TaskStatusResponse,
} from '@/types/task';

export interface ApiResponse<T> {
  status: number;
  data?: T;
  msg?: string;
}

const BASE = process.env.NEXT_PUBLIC_API_BASE;

let refreshPromise: Promise<string | null> | null = null;

const handleLogout = () => {
  useAuthStore.getState().logout();
  if (typeof window !== 'undefined') {
    window.location.href = '/login?reason=session_expired';
  }
};

async function refreshToken(): Promise<string | null> {
  if (refreshPromise) return refreshPromise;

  console.log('Attempting to refresh token...');
  refreshPromise = (async () => {
    try {
      const res = await fetch(`${BASE}/auth/reissue`, {
        method: 'POST',
        credentials: 'include',
      });

      if (!res.ok) {
        throw new Error(`Token refresh failed with status ${res.status}`);
      }

      const json: ApiResponse<{ accessToken: { value: string } }> =
        await res.json();

      if (!json.data?.accessToken?.value) {
        throw new Error(
          json.msg || 'Token refresh failed: No new token received'
        );
      }

      const newAccessToken = json.data.accessToken.value;
      console.log('Token refreshed successfully.');
      useAuthStore.getState().setToken(newAccessToken);
      return newAccessToken;
    } catch (error) {
      console.error('Token refresh failed, logging out:', error);
      handleLogout();
      return null;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

export async function apiFetch<T>(
  url: string,
  opts: Omit<RequestInit, 'body'> & { body?: any } = {},
  withAuth = true
): Promise<ApiResponse<T>> {
  const makeRequest = async (token: string | null): Promise<ApiResponse<T>> => {
    const isMultipart = opts.body instanceof FormData;

    const headers: HeadersInit = isMultipart
      ? {}
      : { 'Content-Type': 'application/json' };

    if (withAuth && token) {
      headers.Authorization = `Bearer ${token}`;
    }

    Object.assign(headers, opts.headers);

    const config: RequestInit = {
      credentials: 'include',
      ...opts,
      headers,
    };

    if (opts.body && !isMultipart) {
      config.body = JSON.stringify(opts.body);
    }

    try {
      const res = await fetch(`${BASE}${url}`, config);

      if (res.status === 401 && withAuth) {
        console.log(`Received 401 for ${url}. Attempting to refresh token.`);
        const newToken = await refreshToken();
        if (newToken) {
          console.log(`Retrying ${url} with new token...`);
          return makeRequest(newToken);
        } else {
          throw new Error('Your session has expired. Please log in again.');
        }
      }

      const text = await res.text();
      let json: ApiResponse<T>;
      try {
        json = text
          ? JSON.parse(text)
          : { status: res.status, msg: res.statusText };
      } catch (e) {
        console.error('Failed to parse API response:', text, 'URL:', url);
        throw new Error(
          `Failed to parse server response. Status: ${res.status}`
        );
      }

      if (!res.ok) {
        console.error(`API Error for ${url}:`, json.msg || res.statusText);

        throw new Error(
          json.msg ?? `Request failed: ${res.statusText} (${res.status})`
        );
      }

      return json;
    } catch (error: any) {
      const userFriendlyError = new Error(
        error.message || 'An unknown error occurred. Please try again later.'
      );
      console.error('API Fetch Error:', error);

      throw userFriendlyError;
    }
  };

  return makeRequest(useAuthStore.getState().token);
}

export const getTaskHistory = (
  page: number,
  filters: { status?: string; actionType?: string }
) => {
  const params = new URLSearchParams({
    page: page.toString(),
    size: '10',
    sort: 'createdAt,desc',
  });
  if (filters.status) params.append('status', filters.status);
  if (filters.actionType) params.append('actionType', filters.actionType);

  return apiFetch<Page<Task>>(`/tasks/me?${params.toString()}`);
};

export const getTaskStatus = (taskId: number) => {
  return apiFetch<TaskStatusResponse>(`/tasks/${taskId}/status`);
};

export const getTaskImageUrl = (taskId: number) => {
  return apiFetch<TaskImageUrlResponse>(`/tasks/${taskId}/image`);
};

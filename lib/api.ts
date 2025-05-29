import { useAuthStore } from '@/stores/authStore';

export interface ApiResponse<T> {
  status: number;
  data?: T;
  msg?: string;
}

const BASE = process.env.NEXT_PUBLIC_API_BASE;

let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

const getAuthStore = () => useAuthStore.getState();

async function refreshToken(): Promise<string | null> {
  console.log('Attempting to refresh token...');
  try {
    const res = await fetch(`${BASE}/auth/reissue`, {
      method: 'POST',
      credentials: 'include',
    });

    const json: ApiResponse<{ accessToken: { value: string } }> =
      await res.json();

    if (!res.ok || !json.data?.accessToken?.value) {
      throw new Error(json.msg || 'Token refresh failed');
    }

    const newAccessToken = json.data.accessToken.value;
    console.log('Token refreshed successfully.');
    localStorage.setItem('accessToken', newAccessToken);
    getAuthStore().setToken(newAccessToken);
    return newAccessToken;
  } catch (error) {
    console.error('Token refresh failed:', error);
    getAuthStore().logout();
    if (typeof window !== 'undefined') {
      alert('Session expired. Please log in again.');
      window.location.href = '/login';
    }
    return null;
  }
}

export async function apiFetch<T>(
  url: string,
  opts: RequestInit = {},
  withAuth = true
): Promise<ApiResponse<T>> {
  let token = getAuthStore().token;

  const makeRequest = async (
    currentToken: string | null
  ): Promise<ApiResponse<T>> => {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(withAuth && currentToken
        ? { Authorization: `Bearer ${currentToken}` }
        : {}),
      ...opts.headers,
    };

    if (url === '/auth/reissue') {
      delete (headers as any)['Content-Type'];
      opts.method = 'POST';
      opts.body = undefined;
    }

    if (
      url === '/auth/sign-up' ||
      url === '/countries' ||
      url === '/auth/login'
    ) {
      withAuth = false; // These don't need auth header initially
      delete (headers as any)['Authorization'];
    }

    const res = await fetch(`${BASE}${url}`, {
      credentials: 'include',
      ...opts,
      headers,
    });

    const text = await res.text();
    const json: ApiResponse<T> = text
      ? JSON.parse(text)
      : { status: res.status };

    if (!res.ok) {
      if (res.status === 401 && withAuth && url !== '/auth/reissue') {
        if (!isRefreshing) {
          isRefreshing = true;
          refreshPromise = refreshToken();
        }

        const newToken = await refreshPromise;
        isRefreshing = false;
        refreshPromise = null;

        if (newToken) {
          console.log('Retrying original request with new token...');
          return makeRequest(newToken);
        } else {
          throw new Error(json.msg || 'Session expired or refresh failed.');
        }
      }
      throw new Error(
        json.msg ?? `Request failed: ${res.statusText} (${res.status})`
      );
    }

    return json;
  };

  return makeRequest(token);
}

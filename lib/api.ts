import { useAuthStore } from '@/stores/authStore';

export interface ApiResponse<T> {
  status: number;
  data?: T;
  msg?: string;
}

const BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8080';

let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

const getAuthStore = () => useAuthStore.getState();

const forceLogout = () => {
  getAuthStore().logout();
  if (
    typeof window !== 'undefined' &&
    !window.location.pathname.startsWith('/login')
  ) {
    console.warn('Forcing logout due to API/Refresh failure.');
    // alert('Your session has expired. Please log in again.');
    window.location.href = '/login';
  }
};

async function refreshToken(): Promise<string | null> {
  console.log('Attempting to refresh token...');
  try {
    const res = await fetch(`${BASE}/auth/reissue`, {
      method: 'POST',
      credentials: 'include',
    });

    if (!res.ok) {
      let errorMsg = 'Token refresh failed';
      try {
        const errorJson = await res.json();
        errorMsg = errorJson.msg || `Token refresh failed (${res.status})`;
      } catch (e) {
        /* ignore */
      }
      throw new Error(errorMsg);
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
    localStorage.setItem('accessToken', newAccessToken);
    getAuthStore().setToken(newAccessToken);
    return newAccessToken;
  } catch (error) {
    console.error('Token refresh failed:', error);
    forceLogout();
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

    if (opts.method === 'DELETE' && url === '/auth/logout') {
      delete (headers as any)['Content-Type'];
      opts.body = undefined;
    } else if (opts.body === undefined || opts.body === null) {
      delete (headers as any)['Content-Type'];
    }

    if (
      url === '/auth/sign-up' ||
      url === '/countries' ||
      url === '/auth/login' ||
      url === '/auth/reissue'
    ) {
      withAuth = false;
      delete (headers as any)['Authorization'];
    }

    const res = await fetch(`${BASE}${url}`, {
      credentials: 'include',
      ...opts,
      headers,
    });

    const text = await res.text();
    let json: ApiResponse<T>;

    try {
      json = text
        ? JSON.parse(text)
        : { status: res.status, msg: res.statusText };
    } catch (e) {
      console.error('Failed to parse API response:', text, 'URL:', url);
      throw new Error(`Failed to parse server response. Status: ${res.status}`);
    }

    if (!res.ok) {
      if (
        res.status === 401 &&
        withAuth &&
        url !== '/auth/reissue' &&
        !isRefreshing
      ) {
        console.log(`Received 401 for ${url}. Attempting token refresh...`);

        if (!refreshPromise) {
          isRefreshing = true;
          refreshPromise = refreshToken();
        }

        const newToken = await refreshPromise;
        isRefreshing = false;
        refreshPromise = null;

        if (newToken) {
          console.log(`Retrying ${url} with new token...`);
          return makeRequest(newToken);
        } else {
          throw new Error(json.msg || 'Session expired or refresh failed.');
        }
      } else if (res.status === 401) {
        console.error(`401 Error for ${url} (cannot refresh). Logging out.`);
        forceLogout();
        throw new Error(json.msg || 'Authentication failed.');
      }

      console.error(`API Error for ${url}:`, json.msg || res.statusText);
      throw new Error(
        json.msg ?? `Request failed: ${res.statusText} (${res.status})`
      );
    }

    return json;
  };

  return makeRequest(token);
}

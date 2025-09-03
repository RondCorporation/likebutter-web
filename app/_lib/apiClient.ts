import { useUIStore } from '@/stores/uiStore';
import { ApiResponse } from '@/app/_types/api';

const API_URL =
  process.env.NODE_ENV === 'development'
    ? '/api'
    : process.env.NEXT_PUBLIC_API_URL;

const getCookie = (name: string) => {
  if (typeof window === 'undefined') return null;
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? match[2] : null;
};

export const getAccessToken = () => {
  if (typeof window === 'undefined') {
    return null;
  }
  const token = getCookie('accessToken');
  return token;
};

let refreshPromise: Promise<boolean> | null = null;

async function refreshToken(): Promise<boolean> {
  if (refreshPromise) {
    return refreshPromise;
  }

  console.log('[AUTH] Attempting to refresh token...');
  refreshPromise = (async (): Promise<boolean> => {
    try {
      const res = await fetch(`${API_URL}/auth/reissue`, {
        method: 'POST',
        credentials: 'include',
      });

      if (!res.ok) {
        // This is an expected failure if the refresh token is invalid or expired.
        // It should not be logged as an error.
        console.log(`[AUTH] Token refresh failed with status: ${res.status}.`);
        return false;
      }

      console.log('[AUTH] Token refresh successful.');
      return true;
    } catch (error) {
      // This indicates a network or server error, which is worth logging.
      console.warn('[AUTH] Network error during token refresh:', error);
      return false;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

// --- Main API Fetch Function ---
export async function apiFetch<T>(
  url: string,
  opts: Omit<RequestInit, 'body'> & { body?: any } = {},
  withAuth = true
): Promise<ApiResponse<T>> {
  const performRequest = async (token: string | null) => {
    const isMultipart = opts.body instanceof FormData;
    const headers: HeadersInit = isMultipart
      ? {}
      : { 'Content-Type': 'application/json' };

    if (withAuth && token) {
      headers.Authorization = `Bearer ${token}`;
    }

    Object.assign(headers, opts.headers);

    const config: RequestInit = {
      ...opts,
      headers,
      credentials: 'include',
    };

    if (opts.body && !isMultipart) {
      config.body = JSON.stringify(opts.body);
    }

    return fetch(`${API_URL}${url}`, config);
  };

  try {
    const initialToken = getCookie('accessToken');
    let response = await performRequest(initialToken);

    if (response.status === 401 && withAuth) {
      console.log(`[AUTH] Unauthorized for ${url}. Refreshing token...`);

      const refreshSuccessful = await refreshToken();

      if (refreshSuccessful) {
        const newToken = getCookie('accessToken');
        response = await performRequest(newToken);
      } else {
        window.dispatchEvent(new CustomEvent('auth-failure'));
        throw new Error(
          'Authentication failed: Token refresh was unsuccessful.'
        );
      }
    }

    const text = await response.text();
    const json: ApiResponse<T> = text
      ? JSON.parse(text)
      : { status: response.status, msg: response.statusText };

    if (!response.ok) {
      throw new Error(
        json.msg ??
          `Request failed: ${response.statusText} (${response.status})`
      );
    }

    return json;
  } catch (error: any) {
    // Log only unexpected errors. Auth failures are handled and thrown intentionally.
    if (!error.message.includes('Authentication failed')) {
      console.error(`API Fetch Error for ${url} (client):`, error.message);
    }

    if (error.message.includes('Failed to fetch')) {
      useUIStore
        .getState()
        .setServerError(
          'Unable to connect to the service. Please try again later.'
        );
    }
    throw error;
  }
}

export const apiClient = {
  get: <T>(url: string, opts: Omit<RequestInit, 'body'> = {}) =>
    apiFetch<T>(url, { ...opts, method: 'GET' }),
  post: <T>(url: string, body?: any, opts: Omit<RequestInit, 'body'> = {}) =>
    apiFetch<T>(url, { ...opts, method: 'POST', body }),
  patch: <T>(url: string, body?: any, opts: Omit<RequestInit, 'body'> = {}) =>
    apiFetch<T>(url, { ...opts, method: 'PATCH', body }),
  put: <T>(url: string, body?: any, opts: Omit<RequestInit, 'body'> = {}) =>
    apiFetch<T>(url, { ...opts, method: 'PUT', body }),
  delete: <T>(url: string, opts: Omit<RequestInit, 'body'> = {}) =>
    apiFetch<T>(url, { ...opts, method: 'DELETE' }),
};

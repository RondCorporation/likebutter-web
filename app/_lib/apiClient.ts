import { useUIStore } from '@/stores/uiStore';
import { ApiResponse } from '@/app/_types/api';

const API_URL =
  process.env.NODE_ENV === 'development'
    ? '/api'
    : process.env.NEXT_PUBLIC_API_URL;

const getAccessTokenCookie = () => {
  if (typeof window === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^| )accessToken=([^;]+)'));
  return match ? match[2] : null;
};

const deleteAccessTokenCookie = () => {
  if (typeof window === 'undefined') return;
  console.log('Deleting access token cookie due to auth failure.');
  document.cookie = 'accessToken=; path=/; max-age=-1;';
};

let refreshPromise: Promise<string | null> | null = null;

async function refreshToken(): Promise<string | null> {
  if (refreshPromise) {
    console.log('[AUTH] A token refresh is already in progress. Waiting...');
    return refreshPromise;
  }

  console.log('[AUTH] Attempting to refresh token via internal API route...');
  refreshPromise = (async () => {
    try {
      const res = await fetch(`/api/auth/reissue`, {
        method: 'POST',
        credentials: 'include',
      });

      console.log(`[AUTH] Refresh API response status: ${res.status}`);

      if (!res.ok) {
        console.error(`[AUTH] Token refresh API failed. Status: ${res.status}`);
        const errorBody = await res.text();
        console.error(`[AUTH] Refresh API error body: ${errorBody}`);
        return null;
      }

      const json = await res.json();
      console.log('[AUTH] Refresh API response JSON:', json);

      const newAccessToken = json.newAccessToken;

      if (!newAccessToken) {
        console.error(
          '[AUTH] Token refresh failed: No new access token in response body.'
        );
        return null;
      }

      console.log(
        `[AUTH] Token refreshed successfully. New accessToken: ${newAccessToken.substring(
          0,
          15
        )}...`
      );
      return newAccessToken;
    } catch (error) {
      console.error('[AUTH] Error during token refresh fetch:', error);
      return null;
    } finally {
      console.log('[AUTH] Resetting refresh promise.');
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
    const initialToken = withAuth ? getAccessTokenCookie() : null;
    let response = await performRequest(initialToken);

    if (response.status === 401 && withAuth) {
      console.log(`[AUTH] Received 401 for ${url}. Refreshing token...`);

      deleteAccessTokenCookie();

      const newToken = await refreshToken();

      if (newToken) {
        console.log(`[AUTH] Retrying ${url} with new token.`);
        response = await performRequest(newToken);
      } else {
        console.log('[AUTH] Refresh failed. Session expired.');
        window.dispatchEvent(new CustomEvent('auth-failure'));
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
    console.error(`API Fetch Error for ${url} (client):`, error.message);
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

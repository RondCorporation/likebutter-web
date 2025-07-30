import { cookies } from 'next/headers';
import { ApiResponse } from '@/app/_types/api';

const API_URL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000/api'
    : process.env.NEXT_PUBLIC_API_URL;

const APP_URL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000/api'
    : process.env.NEXT_PUBLIC_APP_URL;

async function refreshToken(): Promise<string | null> {
  console.log('[API_SERVER] Attempting to refresh token via internal route.');
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore
      .getAll()
      .map((cookie) => `${cookie.name}=${cookie.value}`)
      .join('; ');

    const res = await fetch(`${APP_URL}/api/auth/reissue`, {
      method: 'POST',
      headers: {
        Cookie: cookieHeader,
      },
      cache: 'no-store',
    });

    console.log(
      `[API_SERVER] Internal refresh route response status: ${res.status}`
    );

    if (!res.ok) {
      console.error(
        `[API_SERVER] Internal refresh route failed. Status: ${res.status}`
      );
      return null;
    }

    const body = await res.json();
    const newAccessToken = body.newAccessToken;

    if (!newAccessToken) {
      console.error(
        '[API_SERVER] No new access token in internal refresh route response.'
      );
      return null;
    }

    console.log(
      `[API_SERVER] Token refreshed successfully via internal route.`
    );
    return newAccessToken;
  } catch (error) {
    console.error(
      '[API_SERVER] Error during internal token refresh fetch:',
      error
    );
    return null;
  }
}

async function apiFetch<T>(
  url: string,
  opts: Omit<RequestInit, 'body'> & { body?: any } = {},
  withAuth = true
): Promise<ApiResponse<T>> {
  console.log(`[DEBUG] apiFetch: Starting for URL: ${url}`, { withAuth });

  const performRequest = async (token: string | null): Promise<Response> => {
    console.log(`[DEBUG] performRequest: Executing for URL: ${url}`);
    if (token) {
      console.log(
        `[DEBUG] performRequest: Using token: ${token.substring(0, 15)}...`
      );
    } else {
      console.log('[DEBUG] performRequest: No token provided.');
    }

    const cookieStore = await cookies();
    const isMultipart = opts.body instanceof FormData;
    const headers: HeadersInit = isMultipart
      ? {}
      : { 'Content-Type': 'application/json' };

    if (withAuth && token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const allCookies = cookieStore
      .getAll()
      .map((c) => `${c.name}=${c.value}`)
      .join('; ');
    if (allCookies) {
      headers.Cookie = allCookies;
    }
    console.log('[DEBUG] performRequest: Headers prepared:', { ...headers });

    Object.assign(headers, opts.headers);

    const config: RequestInit = {
      ...opts,
      headers,
      cache: 'no-store',
    };

    if (opts.body && !isMultipart) {
      config.body = JSON.stringify(opts.body);
    }

    console.log(`[DEBUG] performRequest: Fetching ${API_URL}${url}`);
    return fetch(`${API_URL}${url}`, config);
  };

  try {
    const cookieStore = await cookies();
    const initialToken = withAuth
      ? cookieStore.get('accessToken')?.value || null
      : null;
    console.log(
      `[DEBUG] apiFetch: Initial token from cookie: ${
        initialToken?.substring(0, 15) ?? 'null'
      }`
    );

    let response = await performRequest(initialToken);
    console.log(
      `[DEBUG] apiFetch: Initial response status: ${response.status}`
    );

    if (response.status === 401 && withAuth) {
      console.log(
        `[DEBUG] apiFetch: Received 401 for ${url}. Refreshing token...`
      );
      const newToken = await refreshToken();

      if (newToken) {
        console.log(`[DEBUG] apiFetch: Retrying ${url} with new token.`);
        response = await performRequest(newToken);
        console.log(
          `[DEBUG] apiFetch: Retry response status: ${response.status}`
        );
      } else {
        console.log(
          '[DEBUG] apiFetch: Refresh failed. Retrying without access token.'
        );
        response = await performRequest(null);
      }
    }

    const text = await response.text();
    console.log(
      `[DEBUG] apiFetch: Response text received (first 100 chars): ${text.substring(
        0,
        100
      )}`
    );

    const json: ApiResponse<T> = text
      ? JSON.parse(text)
      : { status: response.status, msg: response.statusText };
    console.log('[DEBUG] apiFetch: Response JSON parsed.');

    if (!response.ok) {
      console.error('[DEBUG] apiFetch: Response not OK. Throwing error.', json);
      throw new Error(
        json.msg ??
          `Request failed: ${response.statusText} (${response.status})`
      );
    }

    console.log('[DEBUG] apiFetch: Request successful. Returning JSON.');
    return json;
  } catch (error: any) {
    console.error(
      `[DEBUG] apiFetch: Final catch block for ${url}:`,
      error.message
    );
    throw error;
  }
}

export const apiServer = {
  get: <T>(url: string, withAuth = true) =>
    apiFetch<T>(url, { method: 'GET' }, withAuth),
  post: <T>(url: string, body: any, withAuth = true) =>
    apiFetch<T>(url, { method: 'POST', body }, withAuth),
  put: <T>(url: string, body: any, withAuth = true) =>
    apiFetch<T>(url, { method: 'PUT', body }, withAuth),
  delete: <T>(url: string, withAuth = true) =>
    apiFetch<T>(url, { method: 'DELETE' }, withAuth),
};

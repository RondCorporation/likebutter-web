import { useAuthStore } from '@/stores/authStore';
import { parse } from 'cookie';

export interface ApiResponse<T> {
  status: number;
  data?: T;
  msg?: string;
}

const BASE = process.env.NEXT_PUBLIC_API_BASE;
const IS_SERVER = typeof window === 'undefined';

let refreshPromise: Promise<string | null> | null = null;

const handleLogout = async () => {
  if (IS_SERVER) {
    throw new Error('Your session has expired. Please log in again.');
  } else {
    useAuthStore.getState().logout();
    window.location.href = '/login?reason=session_expired';
  }
};

async function refreshToken(): Promise<string | null> {
  if (refreshPromise) return refreshPromise;

  console.log('Attempting to refresh token...');
  refreshPromise = (async () => {
    try {
      const fetchOptions: RequestInit = {
        method: 'POST',
      };

      if (IS_SERVER) {
        const { cookies } = await import('next/headers');
        const cookieStore = await cookies();
        const refreshToken = cookieStore.get('refreshToken')?.value;
        if (!refreshToken) {
          throw new Error('No refresh token found in server-side cookies.');
        }
        fetchOptions.headers = {
          Cookie: `refreshToken=${refreshToken}`,
        };
      } else {
        fetchOptions.credentials = 'include';
      }

      const res = await fetch(`${BASE}/auth/reissue`, fetchOptions);

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

      if (IS_SERVER) {
        const { cookies } = await import('next/headers');
        const cookieStore = await cookies();

        cookieStore.set('accessToken', newAccessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          path: '/',
          sameSite: 'lax',
        });

        const newRefreshTokenCookie = res.headers.get('set-cookie');
        if (newRefreshTokenCookie) {
          const parsedCookie = parse(newRefreshTokenCookie);
          const [rtName, rtValue] = Object.entries(parsedCookie)[0];

          // Extract cookie attributes, providing defaults that match the backend policy
          const httpOnly = newRefreshTokenCookie
            .toLowerCase()
            .includes('httponly');
          const secure = newRefreshTokenCookie.toLowerCase().includes('secure');
          const sameSite =
            (parsedCookie.SameSite?.toLowerCase() as
              | 'strict'
              | 'lax'
              | 'none'
              | undefined) ?? 'strict';
          const path = parsedCookie.Path ?? '/auth/reissue';

          if (rtName && rtValue) {
            cookieStore.set(rtName, rtValue, {
              httpOnly,
              secure,
              path,
              sameSite,
              // 'max-age' or 'expires' should also be forwarded if present
              ...(parsedCookie['Max-Age'] && {
                maxAge: parseInt(parsedCookie['Max-Age'], 10),
              }),
              ...(parsedCookie.Expires && {
                expires: new Date(parsedCookie.Expires),
              }),
            });
            console.log(`Forwarded new ${rtName} cookie to browser.`);
          }
        }
      } else {
        useAuthStore.getState().setToken(newAccessToken);
      }

      return newAccessToken;
    } catch (error) {
      console.error('Token refresh failed, logging out:', error);
      if (!IS_SERVER) {
        await handleLogout();
      }
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
  withAuth = true,
  tokenOverride: string | null = null
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
      ...opts,
      headers,
    };

    if (!IS_SERVER) {
      config.credentials = 'include';
    } else {
      const { cookies } = await import('next/headers');
      const cookieStore = await cookies();
      const cookieHeader = cookieStore
        .getAll()
        .map((cookie) => `${cookie.name}=${cookie.value}`)
        .join('; ');

      if (cookieHeader) {
        headers.Cookie = cookieHeader;
      }
    }

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
        const errorMessage =
          json.msg ?? `Request failed: ${res.statusText} (${res.status})`;
        console.error(`API Error for ${url}:`, errorMessage);
        throw new Error(errorMessage);
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

  let token: string | null = tokenOverride;

  if (!token && withAuth) {
    if (IS_SERVER) {
      const { cookies } = await import('next/headers');
      token = (await cookies()).get('accessToken')?.value || null;
    } else {
      token = useAuthStore.getState().token;
    }
  }

  return makeRequest(token);
}

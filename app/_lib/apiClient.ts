import { useUIStore } from '@/stores/uiStore';
import { ApiResponse } from '@/app/_types/api';
import { toast } from 'react-hot-toast';
import i18n from '@/app/_lib/i18n-client';

const API_URL =
  process.env.NODE_ENV === 'development'
    ? ''
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

const pendingRequests = new Map<string, Promise<ApiResponse<any>>>();

async function refreshToken(): Promise<boolean> {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async (): Promise<boolean> => {
    try {
      const res = await fetch(`${API_URL}/api/v1/auth/reissue`, {
        method: 'POST',
        credentials: 'include',
      });

      if (!res.ok) {
        return false;
      }
      return true;
    } catch (error) {
      return false;
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
  const method = opts.method || 'GET';
  const isGetRequest = method === 'GET';

  const requestKey = isGetRequest ? `${method}-${url}-${withAuth}` : null;

  if (requestKey && pendingRequests.has(requestKey)) {
    return pendingRequests.get(requestKey) as Promise<ApiResponse<T>>;
  }

  const performRequest = async (token: string | null): Promise<Response> => {
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

  const requestPromise = (async (): Promise<ApiResponse<T>> => {
    try {
      const initialToken = getCookie('accessToken');
      let response = await performRequest(initialToken);

      // Only attempt token refresh if there was an initial token (user was logged in)
      if (response.status === 401 && withAuth && initialToken) {
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
        if (json.msg === 'INSUFFICIENT_CREDIT') {
          toast.error(i18n.t('common:insufficientCredits'));

          return {
            status: response.status,
            msg: 'INSUFFICIENT_CREDIT',
            data: null,
            isInsufficientCredit: true,
          } as any;
        }

        throw new Error(
          json.msg ??
            `Request failed: ${response.statusText} (${response.status})`
        );
      }

      return json;
    } catch (error: any) {
      if (error.message.includes('Failed to fetch')) {
        useUIStore
          .getState()
          .setServerError(
            'Unable to connect to the service. Please try again later.'
          );
      }
      throw error;
    } finally {
      if (requestKey) {
        pendingRequests.delete(requestKey);
      }
    }
  })();

  if (requestKey) {
    pendingRequests.set(requestKey, requestPromise);
  }

  return requestPromise;
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

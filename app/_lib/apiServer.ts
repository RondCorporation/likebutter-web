import { cookies } from 'next/headers';
import { ApiResponse, User } from '@/app/_types/api';

const API_URL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000/api'
    : process.env.NEXT_PUBLIC_API_URL;

async function apiFetch<T>(
  url: string,
  opts: RequestInit & { body?: any } = {},
  withAuth = true
): Promise<ApiResponse<T>> {
  const performRequest = async (token: string | null): Promise<Response> => {
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

    Object.assign(headers, opts.headers);

    const config: RequestInit = {
      ...opts,
      headers,
      // Only force no-store if not explicitly set
      cache: opts.cache || 'no-store',
    };

    if (opts.body && !isMultipart) {
      config.body = JSON.stringify(opts.body);
    }

    return fetch(`${API_URL}${url}`, config);
  };

  try {
    const initialToken = withAuth
      ? (await cookies()).get('accessToken')?.value || null
      : null;

    const response = await performRequest(initialToken);

    const text = await response.text();
    const json: ApiResponse<T> = text
      ? JSON.parse(text)
      : { status: response.status, msg: response.statusText };

    if (!response.ok) {
      // This is an expected error if the user is not logged in, so we don't log it as an error.
      // The calling function should handle the error.
      throw new Error(
        json.msg ??
          `Request failed: ${response.statusText} (${response.status})`
      );
    }

    return json;
  } catch (error: any) {
    // Re-throw the error to be handled by the calling server component.
    // Avoid logging here as it's not a "true" error in many cases (e.g., user not logged in).
    throw error;
  }
}

export const apiServer = {
  get: <T>(url: string, opts?: RequestInit, withAuth = true) =>
    apiFetch<T>(url, { method: 'GET', ...opts }, withAuth),
  post: <T>(url: string, body: any, opts?: RequestInit, withAuth = true) =>
    apiFetch<T>(url, { method: 'POST', body, ...opts }, withAuth),
  put: <T>(url: string, body: any, opts?: RequestInit, withAuth = true) =>
    apiFetch<T>(url, { method: 'PUT', body, ...opts }, withAuth),
  delete: <T>(url: string, opts?: RequestInit, withAuth = true) =>
    apiFetch<T>(url, { method: 'DELETE', ...opts }, withAuth),
};

/**
 * 서버 컴포넌트에서 사용자 정보를 사전 로딩하는 함수
 * 사용자가 로그인되어 있으면 User 객체를, 그렇지 않으면 null을 반환합니다.
 */
export const getMeOnServer = async (): Promise<User | null> => {
  try {
    const { data: user } = await apiServer.get<User>('/users/me');
    return user || null;
  } catch (error) {
    // 로그인되지 않은 상태에서는 에러가 발생하는 것이 정상이므로 null을 반환합니다.
    return null;
  }
};

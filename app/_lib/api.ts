import { Plan } from '@/app/_types/plan';
import {
  CreateSubscriptionResponse,
  Subscription,
  SubscriptionDetails,
} from '@/app/_types/subscription';
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
const IS_SERVER = typeof window === 'undefined';

let refreshPromise: Promise<string | null> | null = null;

const handleLogout = async () => {
  if (IS_SERVER) {
    // Deleting cookies is a side-effect that is not allowed in Server Components.
    // This should be handled by a Server Action or an API Route.
    // We throw an error to indicate that the session has expired, which will be
    // caught by the calling function.
    throw new Error('Your session has expired. Please log in again.');
  } else {
    // On client, use Zustand and redirect
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

      // On the server, we must manually handle cookies.
      // On the client, `credentials: 'include'` handles it automatically.
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

      // Store the new token based on the environment
      if (IS_SERVER) {
        const { cookies } = await import('next/headers');
        const cookieStore = await cookies();
        cookieStore.set('accessToken', newAccessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          path: '/',
          sameSite: 'lax',
        });
      } else {
        useAuthStore.getState().setToken(newAccessToken);
      }

      return newAccessToken;
    } catch (error) {
      console.error('Token refresh failed, logging out:', error);
      if (!IS_SERVER) {
        await handleLogout();
      }
      // On the server, we just return null and let the caller handle it.
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
      ...opts,
      headers,
    };

    // On the client, we need to send credentials to handle cookies automatically
    if (!IS_SERVER) {
      config.credentials = 'include';
    } else {
      // On the server, we need to manually forward cookies
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

  let token: string | null = null;
  if (IS_SERVER) {
    // On the server, get the token from cookies
    const { cookies } = await import('next/headers');
    token = (await cookies()).get('accessToken')?.value || null;
  } else {
    // On the client, get the token from Zustand store
    token = useAuthStore.getState().token;
  }

  return makeRequest(token);
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

// Payment APIs
export const getPlans = (): Promise<ApiResponse<Plan[]>> => {
  return apiFetch<Plan[]>('/plans');
};

export const registerBillingKey = (billingKey: string) => {
  return apiFetch('/subscriptions/register-billing-key', {
    method: 'POST',
    body: {
      billingKey,
    },
  });
};

export const createSubscription = (
  planKey: string
): Promise<ApiResponse<CreateSubscriptionResponse>> => {
  return apiFetch('/subscriptions/create', {
    method: 'POST',
    body: {
      planKey,
    },
  });
};

export const getSubscriptions = (): Promise<ApiResponse<Subscription[]>> => {
  return apiFetch<Subscription[]>('/subscriptions');
};

export const getSubscriptionDetails = (
  id: number
): Promise<ApiResponse<SubscriptionDetails>> => {
  return apiFetch<SubscriptionDetails>(`/subscriptions/${id}`);
};

export const upgradeSubscription = (
  id: number,
  newPlanKey: string
): Promise<ApiResponse<SubscriptionDetails>> => {
  return apiFetch<SubscriptionDetails>(`/subscriptions/${id}/upgrade`, {
    method: 'POST',
    body: {
      newPlanKey,
    },
  });
};

export const cancelSubscription = (
  subscriptionId: number
): Promise<ApiResponse<null>> => {
  return apiFetch<null>(`/subscriptions/${subscriptionId}`, {
    method: 'DELETE',
  });
};

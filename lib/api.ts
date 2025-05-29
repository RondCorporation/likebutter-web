export interface ApiResponse<T> {
  data: T;
  error?: string;
}
const BASE = process.env.NEXT_PUBLIC_API_BASE;

export async function apiFetch<T>(
  url: string,
  opts: RequestInit = {},
  withAuth = true
): Promise<ApiResponse<T>> {
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(withAuth && token ? { Authorization: `Bearer ${token}` } : {}),
    ...opts.headers,
  };
  const res = await fetch(`${BASE}${url}`, {
    credentials: 'include', // refresh‑cookie 전송
    ...opts,
    headers,
  });
  const json = (await res.json()) as ApiResponse<T>;
  if (!res.ok) throw new Error(json.error ?? 'Request failed');
  return json;
}

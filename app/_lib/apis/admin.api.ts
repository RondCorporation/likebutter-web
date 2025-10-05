import { apiClient } from '@/app/_lib/apiClient';
import { PaginatedResponse } from '@/app/_types/api';
import { Payment } from '@/app/_types/payment';

export interface AdminStats {
  totalUsers: number;
  newUsers: number;
  activeSubscriptions: number;
  totalRevenue: number;
  taskStatusCounts: {
    [key: string]: number;
  };
}

export interface Account {
  id: number;
  email: string;
  provider: 'GOOGLE' | 'KAKAO' | 'NAVER';
  roles: string;
  createdAt: string;
  updatedAt: string;
}

export interface AccountDetails extends Account {
  subscriptions: AdminSubscription[];
  payments: Payment[];
  tasks: AdminTask[];
}

export interface UserProfile {
  id: number;
  name: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  country: string;
  plan: string;
  createdAt: string;
}

export interface AdminSubscription {
  id: number;
  accountId: number;
  planKey: string;
  status: string;
  startDate: string;
  endDate: string;
}

export interface AdminTask {
  id: number;
  accountId: number;
  status: string;
  details: string;
  createdAt: string;
}

/**
 * GET /admin/stats/summary
 * 대시보드 핵심 통계 요약 정보를 조회합니다.
 */
export const getStatsSummary = async (): Promise<AdminStats> => {
  const { data } = await apiClient.get<AdminStats>('/admin/stats/summary');
  if (!data) {
    throw new Error('Failed to fetch stats summary: data is undefined.');
  }
  return data;
};

/**
 * GET /admin/accounts
 * 계정 목록을 페이지네이션으로 조회합니다.
 */
export const getAccounts = async (
  params: any
): Promise<PaginatedResponse<Account>> => {
  const queryString = new URLSearchParams(params).toString();
  const { data } = await apiClient.get<PaginatedResponse<Account>>(
    `/admin/accounts?${queryString}`
  );
  if (!data) throw new Error('Failed to fetch accounts: data is undefined.');
  return data;
};

/**
 * GET /admin/accounts/{accountId}
 * 단일 계정의 상세 정보를 조회합니다.
 */
export const getAccountDetails = async (
  accountId: number
): Promise<AccountDetails> => {
  const { data } = await apiClient.get<AccountDetails>(
    `/admin/accounts/${accountId}`
  );
  if (!data)
    throw new Error('Failed to fetch account details: data is undefined.');
  return data;
};

/**
 * PATCH /admin/accounts/{accountId}
 * 기존 계정 정보를 수정합니다.
 */
export const updateAccountRole = async (
  accountId: number,
  roles: string
): Promise<AccountDetails> => {
  const { data } = await apiClient.patch<AccountDetails>(
    `/admin/accounts/${accountId}`,
    { roles }
  );
  if (!data)
    throw new Error('Failed to update account role: data is undefined.');
  return data;
};

/**
 * GET /admin/payments
 * 결제 기록 목록을 페이지네이션으로 조회합니다.
 */
export const getPayments = async (
  params: any
): Promise<PaginatedResponse<Payment>> => {
  const queryString = new URLSearchParams(params).toString();
  const { data } = await apiClient.get<PaginatedResponse<Payment>>(
    `/admin/payments?${queryString}`
  );
  if (!data) throw new Error('Failed to fetch payments: data is undefined.');
  return data;
};

/**
 * GET /admin/subscriptions
 * 구독 목록을 페이지네이션으로 조회합니다.
 */
export const getSubscriptions = async (
  params: any
): Promise<PaginatedResponse<AdminSubscription>> => {
  const queryString = new URLSearchParams(params).toString();
  const { data } = await apiClient.get<PaginatedResponse<AdminSubscription>>(
    `/admin/subscriptions?${queryString}`
  );
  if (!data)
    throw new Error('Failed to fetch subscriptions: data is undefined.');
  return data;
};

/**
 * PATCH /admin/subscriptions/{subscriptionId}/status
 * 구독의 상태 또는 만료일을 수정합니다.
 */
export const updateSubscription = async (
  subscriptionId: number,
  payload: { status?: string; newExpiryDate?: string }
): Promise<AdminSubscription> => {
  const { data } = await apiClient.patch<AdminSubscription>(
    `/admin/subscriptions/${subscriptionId}/status`,
    payload
  );
  if (!data)
    throw new Error('Failed to update subscription: data is undefined.');
  return data;
};

/**
 * GET /admin/tasks
 * 작업 목록을 페이지네이션으로 조회합니다.
 */
export const getTasks = async (
  params: any
): Promise<PaginatedResponse<AdminTask>> => {
  const queryString = new URLSearchParams(params).toString();
  const { data } = await apiClient.get<PaginatedResponse<AdminTask>>(
    `/admin/tasks?${queryString}`
  );
  if (!data) throw new Error('Failed to fetch tasks: data is undefined.');
  return data;
};

/**
 * GET /admin/tasks/{taskId}
 * 단일 작업의 상세 정보를 조회합니다.
 */
export const getTaskDetails = async (taskId: number): Promise<AdminTask> => {
  const { data } = await apiClient.get<AdminTask>(`/admin/tasks/${taskId}`);
  if (!data)
    throw new Error('Failed to fetch task details: data is undefined.');
  return data;
};

/**
 * POST /admin/tasks/{taskId}/retry
 * 실패한 작업을 재시도합니다.
 */
export const retryTask = async (taskId: number): Promise<void> => {
  await apiClient.post(`/admin/tasks/${taskId}/retry`);
};

/**
 * GET /admin/users
 * 사용자 프로필 목록을 페이지네이션으로 조회합니다.
 */
export const getUsers = async (
  params: any
): Promise<PaginatedResponse<UserProfile>> => {
  const queryString = new URLSearchParams(params).toString();
  const { data } = await apiClient.get<PaginatedResponse<UserProfile>>(
    `/admin/users?${queryString}`
  );
  if (!data) throw new Error('Failed to fetch users: data is undefined.');
  return data;
};

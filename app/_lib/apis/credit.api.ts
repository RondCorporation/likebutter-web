import { apiFetch } from '../apiClient';
import { ApiResponse } from '@/app/_types/api';

export interface CreditBalance {
  currentBalance: number;
  totalEarned: number;
  totalSpent: number;
  lastDailyGrantDate: string;
  dailyGranted: boolean;
}

export interface CreditTransaction {
  transactionId: number;
  type: 'CREDIT' | 'DEBIT';
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  description: string;
  createdAt: string;
  taskId?: number;
}

export interface CreditHistoryPage {
  content: CreditTransaction[];
  pageable: {
    sort: {
      sorted: boolean;
      unsorted: boolean;
      empty: boolean;
    };
    pageNumber: number;
    pageSize: number;
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
  numberOfElements: number;
  size: number;
  number: number;
  sort: {
    sorted: boolean;
    unsorted: boolean;
    empty: boolean;
  };
  empty: boolean;
}

export const CREDIT_COSTS = {
  BUTTER_COVER: 25,
  VIDEO_GENERATION: 10,
  DIGITAL_GOODS: 4,
  VIRTUAL_CASTING: 4,
  FANMEETING_STUDIO: 4,
  STYLIST: 4,
  IMAGE_EDIT: 3,
} as const;

export type ActionType = keyof typeof CREDIT_COSTS;

export const getCreditBalance = (): Promise<ApiResponse<CreditBalance>> => {
  return apiFetch<CreditBalance>('/api/v1/credits/balance');
};

export const getCreditHistory = (
  page: number = 0,
  size: number = 20,
  sort: string = 'createdAt,desc'
): Promise<ApiResponse<CreditHistoryPage>> => {
  const params = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
    sort,
  });

  return apiFetch<CreditHistoryPage>(
    `/api/v1/credits/history?${params.toString()}`
  );
};

export const getCreditCost = (actionType: ActionType): number => {
  return CREDIT_COSTS[actionType];
};

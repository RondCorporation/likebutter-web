import { apiFetch } from '../apiClient';
import { ApiResponse } from '@/app/_types/api';

// 크레딧 잔액 응답 타입
export interface CreditBalance {
  currentBalance: number;
  totalEarned: number;
  totalSpent: number;
  lastDailyGrantDate: string;
  dailyGranted: boolean;
}

// 크레딧 거래 내역 타입
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

// 페이지네이션된 크레딧 거래 내역 응답
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

// ActionType별 크레딧 비용 정의
export const CREDIT_COSTS = {
  BUTTER_COVER: 4, // 이미지 생성
  DIGITAL_GOODS: 4, // 이미지 생성
  VIRTUAL_CASTING: 4, // 이미지 생성
  FANMEETING_STUDIO: 4, // 이미지 생성
  STYLIST: 4, // 이미지 생성
  IMAGE_EDIT: 3, // 이미지 수정
} as const;

export type ActionType = keyof typeof CREDIT_COSTS;

// 크레딧 잔액 조회
export const getCreditBalance = (): Promise<ApiResponse<CreditBalance>> => {
  return apiFetch<CreditBalance>('/credits/balance');
};

// 크레딧 거래 내역 조회
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

  return apiFetch<CreditHistoryPage>(`/credits/history?${params.toString()}`);
};

// ActionType에 따른 크레딧 비용 반환
export const getCreditCost = (actionType: ActionType): number => {
  return CREDIT_COSTS[actionType];
};
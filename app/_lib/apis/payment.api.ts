import { apiFetch } from '../apiClient';
import { ApiResponse, PaginatedResponse } from '@/app/_types/api';
import { PaymentHistoryResponse } from '@/app/_types/payment';

export const getPaymentHistory = (
  page: number = 0,
  size: number = 20
): Promise<ApiResponse<PaginatedResponse<PaymentHistoryResponse>>> => {
  return apiFetch<PaginatedResponse<PaymentHistoryResponse>>(
    `/api/v1/payments/me?page=${page}&size=${size}`
  );
};

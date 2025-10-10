import { apiFetch } from '../apiClient';
import { ApiResponse } from '@/app/_types/api';
import { PaymentHistoryResponse } from '@/app/_types/payment';

export const getPaymentHistory = (): Promise<
  ApiResponse<PaymentHistoryResponse[]>
> => {
  return apiFetch<PaymentHistoryResponse[]>('/api/v1/payments/me');
};

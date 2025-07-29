import { apiFetch, ApiResponse } from '../apiClient';
import { PaymentHistoryResponse } from '@/app/_types/payment';

export const getPaymentHistory = (): Promise<
  ApiResponse<PaymentHistoryResponse[]>
> => {
  return apiFetch<PaymentHistoryResponse[]>('/payments/me');
};

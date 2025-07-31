import { apiServer } from '../apiServer';
import { ApiResponse } from '@/app/_types/api';
import { PaymentHistoryResponse } from '@/app/_types/payment';

export const getPaymentHistory = (): Promise<
  ApiResponse<PaymentHistoryResponse[]>
> => {
  return apiServer.get<PaymentHistoryResponse[]>('/payments/me');
};

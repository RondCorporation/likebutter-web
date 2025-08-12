export type PaymentStatus = 'PAID' | 'FAILED' | 'CANCELLED' | 'PENDING';

export interface PaymentHistoryResponse {
  paymentId: number;
  pgTxId: string;
  paidAt: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  planName: string;
  orderName: string;
}

export interface Payment {
  id: number;
  paymentId: string;
  accountId: number;
  plan: string;
  amount: number;
  status: string;
  createdAt: string;
}

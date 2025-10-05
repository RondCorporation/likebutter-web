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

export interface PaymentDetails {
  paymentId: number;
  pgTxId: string;
  paidAt: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  planName: string;
  orderName: string;
  billingCycle?: 'MONTHLY' | 'YEARLY';
  planDescription?: string;
  vat?: number;
  subtotal?: number;
}

export interface SubscriptionPaymentDetails {
  subscription: {
    plan: {
      name: string;
      billingCycle: 'MONTHLY' | 'YEARLY';
    };
  };
  payment: {
    paymentId: number;
    pgTxId: string;
    paidAt: string;
    amount: number;
    currency: string;
    status: PaymentStatus;
  };
}

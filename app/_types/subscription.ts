export type PlanKey =
  | 'FREE'
  | 'CREATOR_MONTHLY'
  | 'CREATOR_YEARLY'
  | 'PROFESSIONAL_MONTHLY'
  | 'PROFESSIONAL_YEARLY'
  | 'ENTERPRISE';

export type SubscriptionStatus =
  | 'ACTIVE'
  | 'CANCELLED'
  | 'PAST_DUE'
  | 'EXPIRED';

export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED';

export interface Subscription {
  subscriptionId: number;
  planKey: PlanKey;
  status: SubscriptionStatus;
  startDate: string;
  endDate: string;
}

export interface PaymentHistory {
  paymentId: number;
  pgTxId: string;
  paidAt: string;
  amount: number;
  status: PaymentStatus;
}

export interface PlanInfo {
  planKey: PlanKey;
  description: string;
  price: number;
  currency: string;
  billingCycle: 'MONTHLY' | 'YEARLY';
}

export interface SubscriptionDetails {
  subscriptionId: number;
  status: SubscriptionStatus;
  startDate: string;
  endDate: string;
  nextPaymentDate: string;
  planInfo: PlanInfo;
  paymentHistory: PaymentHistory[];
}

export interface CreateSubscriptionResponse {
  subscriptionId: number;
  planDescription: string;
  status: SubscriptionStatus;
  endDate: string;
}

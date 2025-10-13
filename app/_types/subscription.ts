import { PaymentStatus } from './payment';

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
  status: SubscriptionStatus;
  startDate: string;
  endDate: string;
  nextPaymentDate: string;
  planInfo: PlanInfo;
  paymentHistory: PaymentHistory[];
}

export interface CreateSubscriptionResponse {
  paymentId: number;
}

export interface SubscriptionPaymentDetails {
  id: number;
  paymentId: string;
  pgTxId: string;
  paidAt: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  accountId: number;
  plan: {
    id: number;
    planKey: string;
    name: string;
    description: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Plan {
  planKey: string;
  description: string;
  planType: 'CREATOR' | 'PROFESSIONAL' | 'FREE' | 'ENTERPRISE';
  billingCycle: 'MONTHLY' | 'YEARLY';
  priceKrw: number;
  priceUsd: number;
}

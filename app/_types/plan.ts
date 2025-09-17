export interface Plan {
  planKey: string;
  description: string;
  planType: 'FREE' | 'BASIC' | 'STANDARD' | 'ENTERPRISE';
  billingCycle: 'MONTHLY' | 'YEARLY' | null;
  priceKrw: number | null;
  priceUsd: number | null;
  pricePerMonth?: {
    krw: number;
    usd: number;
  };
}

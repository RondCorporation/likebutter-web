export interface Plan {
  planKey: string;
  description: string;
  planType: 'FREE' | 'CREATOR' | 'PROFESSIONAL' | 'ENTERPRISE';
  billingCycle: 'MONTHLY' | 'YEARLY' | null;
  priceKrw: number | null;
  priceUsd: number | null;
  pricePerMonth?: {
    krw: number;
    usd: number;
  };
}

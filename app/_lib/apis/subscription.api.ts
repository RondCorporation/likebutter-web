import { apiFetch } from '../apiClient';
import { ApiResponse } from '@/app/_types/api';
import {
  CreateSubscriptionResponse,
  SubscriptionDetails,
  SubscriptionPaymentDetails,
} from '@/app/_types/subscription';

export const registerBillingKey = (
  billingKey: string
): Promise<ApiResponse<{ msg: string }>> => {
  return apiFetch('/api/v1/subscriptions/billing-key', {
    method: 'POST',
    body: {
      billingKey,
    },
  });
};

export const createSubscription = (
  planKey: string
): Promise<ApiResponse<CreateSubscriptionResponse>> => {
  return apiFetch('/api/v1/subscriptions', {
    method: 'POST',
    body: {
      planKey,
    },
  });
};

export const getMySubscription = (): Promise<
  ApiResponse<SubscriptionDetails>
> => {
  return apiFetch<SubscriptionDetails>('/api/v1/subscriptions/me');
};

export const upgradeMySubscription = (
  newPlanKey: string
): Promise<ApiResponse<SubscriptionDetails>> => {
  return apiFetch<SubscriptionDetails>(`/api/v1/subscriptions/upgrade`, {
    method: 'PUT',
    body: {
      newPlanKey,
    },
  });
};

export const cancelMySubscription = (): Promise<ApiResponse<null>> => {
  return apiFetch<null>(`/api/v1/subscriptions`, {
    method: 'DELETE',
  });
};

export const getSubscriptionPaymentDetails = (
  paymentId: number
): Promise<ApiResponse<SubscriptionPaymentDetails>> => {
  return apiFetch<SubscriptionPaymentDetails>(
    `/api/v1/subscriptions/payments/${paymentId}`
  );
};

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
  return apiFetch('/subscriptions/register-billing-key', {
    method: 'POST',
    body: {
      billingKey,
    },
  });
};

export const createSubscription = (
  planKey: string
): Promise<ApiResponse<CreateSubscriptionResponse>> => {
  return apiFetch('/subscriptions/create', {
    method: 'POST',
    body: {
      planKey,
    },
  });
};

export const getMySubscription = (): Promise<
  ApiResponse<SubscriptionDetails>
> => {
  return apiFetch<SubscriptionDetails>('/subscriptions/me');
};

export const upgradeMySubscription = (
  newPlanKey: string
): Promise<ApiResponse<SubscriptionDetails>> => {
  return apiFetch<SubscriptionDetails>(`/subscriptions/me/upgrade`, {
    method: 'POST',
    body: {
      newPlanKey,
    },
  });
};

export const cancelMySubscription = (): Promise<ApiResponse<null>> => {
  return apiFetch<null>(`/subscriptions/me`, {
    method: 'DELETE',
  });
};

export const getSubscriptionPaymentDetails = (
  paymentId: number
): Promise<ApiResponse<SubscriptionPaymentDetails>> => {
  return apiFetch<SubscriptionPaymentDetails>(
    `/subscriptions/payments/${paymentId}`
  );
};

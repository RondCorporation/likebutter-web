import { apiFetch } from '../apiClient';
import { ApiResponse } from '@/app/_types/api';
import {
  CreateSubscriptionResponse,
  Subscription,
  SubscriptionDetails,
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

export const getSubscriptions = (): Promise<ApiResponse<Subscription[]>> => {
  return apiFetch<Subscription[]>('/subscriptions');
};

export const getSubscriptionDetails = (
  id: number
): Promise<ApiResponse<SubscriptionDetails>> => {
  return apiFetch<SubscriptionDetails>(`/subscriptions/${id}`);
};

export const upgradeSubscription = (
  id: number,
  newPlanKey: string
): Promise<ApiResponse<SubscriptionDetails>> => {
  return apiFetch<SubscriptionDetails>(`/subscriptions/${id}/upgrade`, {
    method: 'POST',
    body: {
      newPlanKey,
    },
  });
};

export const cancelSubscription = (
  subscriptionId: number
): Promise<ApiResponse<null>> => {
  return apiFetch<null>(`/subscriptions/${subscriptionId}`, {
    method: 'DELETE',
  });
};

'use client';

import { useEffect } from 'react';
import { useSubscriptionStore } from '@/app/_stores/subscriptionStore';
import { useAuth } from './useAuth';

const planDisplayNames: Record<string, string> = {
  FREE: 'Free Plan',
  CREATOR_MONTHLY: 'Creator Plan (Monthly)',
  CREATOR_YEARLY: 'Creator Plan (Yearly)',
  PROFESSIONAL_MONTHLY: 'Professional Plan (Monthly)',
  PROFESSIONAL_YEARLY: 'Professional Plan (Yearly)',
  ENTERPRISE: 'Enterprise Plan',
};

export function useSubscription() {
  const { subscription, isLoading, isInitialized, error, fetchSubscription } =
    useSubscriptionStore();
  const { user, isAuthenticated } = useAuth();

  // Fetch subscription when user is authenticated and not yet initialized
  useEffect(() => {
    if (isAuthenticated && !isInitialized && !isLoading) {
      fetchSubscription();
    }
  }, [isAuthenticated, isInitialized, isLoading, fetchSubscription]);

  // Get plan display name from subscription or user
  const getPlanDisplayName = (): string => {
    if (subscription?.planInfo) {
      return (
        planDisplayNames[subscription.planInfo.planKey] ||
        subscription.planInfo.description ||
        'Free Plan'
      );
    }

    // Fallback to user.planName or user.planKey
    if (user?.planName) {
      return user.planName;
    }

    if (user?.planKey) {
      return planDisplayNames[user.planKey] || 'Free Plan';
    }

    return 'Free Plan';
  };

  return {
    subscription,
    isLoading,
    isInitialized,
    error,
    planDisplayName: getPlanDisplayName(),
    refetch: fetchSubscription,
  };
}

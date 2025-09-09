'use client';

import { useMemo, memo } from 'react';
import { useTranslation } from 'react-i18next';
import { PlanKey } from '@/app/_types/subscription';
import { CreditCard, Sparkles } from 'lucide-react';
import InProgressTasks from '@/components/studio/history/InProgressTasks';
import CompletedTasks from '@/components/studio/history/CompletedTasks';
import { useRouter } from 'next/navigation';
import { useUser } from '@/hooks/useUser';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import { useTaskHistorySWR } from '@/hooks/useTaskHistorySWR';

const planNames: Record<PlanKey, string> = {
  FREE: 'Free',
  CREATOR_MONTHLY: 'Creator Monthly',
  CREATOR_YEARLY: 'Creator Yearly',
  PROFESSIONAL_MONTHLY: 'Professional Monthly',
  PROFESSIONAL_YEARLY: 'Professional Yearly',
  ENTERPRISE: 'Enterprise',
};

const DashboardClient = memo(function DashboardClient() {
  const { t } = useTranslation();
  const router = useRouter();

  // SWR 훅을 사용한 데이터 페칭
  const { user, isLoading: userLoading, isError: userError } = useUser();
  const {
    activeSubscription,
    isLoading: subscriptionLoading,
    isError: subscriptionError,
  } = useSubscriptions();

  const {
    inProgressTasks,
    completedTasks,
    isLoading: tasksLoading,
    error: tasksError,
  } = useTaskHistorySWR({
    page: 0,
    filters: { status: '', actionType: '' },
    enablePolling: true,
  });

  // Dashboard only shows first 3 items of each category
  const dashboardInProgressTasks = useMemo(
    () => inProgressTasks.slice(0, 3),
    [inProgressTasks]
  );
  const dashboardCompletedTasks = useMemo(
    () => completedTasks.slice(0, 3),
    [completedTasks]
  );

  const handleTaskClick = useMemo(
    () => (task: any) => {
      router.push(`/studio/history?taskId=${task.taskId}`);
    },
    [router]
  );

  const creditUsage = useMemo(() => 0, []);
  const creditLimit = useMemo(() => 100, []);
  const creditPercentage = useMemo(
    () => (creditUsage / creditLimit) * 100,
    [creditUsage, creditLimit]
  );

  const planName = useMemo(() => {
    return activeSubscription ? planNames[activeSubscription.planKey] : 'Free';
  }, [activeSubscription]);

  const isLoading = userLoading || subscriptionLoading || tasksLoading;
  const hasError = userError || subscriptionError || tasksError;

  if (isLoading) {
    return <div className="text-center p-8">{t('historyLoading')}</div>;
  }

  if (hasError) {
    return (
      <div className="text-red-500 text-center p-8">
        {tasksError || 'Failed to load dashboard data'}
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Welcome Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">
          {t('dashboardWelcome', { name: user?.name || 'Creator' })}
        </h1>
        <p className="text-slate-400">{t('dashboardSubtitle')}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-12">
          {/* In-Progress Tasks */}
          {dashboardInProgressTasks.length > 0 && (
            <InProgressTasks
              tasks={dashboardInProgressTasks}
              onTaskClick={handleTaskClick}
            />
          )}

          {/* Recently Completed Tasks */}
          {dashboardCompletedTasks.length > 0 && (
            <CompletedTasks
              tasks={dashboardCompletedTasks}
              onTaskClick={handleTaskClick}
            />
          )}

          {/* Placeholder for when there are no tasks */}
          {dashboardInProgressTasks.length === 0 &&
            dashboardCompletedTasks.length === 0 && (
              <div className="text-center py-16 border-2 border-dashed border-slate-700 rounded-lg">
                <h3 className="text-xl font-semibold">
                  {t('dashboardNoTasksTitle')}
                </h3>
                <p className="text-slate-400 mt-2">
                  {t('dashboardNoTasksSubtitle')}
                </p>
              </div>
            )}
        </div>

        {/* Side Column */}
        <div className="space-y-8">
          {/* Account Status */}
          <div className="p-6 bg-slate-800/50 rounded-lg">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <CreditCard size={20} /> {t('dashboardAccountStatus')}
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span>{t('dashboardPlan')}</span>
                  <span className="font-semibold text-accent">{planName}</span>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span>{t('dashboardCredits')}</span>
                  <span>
                    {creditUsage} / {creditLimit}
                  </span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2.5">
                  <div
                    className="bg-accent h-2.5 rounded-full"
                    style={{ width: `${creditPercentage}%` }}
                  ></div>
                </div>
              </div>
              <button className="w-full btn btn-primary mt-2">
                {t('dashboardManageSubscription')}
              </button>
            </div>
          </div>

          {/* Quick Start */}
          <div className="p-6 bg-slate-800/50 rounded-lg">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <Sparkles size={20} /> {t('dashboardQuickStart')}
            </h3>
            <div className="space-y-3">
              <button
                onClick={() => router.push('/studio/butter-gen')}
                className="w-full btn btn-ghost justify-start"
              >
                Butter-Gen
              </button>
              <button
                onClick={() => router.push('/studio/butter-test')}
                className="w-full btn btn-ghost justify-start"
              >
                Butter-Test
              </button>
              <button
                onClick={() => router.push('/studio/butter-cuts')}
                className="w-full btn btn-ghost justify-start"
              >
                Butter-Cuts
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default DashboardClient;

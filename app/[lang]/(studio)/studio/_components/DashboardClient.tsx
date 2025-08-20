'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { User } from '@/app/_types/api';
import { Subscription, PlanKey } from '@/app/_types/subscription';
import { Task } from '@/app/_types/task';
import { CreditCard, Sparkles } from 'lucide-react';
import InProgressTasks from '@/components/studio/history/InProgressTasks';
import CompletedTasks from '@/components/studio/history/CompletedTasks';
import { useRouter } from 'next/navigation';
import { getMe } from '@/lib/apis/user.api';
import { getSubscriptions } from '@/lib/apis/subscription.api.client';
import { getTaskHistory } from '@/lib/apis/task.api';

const planNames: Record<PlanKey, string> = {
  FREE: 'Free',
  CREATOR_MONTHLY: 'Creator Monthly',
  CREATOR_YEARLY: 'Creator Yearly',
  PROFESSIONAL_MONTHLY: 'Professional Monthly',
  PROFESSIONAL_YEARLY: 'Professional Yearly',
  ENTERPRISE: 'Enterprise',
};

export default function DashboardClient() {
  const { t } = useTranslation();
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [inProgressTasks, setInProgressTasks] = useState<Task[]>([]);
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        const [
          userResponse,
          subscriptionsResponse,
          inProgressTasksResponse,
          completedTasksResponse,
        ] = await Promise.all([
          getMe(),
          getSubscriptions(),
          getTaskHistory(0, { status: 'IN_PROGRESS', size: 3 }),
          getTaskHistory(0, { status: 'COMPLETED', size: 3 }),
        ]);

        if (userResponse.data) {
          setUser(userResponse.data);
        }

        if (
          subscriptionsResponse.data &&
          subscriptionsResponse.data.length > 0
        ) {
          const activeSub = subscriptionsResponse.data.find(
            (s) => s.status === 'ACTIVE'
          );
          setSubscription(activeSub || subscriptionsResponse.data[0]);
        }

        if (inProgressTasksResponse.data) {
          setInProgressTasks(inProgressTasksResponse.data.content);
        }

        if (completedTasksResponse.data) {
          setCompletedTasks(completedTasksResponse.data.content);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load dashboard data.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleTaskClick = (task: Task) => {
    router.push(`/studio/history?taskId=${task.taskId}`);
  };

  if (isLoading) {
    return <div className="text-center p-8">{t('historyLoading')}</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center p-8">{error}</div>;
  }

  // TODO: Get credit info from API when available in Subscription object
  const creditUsage = 0;
  const creditLimit = 100;
  const creditPercentage = (creditUsage / creditLimit) * 100;

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
          {inProgressTasks.length > 0 && (
            <InProgressTasks
              tasks={inProgressTasks}
              onTaskClick={handleTaskClick}
            />
          )}

          {/* Recently Completed Tasks */}
          {completedTasks.length > 0 && (
            <CompletedTasks
              tasks={completedTasks}
              onTaskClick={handleTaskClick}
            />
          )}

          {/* Placeholder for when there are no tasks */}
          {inProgressTasks.length === 0 && completedTasks.length === 0 && (
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
                  <span className="font-semibold text-accent">
                    {subscription ? planNames[subscription.planKey] : 'Free'}
                  </span>
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
}

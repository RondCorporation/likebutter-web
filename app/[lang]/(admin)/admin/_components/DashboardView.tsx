'use client';

import React from 'react';
import useSWR from 'swr';
import { getStatsSummary } from '@/app/_lib/apis/admin.api';
import {
  BarChart,
  Users,
  DollarSign,
  CheckCircle,
  Clock,
  AlertTriangle,
  TrendingUp,
} from 'lucide-react';
import { AdminStats } from '@/app/_lib/apis/admin.api';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  color?: string;
}

const StatCard = ({
  title,
  value,
  icon: Icon,
  color = 'text-gray-600',
}: StatCardProps) => (
  <div className="p-6 bg-white rounded-lg shadow">
    <div className="flex items-center">
      <div className={`p-3 bg-gray-100 rounded-full mr-4 ${color}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  </div>
);

interface TaskStatusChartProps {
  data: { [key: string]: number };
}

const TaskStatusChart = ({ data }: TaskStatusChartProps) => {
  const totalTasks = Object.values(data).reduce(
    (sum: number, count: number) => sum + count,
    0
  );
  if (totalTasks === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        No task data available.
      </div>
    );
  }

  const statuses = [
    { name: 'SUCCESS', color: 'bg-green-500' },
    { name: 'PROCESSING', color: 'bg-blue-500' },
    { name: 'PENDING', color: 'bg-yellow-500' },
    { name: 'FAILED', color: 'bg-red-500' },
  ];

  return (
    <div className="w-full">
      <div className="flex w-full h-4 overflow-hidden rounded-full bg-gray-200">
        {statuses.map((status) => {
          const count = data[status.name] || 0;
          const percentage = (count / totalTasks) * 100;
          if (percentage === 0) return null;
          return (
            <div
              key={status.name}
              style={{ width: `${percentage}%` }}
              className={`${status.color}`}
              title={`${status.name}: ${count} (${percentage.toFixed(1)}%)`}
            />
          );
        })}
      </div>
      <div className="flex justify-around mt-2 text-xs text-gray-600">
        {statuses.map((status) => {
          const count = data[status.name] || 0;
          if (count === 0) return null;
          return (
            <div key={status.name} className="flex items-center">
              <span className={`w-2 h-2 mr-1.5 rounded-full ${status.color}`} />
              <span>
                {status.name} ({count})
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default function DashboardView() {
  const {
    data: stats,
    error,
    isLoading,
  } = useSWR<AdminStats>('/admin/stats/summary', getStatsSummary);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-purple-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center bg-red-100 rounded-lg">
        <AlertTriangle className="w-12 h-12 mx-auto text-red-500" />
        <h3 className="mt-2 text-lg font-semibold text-red-800">
          Failed to load dashboard data
        </h3>
        <p className="mt-1 text-sm text-red-600">
          {error.message || 'An unexpected error occurred.'}
        </p>
      </div>
    );
  }

  if (!stats) {
    return <div className="text-center text-gray-500">No data available.</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
      <p className="mt-2 text-gray-600">
        Welcome! Here's a summary of your platform's activity.
      </p>

      <div className="grid grid-cols-1 gap-6 mt-8 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Users"
          value={stats.totalUsers.toLocaleString()}
          icon={Users}
          color="text-blue-600"
        />
        <StatCard
          title="New Users (24h)"
          value={stats.newUsers.toLocaleString()}
          icon={TrendingUp}
          color="text-green-600"
        />
        <StatCard
          title="Active Subscriptions"
          value={stats.activeSubscriptions.toLocaleString()}
          icon={CheckCircle}
          color="text-purple-600"
        />
        <StatCard
          title="Total Revenue"
          value={`$${stats.totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          color="text-yellow-600"
        />
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold text-gray-800">
          Task Status Overview
        </h2>
        <div className="p-6 mt-4 bg-white rounded-lg shadow">
          <TaskStatusChart data={stats.taskStatusCounts} />
        </div>
      </div>
    </div>
  );
}

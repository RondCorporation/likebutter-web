'use client';

import React, { useState, Suspense } from 'react';
import dynamic from 'next/dynamic';
import {
  BarChart,
  Users,
  CreditCard,
  Repeat,
  List,
  User,
  Shield,
} from 'lucide-react';

const DashboardView = dynamic(() => import('./DashboardView'), {
  loading: () => <AdminViewSkeleton />,
});
const AccountsView = dynamic(() => import('./AccountsView'), {
  loading: () => <AdminViewSkeleton />,
});
const UsersView = dynamic(() => import('./UsersView'), {
  loading: () => <AdminViewSkeleton />,
});
const SubscriptionsView = dynamic(() => import('./SubscriptionsView'), {
  loading: () => <AdminViewSkeleton />,
});
const PaymentsView = dynamic(() => import('./PaymentsView'), {
  loading: () => <AdminViewSkeleton />,
});
const TasksView = dynamic(() => import('./TasksView'), {
  loading: () => <AdminViewSkeleton />,
});

function AdminViewSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
      <div className="space-y-4">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      </div>
    </div>
  );
}

type AdminView =
  | 'dashboard'
  | 'accounts'
  | 'users'
  | 'subscriptions'
  | 'payments'
  | 'tasks';

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: BarChart },
  { id: 'accounts', label: 'Accounts', icon: Shield },
  { id: 'users', label: 'Users', icon: Users },
  { id: 'subscriptions', label: 'Subscriptions', icon: Repeat },
  { id: 'payments', label: 'Payments', icon: CreditCard },
  { id: 'tasks', label: 'Tasks', icon: List },
];

export default function AdminDashboardClient() {
  const [activeView, setActiveView] = useState<AdminView>('dashboard');

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardView />;
      case 'accounts':
        return <AccountsView />;
      case 'users':
        return <UsersView />;
      case 'subscriptions':
        return <SubscriptionsView />;
      case 'payments':
        return <PaymentsView />;
      case 'tasks':
        return <TasksView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 text-gray-800">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md flex flex-col">
        <div className="p-6 text-2xl font-bold text-center text-purple-700 border-b">
          Likebutter Admin
        </div>
        <nav className="flex-grow mt-6">
          {menuItems.map(({ id, label, icon: Icon }) => (
            <a
              key={id}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setActiveView(id as AdminView);
              }}
              className={`flex items-center px-6 py-4 text-lg transition-colors duration-200 ${
                activeView === id
                  ? 'bg-purple-100 text-purple-700'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-6 h-6 mr-4" />
              {label}
            </a>
          ))}
        </nav>
        <div className="p-4 border-t">
          <p className="text-sm text-center text-gray-500">
            © 2025 Likebutter
          </p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 overflow-y-auto">{renderView()}</main>
    </div>
  );
}

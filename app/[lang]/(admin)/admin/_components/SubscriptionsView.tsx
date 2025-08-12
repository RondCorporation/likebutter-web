'use client';

import React, { useState, useMemo } from 'react';
import useSWR from 'swr';
import {
  getSubscriptions,
  updateSubscription,
  AdminSubscription,
} from '@/app/_lib/apis/admin.api';
import { PaginatedResponse } from '@/app/_types/api';
import Pagination from './shared/Pagination';
import { debounce } from '@/app/_lib/utils';
import toast from 'react-hot-toast';
import { AlertTriangle } from 'lucide-react';
import Spinner from './shared/Spinner';
import ConfirmationModal from './shared/ConfirmationModal';

interface SubscriptionsFilterBarProps {
  onFilterChange: (filters: any) => void;
}

const SubscriptionsFilterBar = ({
  onFilterChange,
}: SubscriptionsFilterBarProps) => {
  const [filters, setFilters] = useState({
    accountId: '',
    plan: '',
    status: '',
  });

  const debouncedFilterChange = useMemo(
    () => debounce(onFilterChange, 500),
    [onFilterChange]
  );

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    debouncedFilterChange(newFilters);
  };

  return (
    <div className="p-4 mb-6 bg-white rounded-lg shadow">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <input
          name="accountId"
          value={filters.accountId}
          onChange={handleInputChange}
          placeholder="Account ID"
          className="w-full py-2 px-3 border border-gray-300 rounded-md"
        />
        <input
          name="plan"
          value={filters.plan}
          onChange={handleInputChange}
          placeholder="Plan Key (e.g. PREMIUM_PLAN)"
          className="w-full py-2 px-3 border border-gray-300 rounded-md"
        />
        <select
          name="status"
          value={filters.status}
          onChange={handleInputChange}
          className="w-full py-2 px-3 border border-gray-300 rounded-md"
        >
          <option value="">All Statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="CANCELLED">Cancelled</option>
          <option value="EXPIRED">Expired</option>
        </select>
      </div>
    </div>
  );
};

export default function SubscriptionsView() {
  const [page, setPage] = useState(0);
  const [filters, setFilters] = useState({
    accountId: '',
    plan: '',
    status: '',
  });
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    subscription: AdminSubscription | null;
    step: number;
    newStatus: string;
    newExpiryDate: string;
  }>({
    isOpen: false,
    subscription: null,
    step: 1,
    newStatus: '',
    newExpiryDate: '',
  });

  const { data, error, isLoading, mutate } = useSWR<
    PaginatedResponse<AdminSubscription>
  >(
    `/admin/subscriptions?page=${page}&size=10&accountId=${filters.accountId}&plan=${filters.plan}&status=${filters.status}`,
    () => getSubscriptions({ page, size: 10, ...filters }),
    { keepPreviousData: true }
  );

  const handleUpdateClick = (subscription: AdminSubscription) => {
    setModalState({
      isOpen: true,
      subscription,
      step: 1,
      newStatus: subscription.status,
      newExpiryDate: subscription.endDate,
    });
  };

  const handleModalClose = () => {
    setModalState({
      isOpen: false,
      subscription: null,
      step: 1,
      newStatus: '',
      newExpiryDate: '',
    });
  };

  const handleModalConfirm = async () => {
    if (modalState.step === 1) {
      setModalState((prev) => ({ ...prev, step: 2 }));
    } else {
      const { subscription, newStatus, newExpiryDate } = modalState;
      if (!subscription) return;

      const payload: { status?: string; newExpiryDate?: string } = {};
      if (newStatus !== subscription.status) payload.status = newStatus;
      if (newExpiryDate !== subscription.endDate)
        payload.newExpiryDate = newExpiryDate;

      if (Object.keys(payload).length === 0) {
        toast.error('No changes detected.');
        handleModalClose();
        return;
      }

      const toastId = toast.loading('Updating subscription...');
      try {
        await updateSubscription(subscription.id, payload);
        toast.success('Subscription updated successfully!', { id: toastId });
        mutate();
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to update.';
        toast.error(errorMessage, { id: toastId });
      } finally {
        handleModalClose();
      }
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800">
        Subscriptions Management
      </h1>
      <SubscriptionsFilterBar
        onFilterChange={(f) => {
          setPage(0);
          setFilters(f);
        }}
      />

      {isLoading && (
        <div className="flex justify-center p-8">
          <Spinner />
        </div>
      )}
      {error && (
        <div className="p-4 text-red-600 bg-red-100">
          Failed to load subscriptions.
        </div>
      )}

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 font-medium text-left">ID</th>
              <th className="px-6 py-3 font-medium text-left">Account ID</th>
              <th className="px-6 py-3 font-medium text-left">Plan</th>
              <th className="px-6 py-3 font-medium text-left">Status</th>
              <th className="px-6 py-3 font-medium text-left">Start Date</th>
              <th className="px-6 py-3 font-medium text-left">End Date</th>
              <th className="px-6 py-3 font-medium text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {data?.content.map((sub) => (
              <tr key={sub.id}>
                <td className="px-6 py-4">{sub.id}</td>
                <td className="px-6 py-4">{sub.accountId}</td>
                <td className="px-6 py-4">{sub.planKey}</td>
                <td className="px-6 py-4">{sub.status}</td>
                <td className="px-6 py-4">{sub.startDate}</td>
                <td className="px-6 py-4">{sub.endDate}</td>
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => handleUpdateClick(sub)}
                    className="font-medium text-purple-600"
                  >
                    Update
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {data && !data.empty && (
        <Pagination
          currentPage={data.number}
          totalPages={data.totalPages}
          onPageChange={setPage}
        />
      )}

      <ConfirmationModal
        isOpen={modalState.isOpen}
        onClose={handleModalClose}
        onConfirm={handleModalConfirm}
        title={
          modalState.step === 1
            ? 'Update Subscription'
            : 'Confirm Subscription Update'
        }
        confirmText="Confirm Update"
      >
        {modalState.subscription && (
          <div>
            <p>
              Updating subscription ID:{' '}
              <span className="font-bold">{modalState.subscription.id}</span>
            </p>
            <div className="grid grid-cols-2 gap-4 my-4">
              <div>
                <label className="block text-sm font-medium">Status</label>
                <select
                  value={modalState.newStatus}
                  onChange={(e) =>
                    setModalState((s) => ({ ...s, newStatus: e.target.value }))
                  }
                  className="w-full p-2 mt-1 border rounded-md"
                >
                  <option>ACTIVE</option>
                  <option>CANCELLED</option>
                  <option>EXPIRED</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium">
                  New Expiry Date
                </label>
                <input
                  type="date"
                  value={modalState.newExpiryDate}
                  onChange={(e) =>
                    setModalState((s) => ({
                      ...s,
                      newExpiryDate: e.target.value,
                    }))
                  }
                  className="w-full p-2 mt-1 border rounded-md"
                />
              </div>
            </div>
            {modalState.step === 2 && (
              <div className="p-3 mt-4 text-red-800 bg-red-100 rounded-md">
                <AlertTriangle className="inline w-4 h-4 mr-2" />
                You are about to modify a subscription. This action can affect
                user access.
              </div>
            )}
          </div>
        )}
      </ConfirmationModal>
    </div>
  );
}

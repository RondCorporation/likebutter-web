'use client';

import React, { useState, useMemo } from 'react';
import useSWR from 'swr';
import { getPayments } from '@/app/_lib/apis/admin.api';
import { Payment } from '@/app/_types/payment';
import { PaginatedResponse } from '@/app/_types/api';
import Pagination from './shared/Pagination';
import { debounce } from '@/app/_lib/utils';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const Spinner = () => (
  <div className="w-5 h-5 border-2 border-dashed rounded-full animate-spin border-gray-500"></div>
);

interface PaymentsFilterBarProps {
  onFilterChange: (filters: any) => void;
}

const PaymentsFilterBar = ({ onFilterChange }: PaymentsFilterBarProps) => {
  const [filters, setFilters] = useState({
    accountId: '',
    status: '',
    planId: '',
    startDate: null,
    endDate: null,
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

  const handleDateChange = (key: string, date: Date | null) => {
    const newFilters = {
      ...filters,
      [key]: date ? date.toISOString().split('T')[0] : null,
    };
    setFilters(newFilters);
    debouncedFilterChange(newFilters);
  };

  return (
    <div className="p-4 mb-6 bg-white rounded-lg shadow">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
        <input
          name="accountId"
          value={filters.accountId}
          onChange={handleInputChange}
          placeholder="Account ID"
          className="w-full py-2 px-3 border rounded-md"
        />
        <input
          name="planId"
          value={filters.planId}
          onChange={handleInputChange}
          placeholder="Plan ID"
          className="w-full py-2 px-3 border rounded-md"
        />
        <select
          name="status"
          value={filters.status}
          onChange={handleInputChange}
          className="w-full py-2 px-3 border rounded-md"
        >
          <option value="">All Statuses</option>
          <option value="PAID">Paid</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
        <DatePicker
          selected={filters.startDate ? new Date(filters.startDate) : null}
          onChange={(date) => handleDateChange('startDate', date)}
          placeholderText="Start Date"
          className="w-full py-2 px-3 border rounded-md"
        />
        <DatePicker
          selected={filters.endDate ? new Date(filters.endDate) : null}
          onChange={(date) => handleDateChange('endDate', date)}
          placeholderText="End Date"
          className="w-full py-2 px-3 border rounded-md"
        />
      </div>
    </div>
  );
};

export default function PaymentsView() {
  const [page, setPage] = useState(0);
  const [filters, setFilters] = useState({
    accountId: '',
    status: '',
    planId: '',
    startDate: '',
    endDate: '',
  });

  const { data, error, isLoading } = useSWR<PaginatedResponse<Payment>>(
    `/admin/payments?page=${page}&size=10&${new URLSearchParams(filters as any).toString()}`,
    () => getPayments({ page, size: 10, ...filters }),
    { keepPreviousData: true }
  );

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800">Payments Management</h1>
      <PaymentsFilterBar
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
          Failed to load payments.
        </div>
      )}

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 font-medium text-left">Payment ID</th>
              <th className="px-6 py-3 font-medium text-left">Account ID</th>
              <th className="px-6 py-3 font-medium text-left">Plan</th>
              <th className="px-6 py-3 font-medium text-left">Amount</th>
              <th className="px-6 py-3 font-medium text-left">Status</th>
              <th className="px-6 py-3 font-medium text-left">Created At</th>
              <th className="px-6 py-3 font-medium text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {data?.content.map((payment) => (
              <tr key={payment.id}>
                <td className="px-6 py-4 font-mono text-xs">
                  {payment.paymentId}
                </td>
                <td className="px-6 py-4">{payment.accountId}</td>
                <td className="px-6 py-4">{payment.plan}</td>
                <td className="px-6 py-4">
                  ${payment.amount.toLocaleString()}
                </td>
                <td className="px-6 py-4">{payment.status}</td>
                <td className="px-6 py-4">
                  {new Date(payment.createdAt).toLocaleString()}
                </td>
                <td className="px-6 py-4 text-center">
                  <button
                    disabled
                    className="font-medium text-gray-400 cursor-not-allowed"
                    title="Refund functionality is not implemented yet."
                  >
                    Refund
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
    </div>
  );
}

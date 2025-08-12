'use client';

import React, { useState, useMemo } from 'react';
import useSWR from 'swr';
import {
  getTasks,
  getTaskDetails,
  retryTask,
  AdminTask,
} from '@/app/_lib/apis/admin.api';
import { PaginatedResponse } from '@/app/_types/api';
import Pagination from './shared/Pagination';
import { debounce } from '@/app/_lib/utils';
import toast from 'react-hot-toast';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Spinner from './shared/Spinner';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="p-6 bg-white rounded-lg shadow-xl w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800"
          >
            &times;
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};

interface TasksFilterBarProps {
  onFilterChange: (filters: any) => void;
}

const TasksFilterBar = ({ onFilterChange }: TasksFilterBarProps) => {
  const [filters, setFilters] = useState({
    accountId: '',
    status: '',
    startDate: null,
    endDate: null,
  });
  const debouncedFilterChange = useMemo(
    () => debounce(onFilterChange, 500),
    [onFilterChange]
  );

  const handleFilterUpdate = (update: any) => {
    const newFilters = { ...filters, ...update };
    setFilters(newFilters);
    debouncedFilterChange(newFilters);
  };

  return (
    <div className="p-4 mb-6 bg-white rounded-lg shadow">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <input
          name="accountId"
          onChange={(e) => handleFilterUpdate({ accountId: e.target.value })}
          placeholder="Account ID"
          className="w-full py-2 px-3 border rounded-md"
        />
        <select
          name="status"
          onChange={(e) => handleFilterUpdate({ status: e.target.value })}
          className="w-full py-2 px-3 border rounded-md"
        >
          <option value="">All Statuses</option>
          <option value="PENDING">Pending</option>
          <option value="PROCESSING">Processing</option>
          <option value="SUCCESS">Success</option>
          <option value="FAILED">Failed</option>
        </select>
        <DatePicker
          selected={filters.startDate}
          onChange={(date) => handleFilterUpdate({ startDate: date })}
          placeholderText="Start Date"
          className="w-full py-2 px-3 border rounded-md"
        />
        <DatePicker
          selected={filters.endDate}
          onChange={(date) => handleFilterUpdate({ endDate: date })}
          placeholderText="End Date"
          className="w-full py-2 px-3 border rounded-md"
        />
      </div>
    </div>
  );
};

export default function TasksView() {
  const [page, setPage] = useState(0);
  const [filters, setFilters] = useState({
    accountId: '',
    status: '',
    startDate: '',
    endDate: '',
  });
  const [detailModal, setDetailModal] = useState<{
    isOpen: boolean;
    taskId: number | null;
  }>({ isOpen: false, taskId: null });
  const [retryModal, setRetryModal] = useState<{
    isOpen: boolean;
    task: AdminTask | null;
  }>({ isOpen: false, task: null });

  const { data, error, isLoading, mutate } = useSWR<
    PaginatedResponse<AdminTask>
  >(
    `/admin/tasks?page=${page}&size=10&${new URLSearchParams(filters as any).toString()}`,
    () => getTasks({ page, size: 10, ...filters }),
    { keepPreviousData: true }
  );

  const { data: taskDetails } = useSWR(
    detailModal.taskId ? `/admin/tasks/${detailModal.taskId}` : null,
    () => getTaskDetails(detailModal.taskId!)
  );

  const handleRetryClick = (task: AdminTask) =>
    setRetryModal({ isOpen: true, task });
  const handleRetryConfirm = async () => {
    if (!retryModal.task) return;
    const toastId = toast.loading('Retrying task...');
    try {
      await retryTask(retryModal.task.id);
      toast.success('Task retry initiated!', { id: toastId });
      mutate();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to retry task.';
      toast.error(errorMessage, { id: toastId });
    } finally {
      setRetryModal({ isOpen: false, task: null });
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800">Tasks Management</h1>
      <TasksFilterBar
        onFilterChange={(f) => {
          setPage(0);
          setFilters({
            ...f,
            startDate: f.startDate
              ? f.startDate.toISOString().split('T')[0]
              : '',
            endDate: f.endDate ? f.endDate.toISOString().split('T')[0] : '',
          });
        }}
      />

      {isLoading && (
        <div className="flex justify-center p-8">
          <Spinner />
        </div>
      )}
      {error && (
        <div className="p-4 text-red-600 bg-red-100">Failed to load tasks.</div>
      )}

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full text-sm text-left text-gray-700">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 font-medium">ID</th>
              <th className="px-6 py-3 font-medium">Account ID</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium">Created At</th>
              <th className="px-6 py-3 font-medium text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data?.content.map((task) => (
              <tr key={task.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">{task.id}</td>
                <td className="px-6 py-4">{task.accountId}</td>
                <td className="px-6 py-4">{task.status}</td>
                <td className="px-6 py-4">
                  {new Date(task.createdAt).toLocaleString()}
                </td>
                <td className="px-6 py-4 text-center space-x-2">
                  <button
                    onClick={() =>
                      setDetailModal({ isOpen: true, taskId: task.id })
                    }
                    className="font-medium text-purple-600 hover:text-purple-800"
                  >
                    Details
                  </button>
                  {task.status === 'FAILED' && (
                    <button
                      onClick={() => handleRetryClick(task)}
                      className="font-medium text-orange-600 hover:text-orange-800"
                    >
                      Retry
                    </button>
                  )}
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

      <Modal
        isOpen={detailModal.isOpen}
        onClose={() => setDetailModal({ isOpen: false, taskId: null })}
        title="Task Details"
      >
        {taskDetails ? (
          <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
            {JSON.stringify(taskDetails, null, 2)}
          </pre>
        ) : (
          <Spinner />
        )}
      </Modal>

      <Modal
        isOpen={retryModal.isOpen}
        onClose={() => setRetryModal({ isOpen: false, task: null })}
        title="Confirm Retry"
      >
        <p>
          Are you sure you want to retry task{' '}
          <span className="font-bold">{retryModal.task?.id}</span>?
        </p>
        <div className="flex justify-end mt-4 space-x-2">
          <button
            onClick={() => setRetryModal({ isOpen: false, task: null })}
            className="px-4 py-2 bg-gray-200 rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={handleRetryConfirm}
            className="px-4 py-2 text-white bg-orange-600 rounded-md"
          >
            Confirm Retry
          </button>
        </div>
      </Modal>
    </div>
  );
}

'use client';

import React, { useState, useMemo } from 'react';
import useSWR from 'swr';
import { getUsers } from '@/app/_lib/apis/admin.api';
import { UserProfile } from '@/app/_lib/apis/admin.api';
import { PaginatedResponse } from '@/app/_types/api';
import Pagination from './shared/Pagination';
import { debounce } from '@/app/_lib/utils';
import { Search, X } from 'lucide-react';
import Spinner from './shared/Spinner';

interface UserFilterBarProps {
  onFilterChange: (filters: { name: string }) => void;
}

const UserFilterBar = ({ onFilterChange }: UserFilterBarProps) => {
  const [name, setName] = useState('');

  const debouncedFilterChange = useMemo(
    () =>
      debounce((newName: string) => {
        onFilterChange({ name: newName });
      }, 500),
    [onFilterChange]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    debouncedFilterChange(e.target.value);
  };

  const clearFilter = () => {
    setName('');
    onFilterChange({ name: '' });
  };

  return (
    <div className="p-4 mb-6 bg-white rounded-lg shadow">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="relative md:col-span-1">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Name
          </label>
          <Search className="absolute w-5 h-5 text-gray-400 top-9 left-3" />
          <input
            type="text"
            name="name"
            id="name"
            value={name}
            onChange={handleInputChange}
            placeholder="Search by name..."
            className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
          />
        </div>
        <div className="flex items-end md:col-span-1">
          <button
            onClick={clearFilter}
            className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            <X className="w-4 h-4 mr-2" />
            Clear Filter
          </button>
        </div>
      </div>
    </div>
  );
};

export default function UsersView() {
  const [page, setPage] = useState(0);
  const [filters, setFilters] = useState({ name: '' });

  const { data, error, isLoading } = useSWR<PaginatedResponse<UserProfile>>(
    `/admin/users?page=${page}&size=10&name=${filters.name}`,
    () => getUsers({ page, size: 10, ...filters }),
    { keepPreviousData: true }
  );

  const handleFilterChange = (newFilters: { name: string }) => {
    setPage(0);
    setFilters(newFilters);
  };

  const renderTable = () => {
    if (error)
      return (
        <div className="p-4 text-center text-red-600 bg-red-100 rounded-md">
          Failed to load users.
        </div>
      );
    if (!data && isLoading)
      return (
        <div className="flex justify-center items-center p-8">
          <Spinner />
        </div>
      );
    if (!data || data.empty)
      return (
        <div className="p-4 text-center text-gray-500 bg-gray-50 rounded-md">
          No users found.
        </div>
      );

    return (
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full text-sm text-left text-gray-700">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 font-medium">Name</th>
              <th className="px-6 py-3 font-medium">Gender</th>
              <th className="px-6 py-3 font-medium">Country</th>
              <th className="px-6 py-3 font-medium">Plan</th>
              <th className="px-6 py-3 font-medium">Created At</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.content.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium">{user.name}</td>
                <td className="px-6 py-4">{user.gender}</td>
                <td className="px-6 py-4">{user.country}</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 text-xs font-semibold text-blue-800 bg-blue-100 rounded-full">
                    {user.plan}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800">Users Management</h1>
      <p className="mt-2 mb-6 text-gray-600">
        Browse and filter user profiles.
      </p>

      <UserFilterBar onFilterChange={handleFilterChange} />

      <div className="mt-6">{renderTable()}</div>

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

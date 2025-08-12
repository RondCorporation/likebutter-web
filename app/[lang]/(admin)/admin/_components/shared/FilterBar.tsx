'use client';

import React, { useState, useMemo } from 'react';
import { Search, X } from 'lucide-react';
import { debounce } from '@/app/_lib/utils';
import { ALL_ROLES } from '@/app/_types/roles';

interface Filter {
  email: string;
  roles: string;
}

interface FilterBarProps {
  onFilterChange: (filters: Filter) => void;
}

export default function FilterBar({ onFilterChange }: FilterBarProps) {
  const [filters, setFilters] = useState<Filter>({ email: '', roles: '' });

  const debouncedFilterChange = useMemo(
    () =>
      debounce((newFilters: Filter) => {
        onFilterChange(newFilters);
      }, 500),
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

  const clearFilters = () => {
    const clearedFilters = { email: '', roles: '' };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  return (
    <div className="p-4 mb-6 bg-white rounded-lg shadow">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
        <div className="relative md:col-span-1">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email
          </label>
          <Search className="absolute w-5 h-5 text-gray-400 top-9 left-3" />
          <input
            type="text"
            name="email"
            id="email"
            value={filters.email}
            onChange={handleInputChange}
            placeholder="Search by email..."
            className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
          />
        </div>
        <div className="md:col-span-1">
          <label
            htmlFor="roles"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Role
          </label>
          <select
            name="roles"
            id="roles"
            value={filters.roles}
            onChange={handleInputChange}
            className="w-full py-2 px-3 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
          >
            <option value="">All Roles</option>
            {ALL_ROLES.map((role) => (
              <option key={role} value={role}>
                {role.replace('ROLE_', '')}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-end md:col-span-1">
          <button
            onClick={clearFilters}
            className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            <X className="w-4 h-4 mr-2" />
            Clear Filters
          </button>
        </div>
      </div>
    </div>
  );
}

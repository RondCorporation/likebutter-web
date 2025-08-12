'use client';

import React, { useState, useEffect } from 'react';
import useSWR from 'swr';
import { getAccounts, updateAccountRole } from '@/app/_lib/apis/admin.api';
import { Account } from '@/app/_lib/apis/admin.api';
import { PaginatedResponse } from '@/app/_types/api';
import { AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import Spinner from './shared/Spinner';
import Pagination from './shared/Pagination';
import FilterBar from './shared/FilterBar';
import ConfirmationModal from './shared/ConfirmationModal';
import { ALL_ROLES, Role } from '@/app/_types/roles';

const RoleBadge = ({ role }: { role: string }) => {
  const roleClass = role.includes('ADMIN')
    ? 'bg-purple-200 text-purple-800'
    : role.includes('MANAGER')
      ? 'bg-yellow-200 text-yellow-800'
      : 'bg-gray-200 text-gray-800';
  return (
    <span
      className={`px-2 py-1 text-xs font-semibold rounded-full ${roleClass}`}
    >
      {role.replace('ROLE_', '')}
    </span>
  );
};

export default function AccountsView() {
  const [page, setPage] = useState(0);
  const [filters, setFilters] = useState({ email: '', roles: '' });
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    account: Account | null;
    step: number;
    selectedRoles: Role[];
  }>({ isOpen: false, account: null, step: 1, selectedRoles: [] });

  const { data, error, isLoading, mutate } = useSWR<PaginatedResponse<Account>>(
    `/admin/accounts?page=${page}&size=10&email=${filters.email}&roles=${filters.roles}`,
    () => getAccounts({ page, size: 10, ...filters }),
    { keepPreviousData: true }
  );

  const handleRoleChangeClick = (account: Account) => {
    const currentRoles = account.roles
      ? (account.roles.split(',') as Role[])
      : [];
    setModalState({
      isOpen: true,
      account,
      step: 1,
      selectedRoles: currentRoles,
    });
  };

  const handleModalClose = () => {
    setModalState({ isOpen: false, account: null, step: 1, selectedRoles: [] });
  };

  const handleRoleSelection = (role: Role, isChecked: boolean) => {
    setModalState((prev) => {
      const selectedRoles = isChecked
        ? [...prev.selectedRoles, role]
        : prev.selectedRoles.filter((r) => r !== role);
      return { ...prev, selectedRoles };
    });
  };

  const handleModalConfirm = async () => {
    if (modalState.step === 1) {
      setModalState((prev) => ({ ...prev, step: 2 }));
    } else {
      const { account, selectedRoles } = modalState;
      if (!account) return;

      const newRolesStr = selectedRoles.join(',');
      const toastId = toast.loading(`Updating roles for ${account.email}...`);

      try {
        await updateAccountRole(account.id, newRolesStr);
        toast.success('Account updated successfully!', { id: toastId });
        mutate();
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to update account.';
        toast.error(errorMessage, { id: toastId });
      } finally {
        handleModalClose();
      }
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800">Accounts Management</h1>
      <p className="mt-2 mb-6 text-gray-600">
        Browse, filter, and manage user accounts.
      </p>

      <FilterBar
        onFilterChange={(newFilters) => {
          setPage(0);
          setFilters(newFilters);
        }}
      />

      <div className="mt-6 overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full text-sm text-left text-gray-700">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 font-medium">Email</th>
              <th className="px-6 py-3 font-medium">Provider</th>
              <th className="px-6 py-3 font-medium">Roles</th>
              <th className="px-6 py-3 font-medium">Created At</th>
              <th className="px-6 py-3 font-medium text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {isLoading && (
              <tr>
                <td colSpan={5} className="p-8 text-center">
                  <Spinner />
                </td>
              </tr>
            )}
            {error && (
              <tr>
                <td
                  colSpan={5}
                  className="p-4 text-center text-red-600 bg-red-100"
                >
                  Failed to load accounts.
                </td>
              </tr>
            )}
            {data &&
              data.content.map((acc) => (
                <tr key={acc.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">{acc.email}</td>
                  <td className="px-6 py-4">{acc.provider}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {acc.roles.split(',').map((role) => (
                        <RoleBadge key={role} role={role} />
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {new Date(acc.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => handleRoleChangeClick(acc)}
                      className="font-medium text-purple-600 hover:text-purple-800"
                    >
                      Change Roles
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
          modalState.step === 1 ? 'Change Roles' : 'Are you absolutely sure?'
        }
      >
        {modalState.account && (
          <div>
            <p>
              Select roles for user:{' '}
              <span className="font-bold">{modalState.account.email}</span>
            </p>
            <div className="grid grid-cols-2 gap-2 mt-4 border p-2 rounded-md max-h-60 overflow-y-auto">
              {ALL_ROLES.map((role) => (
                <label
                  key={role}
                  className="flex items-center space-x-2 p-1 rounded hover:bg-gray-100"
                >
                  <input
                    type="checkbox"
                    checked={modalState.selectedRoles.includes(role)}
                    onChange={(e) =>
                      handleRoleSelection(role, e.target.checked)
                    }
                    className="form-checkbox h-4 w-4 text-purple-600"
                  />
                  <span>{role.replace('ROLE_', '')}</span>
                </label>
              ))}
            </div>
            {modalState.step === 2 && (
              <div className="p-3 mt-4 text-red-800 bg-red-100 rounded-md">
                <AlertTriangle className="inline w-4 h-4 mr-2" />
                This is a critical action. Please confirm the changes.
              </div>
            )}
          </div>
        )}
      </ConfirmationModal>
    </div>
  );
}

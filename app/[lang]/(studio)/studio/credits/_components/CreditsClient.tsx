'use client';

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import {
  getCreditBalance,
  getCreditHistory,
  CreditBalance,
  CreditHistoryPage,
} from '@/app/_lib/apis/credit.api';
import { useRouter } from 'next/navigation';

export default function CreditsClient() {
  const { t } = useTranslation(['studio', 'common']);
  const [creditBalance, setCreditBalance] = useState<CreditBalance | null>(
    null
  );
  const [creditHistory, setCreditHistory] = useState<CreditHistoryPage | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [pageSizeDropdownOpen, setPageSizeDropdownOpen] = useState(false);
  const router = useRouter();

  const pageSizeOptions = [
    { label: t('studio:credits.pagination.5items'), value: 5 },
    { label: t('studio:credits.pagination.10items'), value: 10 },
    { label: t('studio:credits.pagination.20items'), value: 20 },
    { label: t('studio:credits.pagination.50items'), value: 50 },
  ];

  const fetchCreditData = async (page: number = 0) => {
    try {
      setIsLoading(true);
      const [balanceResponse, historyResponse] = await Promise.all([
        getCreditBalance(),
        getCreditHistory(page, pageSize),
      ]);

      if (balanceResponse.status === 200 && balanceResponse.data) {
        setCreditBalance(balanceResponse.data);
      }

      if (historyResponse.status === 200 && historyResponse.data) {
        setCreditHistory(historyResponse.data);
      }
    } catch (err: any) {
      setError(err.message || t('studio:creditsPage.errorMessage'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCreditData(currentPage);
  }, [currentPage, pageSize]);

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(0);
    setPageSizeDropdownOpen(false);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePurchaseCredits = () => {
    router.push('/billing');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hour = date.getHours().toString().padStart(2, '0');
    const minute = date.getMinutes().toString().padStart(2, '0');
    return `${year}.${month}.${day} ${hour}:${minute}`;
  };

  const generatePageNumbers = () => {
    if (!creditHistory) return [];

    const totalPages = creditHistory.totalPages;
    const pageNumbers = [];
    const maxVisiblePages = 5;
    const halfVisible = Math.floor(maxVisiblePages / 2);

    let startPage = Math.max(0, currentPage - halfVisible);
    let endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(0, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-400 text-center">
          <h3 className="text-lg font-semibold mb-2">
            {t('studio:creditsPage.errorOccurred')}
          </h3>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-full bg-[#25282c] pb-28 md:pb-0">
      <div className="px-4 md:px-[90px] py-4 md:py-[44px]">
        {/* Header */}
        <h1 className="text-white text-2xl md:text-3xl font-bold mb-4 md:mb-8">
          {t('studio:creditsPage.title')}
        </h1>

        {/* Credit balance and purchase button */}
        <div className="mb-6 md:mb-8">
          {/* Credit balance box */}
          <div className="bg-[#292c31] border border-[#4a4a4b] rounded-xl md:rounded-2xl p-4 md:p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 md:gap-4">
              <div className="w-full md:w-auto">
                <h3 className="text-white text-sm md:text-lg font-semibold mb-1 md:mb-2">
                  {t('studio:creditsPage.availableCredits')}
                </h3>
                <div className="flex items-center gap-2">
                  <Image
                    src="/credit.svg"
                    alt="Credit"
                    width={20}
                    height={20}
                    className="md:w-6 md:h-6"
                  />
                  <span className="text-white text-2xl md:text-3xl font-bold">
                    {isLoading
                      ? '...'
                      : creditBalance?.currentBalance.toLocaleString() || '0'}
                  </span>
                </div>
              </div>

              {/* Purchase credits button */}
              <button
                onClick={handlePurchaseCredits}
                className="w-full md:w-auto px-4 md:px-6 py-2.5 md:py-3 bg-[#ffd83b] hover:bg-[#f7c80d] text-black font-semibold rounded-lg transition-colors text-sm md:text-base whitespace-nowrap"
              >
                {t('studio:creditsPage.purchaseCredits')}
              </button>
            </div>
          </div>
        </div>

        {/* Usage History */}
        <div className="mb-4">
          <h2 className="text-white text-lg md:text-xl font-semibold mb-4 md:mb-6">
            {t('studio:creditsPage.usageHistory')}
          </h2>

          {/* Page size selection - Desktop only */}
          <div className="hidden md:flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <span className="text-white text-sm">
                {t('studio:creditsPage.display')}
              </span>
              <div className="relative">
                <button
                  onClick={() => setPageSizeDropdownOpen(!pageSizeDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1 bg-[#25282c] border border-[#4a4a4b] text-white rounded text-sm hover:border-[#5a5a5b] transition-colors"
                >
                  <span>
                    {pageSize}
                    {t('studio:archive.pagination.perPage')}
                  </span>
                  <ChevronDown
                    className={`w-3 h-3 transition-transform ${pageSizeDropdownOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {pageSizeDropdownOpen && (
                  <div className="absolute left-0 top-full mt-1 bg-[#25282c] border border-[#4a4a4b] rounded py-1 min-w-[80px] z-10">
                    {pageSizeOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => handlePageSizeChange(option.value)}
                        className="w-full px-3 py-1 text-left text-white text-sm hover:bg-[#4a4a4b] transition-colors"
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block bg-[#292c31] border border-[#4a4a4b] rounded-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#4a4a4b]">
                  <th className="text-left text-white font-medium px-6 py-4 text-sm">
                    {t('studio:creditsPage.time')}
                  </th>
                  <th className="text-left text-white font-medium px-6 py-4 text-sm">
                    {t('studio:creditsPage.type')}
                  </th>
                  <th className="text-left text-white font-medium px-6 py-4 text-sm">
                    {t('studio:creditsPage.description')}
                  </th>
                  <th className="text-right text-white font-medium px-6 py-4 text-sm">
                    {t('studio:userDropdown.credits')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="text-center text-gray-400 px-6 py-8 text-sm"
                    >
                      {t('studio:creditsPage.loading')}
                    </td>
                  </tr>
                ) : creditHistory?.content.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="text-center text-gray-400 px-6 py-8 text-sm"
                    >
                      {t('studio:creditsPage.noHistory')}
                    </td>
                  </tr>
                ) : (
                  creditHistory?.content.map((transaction) => (
                    <tr
                      key={transaction.transactionId}
                      className="border-b border-[#4a4a4b] last:border-b-0"
                    >
                      <td className="text-white px-6 py-4 text-sm">
                        {formatDate(transaction.createdAt)}
                      </td>
                      <td className="text-white px-6 py-4 text-sm">
                        {transaction.type}
                      </td>
                      <td className="text-white px-6 py-4 text-sm">
                        {transaction.description}
                      </td>
                      <td className="text-right px-6 py-4">
                        <div
                          className={`inline-flex items-center justify-center px-3 py-1 rounded-[50px] text-white text-sm font-medium ${
                            transaction.amount > 0
                              ? 'bg-green-500'
                              : 'bg-red-500'
                          }`}
                        >
                          {transaction.amount > 0
                            ? `+${transaction.amount}`
                            : transaction.amount}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile List View */}
          <div className="md:hidden">
            {/* Top thick border */}
            <div className="border-t-2 border-[#4a4a4b] mb-0"></div>

            {isLoading ? (
              <div className="text-center text-gray-400 py-8 text-sm">
                {t('studio:creditsPage.loading')}
              </div>
            ) : creditHistory?.content.length === 0 ? (
              <div className="text-center text-gray-400 py-8 text-sm">
                {t('studio:creditsPage.noHistory')}
              </div>
            ) : (
              <>
                {creditHistory?.content.map((transaction, index) => (
                  <div key={transaction.transactionId}>
                    <div className="py-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="text-[#a8a8aa] text-xs mb-1">
                            {formatDate(transaction.createdAt)}
                          </div>
                          <div className="text-white text-sm font-medium mb-1">
                            {transaction.type}
                          </div>
                          <div className="text-[#a8a8aa] text-xs">
                            {transaction.description}
                          </div>
                        </div>
                        <div
                          className={`ml-3 flex-shrink-0 inline-flex items-center justify-center px-2.5 py-1 rounded-[50px] text-white text-sm font-medium ${
                            transaction.amount > 0
                              ? 'bg-green-500'
                              : 'bg-red-500'
                          }`}
                        >
                          {transaction.amount > 0
                            ? `+${transaction.amount}`
                            : transaction.amount}
                        </div>
                      </div>
                    </div>
                    {/* Thin divider between items (not after the last item) */}
                    {index < creditHistory.content.length - 1 && (
                      <div className="border-t border-[#4a4a4b]"></div>
                    )}
                  </div>
                ))}
              </>
            )}
          </div>

          {/* Pagination */}
          {creditHistory && creditHistory.totalPages > 1 && (
            <div className="mt-6">
              {/* Desktop Pagination */}
              <div className="hidden md:flex items-center justify-between">
                {/* Result info */}
                <span className="text-white text-sm">
                  {creditHistory.totalElements > 0
                    ? t('studio:archive.messages.resultsCount', {
                        start: currentPage * pageSize + 1,
                        end: Math.min(
                          (currentPage + 1) * pageSize,
                          creditHistory.totalElements
                        ),
                        total: creditHistory.totalElements,
                      })
                    : t('studio:archive.pagination.noResults')}
                </span>

                {/* Page navigation */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 0}
                    className="p-1 text-white hover:bg-[#4a4a4b] rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  {generatePageNumbers().map((pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-3 py-1 text-sm rounded transition-colors ${
                        pageNum === currentPage
                          ? 'bg-[#ffd93b] text-black'
                          : 'text-white hover:bg-[#4a4a4b]'
                      }`}
                    >
                      {pageNum + 1}
                    </button>
                  ))}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= creditHistory.totalPages - 1}
                    className="p-1 text-white hover:bg-[#4a4a4b] rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Mobile Pagination */}
              <div className="md:hidden flex flex-col gap-3">
                {/* Page navigation - centered */}
                <div className="flex items-center justify-center gap-1">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 0}
                    className="p-1.5 text-white hover:bg-[#4a4a4b] rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  {generatePageNumbers().map((pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-2.5 py-1 text-xs rounded transition-colors ${
                        pageNum === currentPage
                          ? 'bg-[#ffd93b] text-black'
                          : 'text-white hover:bg-[#4a4a4b]'
                      }`}
                    >
                      {pageNum + 1}
                    </button>
                  ))}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= creditHistory.totalPages - 1}
                    className="p-1.5 text-white hover:bg-[#4a4a4b] rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Result info - centered */}
                <div className="text-center text-[#a8a8aa] text-xs">
                  {creditHistory.totalElements > 0
                    ? t('studio:archive.messages.resultsCount', {
                        start: currentPage * pageSize + 1,
                        end: Math.min(
                          (currentPage + 1) * pageSize,
                          creditHistory.totalElements
                        ),
                        total: creditHistory.totalElements,
                      })
                    : t('studio:archive.pagination.noResults')}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

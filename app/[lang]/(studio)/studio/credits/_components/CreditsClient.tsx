'use client';

import React, { useState, useEffect } from 'react';
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
    { label: '5개씩', value: 5 },
    { label: '10개씩', value: 10 },
    { label: '20개씩', value: 20 },
    { label: '50개씩', value: 50 },
  ];

  // 크레딧 잔액 및 히스토리 조회
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
      setError(err.message || '데이터를 불러오는 중 오류가 발생했습니다.');
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

  // 페이지네이션 생성
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
          <h3 className="text-lg font-semibold mb-2">오류가 발생했습니다</h3>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#25282c] min-h-screen">
      <div className="px-[90px] py-[44px]">
        {/* Header */}
        <h1 className="text-white text-3xl font-bold mb-8">내 크레딧</h1>

        {/* 크레딧 잔액 및 구매 버튼 */}
        <div className="mb-8">
          {/* 크레딧 잔액 박스 */}
          <div className="bg-[#292c31] border border-[#4a4a4b] rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white text-lg font-semibold mb-2">
                  사용 가능한 크레딧
                </h3>
                <div className="flex items-center gap-2">
                  <Image
                    src="/credit.svg"
                    alt="Credit"
                    width={24}
                    height={24}
                  />
                  <span className="text-white text-2xl font-bold">
                    {isLoading
                      ? '...'
                      : creditBalance?.currentBalance.toLocaleString() || '0'}
                  </span>
                </div>
              </div>

              {/* 크레딧 구매 버튼 - 박스 안 우측에 위치 */}
              <button
                onClick={handlePurchaseCredits}
                className="px-6 py-3 bg-[#ffd83b] hover:bg-[#f7c80d] text-black font-semibold rounded-lg transition-colors"
              >
                크레딧 구매
              </button>
            </div>
          </div>
        </div>

        {/* 사용 내역 */}
        <div className="mb-4">
          <h2 className="text-white text-xl font-semibold mb-6">사용 내역</h2>

          {/* 페이지 크기 선택 */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <span className="text-white text-sm">표시</span>
              <div className="relative">
                <button
                  onClick={() => setPageSizeDropdownOpen(!pageSizeDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1 bg-[#25282c] border border-[#4a4a4b] text-white rounded text-sm hover:border-[#5a5a5b] transition-colors"
                >
                  <span>{pageSize}개씩</span>
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

          {/* 테이블 */}
          <div className="bg-[#292c31] border border-[#4a4a4b] rounded-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#4a4a4b]">
                  <th className="text-left text-white font-medium px-6 py-4">
                    Time
                  </th>
                  <th className="text-left text-white font-medium px-6 py-4">
                    Type
                  </th>
                  <th className="text-left text-white font-medium px-6 py-4">
                    Description
                  </th>
                  <th className="text-right text-white font-medium px-6 py-4">
                    Credits
                  </th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="text-center text-gray-400 px-6 py-8"
                    >
                      로딩 중...
                    </td>
                  </tr>
                ) : creditHistory?.content.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="text-center text-gray-400 px-6 py-8"
                    >
                      사용 내역이 없습니다.
                    </td>
                  </tr>
                ) : (
                  creditHistory?.content.map((transaction) => (
                    <tr
                      key={transaction.transactionId}
                      className="border-b border-[#4a4a4b] last:border-b-0"
                    >
                      <td className="text-white px-6 py-4">
                        {formatDate(transaction.createdAt)}
                      </td>
                      <td className="text-white px-6 py-4">
                        {transaction.type}
                      </td>
                      <td className="text-white px-6 py-4">
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

          {/* 페이지네이션 */}
          {creditHistory && creditHistory.totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              {/* 결과 정보 */}
              <span className="text-white text-sm">
                {creditHistory.totalElements > 0
                  ? `${currentPage * pageSize + 1} ~ ${Math.min((currentPage + 1) * pageSize, creditHistory.totalElements)}개 / 총 ${creditHistory.totalElements}개`
                  : '결과 없음'}
              </span>

              {/* 페이지 네비게이션 */}
              <div className="flex items-center gap-1">
                {/* Previous button */}
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 0}
                  className="p-1 text-white hover:bg-[#4a4a4b] rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {/* Page numbers */}
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

                {/* Next button */}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= creditHistory.totalPages - 1}
                  className="p-1 text-white hover:bg-[#4a4a4b] rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

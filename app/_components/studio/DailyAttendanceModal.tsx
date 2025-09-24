'use client';

import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';
import Image from 'next/image';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onClaimCredit: () => void;
  isLoading?: boolean;
}

export default function DailyAttendanceModal({
  isOpen,
  onClose,
  onClaimCredit,
  isLoading = false,
}: Props) {
  const { t } = useTranslation(['studio', 'common']);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-2xl mx-4 bg-[#25282c] border border-white/10 rounded-2xl p-6">
        {/* Header with title and close button */}
        <div className="relative flex items-center justify-center mb-6">
          <h2 className="text-xl font-semibold text-white">{t('studio:attendance.modal.title')}</h2>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="absolute right-0 p-2 text-gray-400 hover:text-white transition-colors disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Main Image */}
        <div className="flex justify-center mb-6 px-4">
          <Image
            src="/studio/daily_credit_image.png"
            alt="Daily Credit"
            width={586}
            height={440}
            className="object-contain w-full"
          />
        </div>

        {/* Content */}
        <div className="text-center mb-8">
          <p className="text-white text-base mb-3">
            {t('studio:attendance.modal.description')}
          </p>
          <p className="text-gray-400 text-sm">
            {t('studio:attendance.modal.subDescription')}
          </p>
        </div>

        {/* Credit Button */}
        <div className="flex justify-center px-4">
          <button
            onClick={onClaimCredit}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 w-full px-8 py-3 bg-yellow-400 hover:bg-yellow-500 text-black rounded-lg transition-colors disabled:opacity-50 font-medium text-lg"
          >
            <Image
              src="/credit_black.svg"
              alt="credit"
              width={24}
              height={24}
              className="flex-shrink-0"
            />
            {isLoading ? t('studio:attendance.modal.receiving') : t('studio:attendance.modal.checkIn')}
          </button>
        </div>
      </div>
    </div>
  );
}

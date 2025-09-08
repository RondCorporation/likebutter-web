'use client';

import { X } from 'lucide-react';

interface ModelSelectPopupProps {
  onClose: () => void;
  lang: string;
}

export default function ModelSelectPopup({
  onClose,
  lang,
}: ModelSelectPopupProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-[678px] bg-[#292c31] rounded-xl border border-[#4a4a4b] p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-white">만들어보기</h2>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-300 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Placeholder content - will be implemented in step 3 */}
        <div className="text-center py-8">
          <p className="text-gray-400">모델 선택 팝업 (3단계에서 구현 예정)</p>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState, useCallback } from 'react';
import { Upload, X } from 'lucide-react';

interface ImageUploadSlot {
  id: string;
  label: string;
  file?: File;
  previewUrl?: string;
  isDragOver?: boolean;
}

interface DynamicImageUploadProps {
  slots: ImageUploadSlot[];
  onFileUpload: (slotId: string, file: File) => void;
  onFileRemove: (slotId: string) => void;
  className?: string;
}

export default function DynamicImageUpload({
  slots,
  onFileUpload,
  onFileRemove,
  className = ''
}: DynamicImageUploadProps) {
  const [dragOverSlot, setDragOverSlot] = useState<string | null>(null);

  const handleFileUpload = (file: File, slotId: string) => {
    // Check file size (200MB limit)
    if (file.size > 200 * 1024 * 1024) {
      alert('파일 크기가 200MB를 초과합니다.');
      return;
    }

    // Check file type
    if (!['image/png', 'image/jpg', 'image/jpeg'].includes(file.type)) {
      alert('지원하지 않는 파일 형식입니다. (png, jpg, jpeg만 지원)');
      return;
    }

    onFileUpload(slotId, file);
  };

  const handleDragOver = useCallback(
    (event: React.DragEvent<HTMLDivElement>, slotId: string) => {
      event.preventDefault();
      setDragOverSlot(slotId);
    },
    []
  );

  const handleDragLeave = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setDragOverSlot(null);
    },
    []
  );

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>, slotId: string) => {
      event.preventDefault();
      setDragOverSlot(null);

      const files = event.dataTransfer.files;
      if (files.length > 0) {
        handleFileUpload(files[0], slotId);
      }
    },
    [onFileUpload]
  );

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    slotId: string
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileUpload(file, slotId);
    }
  };

  return (
    <div className={`${className}`}>
      {/* 3열 그리드로 이미지 슬롯 표시 */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        {slots.map((slot) => (
          <div key={slot.id} className="flex flex-col">
            <div
              className={`relative flex flex-col h-[80px] w-full items-center justify-center bg-studio-content rounded-[12px] transition-all duration-200 ease-out cursor-pointer ${
                !slot.previewUrl ? 'border-2 border-dashed' : ''
              } ${
                dragOverSlot === slot.id
                  ? 'border-studio-button-primary bg-studio-button-primary/5 scale-[1.02]'
                  : 'border-studio-border hover:border-studio-button-primary/50'
              }`}
              onDragOver={(e) => handleDragOver(e, slot.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, slot.id)}
              onClick={() => document.getElementById(`${slot.id}-upload`)?.click()}
            >
              {slot.previewUrl ? (
                <>
                  <img
                    className="w-full h-full object-cover rounded-[12px]"
                    alt={`${slot.label} preview`}
                    src={slot.previewUrl}
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onFileRemove(slot.id);
                    }}
                    className="absolute top-1 right-1 w-4 h-4 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors duration-200"
                  >
                    <X className="w-2 h-2 text-white" />
                  </button>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center p-1">
                  <Upload
                    className={`w-3 h-3 mb-1 transition-all duration-200 ${
                      dragOverSlot === slot.id
                        ? 'text-studio-button-primary scale-110'
                        : 'text-studio-text-secondary'
                    }`}
                  />
                  <div
                    className={`text-[10px] font-pretendard-medium transition-colors duration-200 ${
                      dragOverSlot === slot.id
                        ? 'text-studio-button-primary'
                        : 'text-studio-text-secondary'
                    }`}
                  >
                    {dragOverSlot === slot.id ? '놓기' : slot.label}
                  </div>
                </div>
              )}
            </div>

            {/* 라벨을 이미지 하단에 표시 */}
            <div className="text-studio-text-primary text-[10px] font-pretendard-medium text-center mt-1">
              {slot.label}
            </div>

            <input
              id={`${slot.id}-upload`}
              type="file"
              accept="image/png,image/jpg,image/jpeg"
              onChange={(e) => handleInputChange(e, slot.id)}
              className="hidden"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
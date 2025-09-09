'use client';

import { useState, useCallback } from 'react';
import { HelpCircle, Upload } from 'lucide-react';

export default function DigitalGoodsClient() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileUpload = (file: File) => {
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

    setUploadedFile(file);

    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDragOver = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDragOver(true);
    },
    []
  );

  const handleDragLeave = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDragOver(false);
    },
    []
  );

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);

    const files = event.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  }, []);

  return (
    <div className="flex flex-col flex-1 h-full bg-studio-content">
      <div className="flex items-center justify-between px-4 md:px-12 pb-0 pt-6 sticky top-0 bg-studio-content z-10 border-b border-studio-border/50 backdrop-blur-sm">
        <div className="flex-1 text-studio-text-primary text-xl font-bold leading-7 font-pretendard">
          디지털 굿즈
        </div>

        <div className="flex items-center gap-2">
          <button className="inline-flex items-center overflow-hidden rounded-md justify-center px-3 md:px-5 py-2.5 h-[38px] bg-studio-button-primary hover:bg-studio-button-hover active:scale-95 transition-all duration-200">
            <div className="text-studio-header text-xs md:text-sm font-bold leading-[14px] whitespace-nowrap font-pretendard-bold">
              굿즈생성
            </div>
          </button>

          <button className="inline-flex items-center overflow-hidden rounded-md justify-center border border-solid border-studio-button-primary px-3 md:px-5 py-2.5 h-[38px] opacity-60 hover:opacity-80 active:scale-95 transition-all duration-200 disabled:opacity-40">
            <div className="text-studio-button-primary text-xs md:text-sm font-bold leading-[14px] whitespace-nowrap font-pretendard-bold">
              저장하기
            </div>
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row flex-1 items-start gap-4 md:gap-6 self-stretch w-full px-4 md:px-12 pt-4 md:pt-6 pb-[100px] md:pb-12 md:overflow-hidden">
        <div className="flex flex-col w-full md:w-[330px] md:self-stretch bg-studio-border rounded-[20px] p-[15px] gap-[18px] shadow-sm">
          {/* 드래그 앤 드롭 영역 */}
          <div
            className={`flex flex-col aspect-square items-center justify-center bg-studio-content rounded-[20px] transition-all duration-200 ease-out ${
              !previewUrl ? 'border-2 border-dashed' : ''
            } ${
              isDragOver
                ? 'border-studio-button-primary bg-studio-button-primary/5 scale-[1.02]'
                : 'border-studio-border hover:border-studio-button-primary/50'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {previewUrl ? (
              <img
                className="w-full h-full object-contain rounded-[20px]"
                alt="Uploaded preview"
                src={previewUrl}
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center p-4">
                <Upload
                  className={`w-8 h-8 mb-3 transition-all duration-200 ${
                    isDragOver
                      ? 'text-studio-button-primary scale-110'
                      : 'text-studio-text-secondary'
                  }`}
                />
                <div
                  className={`text-sm mb-1 font-pretendard-medium transition-colors duration-200 ${
                    isDragOver
                      ? 'text-studio-button-primary'
                      : 'text-studio-text-secondary'
                  }`}
                >
                  {isDragOver
                    ? '파일을 놓아주세요'
                    : '파일을 여기다 끌어다 놓으세요'}
                </div>
                <div className="text-studio-text-muted text-xs font-pretendard">
                  파일당 200mb 제한 (png, jpg, jpeg)
                </div>
              </div>
            )}
          </div>

          {/* 파일 찾아보기 버튼 */}
          <button
            onClick={() => document.getElementById('file-upload')?.click()}
            className="w-full h-[38px] bg-[#414141] hover:bg-[#515151] active:bg-[#313131] rounded-md flex items-center justify-center transition-all duration-200 flex-shrink-0 active:scale-[0.98]"
          >
            <div className="text-studio-text-secondary text-xs font-semibold font-pretendard">
              파일 찾아보기
            </div>
          </button>

          <input
            id="file-upload"
            type="file"
            accept="image/png,image/jpg,image/jpeg"
            onChange={handleInputChange}
            className="hidden"
          />
        </div>

        <div className="relative w-full md:self-stretch md:flex-1 bg-studio-border rounded-[20px] min-h-[300px] md:min-h-0 shadow-sm">
          <div className="flex flex-col items-center justify-center gap-2.5 p-2.5 absolute top-[15px] left-[15px] right-[15px] bottom-[15px] bg-studio-header rounded-[20px] border border-dashed border-studio-header">
            <div className="flex flex-col items-center gap-4 relative self-stretch w-full flex-[0_0_auto]">
              <div className="flex flex-col w-[142px] items-center gap-3.5 relative flex-[0_0_auto]">
                <HelpCircle className="relative w-12 h-12" color="#89898A" />
              </div>

              <div className="relative w-[174px] h-[50px]">
                <div className="inline-flex flex-col items-center gap-2 relative">
                  <div className="w-fit mt-[-1px] font-pretendard-medium text-studio-text-secondary text-base text-center leading-6 whitespace-nowrap relative tracking-[0]">
                    결과 이미지
                  </div>

                  <div className="relative w-fit font-pretendard text-studio-text-muted text-xs text-center tracking-[0] leading-[18px] whitespace-nowrap">
                    파일당 200mb 제한 (png, jpg, jpeg)
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
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

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);
    
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  return (
    <div className="flex flex-col flex-1 h-full bg-[#25282c]">
      {/* Header with Title and Buttons */}
      <div className="flex items-center gap-2 px-12 pt-6 pb-0">
        <div className="flex-1 text-white text-xl font-bold leading-7" style={{ fontFamily: 'Pretendard, Helvetica' }}>
          디지털 굿즈
        </div>

        {/* 굿즈생성 Button */}
        <button className="inline-flex items-center overflow-hidden rounded-md justify-center px-5 py-2.5 h-[38px] bg-[#ffd83b]">
          <div className="text-[#4a4a4b] text-sm font-bold leading-[14px] whitespace-nowrap" style={{ fontFamily: 'Pretendard-Bold, Helvetica' }}>
            굿즈생성
          </div>
        </button>

        {/* 저장하기 Button */}
        <button className="inline-flex items-center overflow-hidden rounded-md justify-center border border-solid border-[#ffd83b] px-5 py-2.5 h-[38px] opacity-60">
          <div className="text-[#ffd83b] text-sm font-bold leading-[14px] whitespace-nowrap" style={{ fontFamily: 'Pretendard-Bold, Helvetica' }}>
            저장하기
          </div>
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex items-center gap-6 relative flex-1 self-stretch w-full grow px-12 pt-6 pb-12">
        
        {/* Left Upload Area */}
        <div className="relative self-stretch w-[330px] bg-[#313030] rounded-[20px] overflow-hidden">
          <div 
            className={`flex flex-col w-[300px] min-h-[300px] items-center justify-center gap-2.5 p-2.5 absolute top-[15px] left-[15px] bg-[#25282c] rounded-[20px] ${
              !previewUrl ? 'border-2 border-dashed' : ''
            } transition-colors ${
              isDragOver ? 'border-[#ffd83b]' : 'border-[#25282c]'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {previewUrl ? (
              <img
                className="relative w-[189px] h-64 aspect-[0.74] object-cover"
                alt="Uploaded preview"
                src={previewUrl}
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <Upload className="w-8 h-8 mb-3 text-[#a8a8aa]" />
                <div className="text-[#a8a8aa] text-sm mb-1" style={{ fontFamily: 'Pretendard-Medium, Helvetica' }}>
                  파일을 여기다 끌어다 놓으세요
                </div>
                <div className="text-[#89898b] text-xs" style={{ fontFamily: 'Pretendard-Regular, Helvetica' }}>
                  파일당 200mb 제한 (png,jpg,jpeg)
                </div>
              </div>
            )}
          </div>

          {/* File Upload Button */}
          <button
            onClick={() => document.getElementById('file-upload')?.click()}
            className="absolute left-[15px] top-[333px] w-[300px] h-[38px] bg-[#414141] rounded-md flex items-center justify-center"
          >
            <div className="text-[#a8a8aa] text-xs font-semibold" style={{ fontFamily: 'Pretendard, Helvetica' }}>
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

        {/* Right Area Container */}
        <div className="relative self-stretch w-[650px] bg-[#313131] rounded-[20px]">
          {/* Result Area - positioned absolute inside the container */}
          <div className="flex flex-col w-[608px] h-[653px] items-center justify-center gap-2.5 p-2.5 absolute top-[15px] left-[21px] bg-[#292c31] rounded-[20px] border border-dashed border-[#292c31]">
            <div className="flex flex-col items-center gap-4 relative self-stretch w-full flex-[0_0_auto]">
              <div className="flex flex-col w-[142px] items-center gap-3.5 relative flex-[0_0_auto]">
                <HelpCircle className="relative w-12 h-12" color="#89898A" />
              </div>

              <div className="relative w-[174px] h-[50px]">
                <div className="inline-flex flex-col items-center gap-2 relative">
                  <div className="w-fit mt-[-1px] font-medium text-[#a8a8aa] text-base text-center leading-6 whitespace-nowrap relative tracking-[0]" style={{ fontFamily: 'Pretendard-Medium, Helvetica' }}>
                    결과 이미지
                  </div>

                  <div className="relative w-fit font-normal text-[#89898b] text-xs text-center tracking-[0] leading-[18px] whitespace-nowrap" style={{ fontFamily: 'Pretendard-Regular, Helvetica' }}>
                    파일당 200mb 제한 (png,jpg,jpeg)
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
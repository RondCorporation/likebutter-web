'use client';

import { useState, useCallback } from 'react';
import { HelpCircle, Upload, Download, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface VirtualCastingFormData {
  selectedCharacter: {
    category: string;
    name: string;
    image: string;
  } | null;
}

interface VirtualCastingClientProps {
  formData?: VirtualCastingFormData;
}

export default function VirtualCastingClient({ formData }: VirtualCastingClientProps) {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);

  const handleFileUpload = (file: File) => {
    // Check file size (200MB limit)
    if (file.size > 200 * 1024 * 1024) {
      toast.error('파일 크기가 200MB를 초과합니다.');
      return;
    }

    // Check file type
    if (!['image/png', 'image/jpg', 'image/jpeg'].includes(file.type)) {
      toast.error('지원하지 않는 파일 형식입니다. (png, jpg, jpeg만 지원)');
      return;
    }

    setUploadedFile(file);

    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleGenerate = async () => {
    if (!formData) return;

    setIsProcessing(true);
    setResultImage(null);

    try {
      // TODO: API 연결
      console.log('Virtual casting generation data:', { formData, uploadedFile });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Mock result
      setResultImage('https://via.placeholder.com/400x400/444444/FFFFFF?text=Virtual+Casting+Result');
      toast.success('가상 캐스팅이 완료되었습니다!');

    } catch (error) {
      console.error('Failed to generate virtual casting result:', error);
      toast.error('가상 캐스팅에 실패했습니다.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = async () => {
    if (!resultImage) return;

    try {
      const response = await fetch(resultImage);
      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `virtual-casting-result-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success('이미지가 다운로드되었습니다!');
    } catch (error) {
      console.error('Download failed:', error);
      toast.error('다운로드에 실패했습니다.');
    }
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

  const isFormValid = () => {
    if (!formData) return false;

    // 캐릭터 선택과 이미지 업로드 모두 필수
    return formData.selectedCharacter !== null && uploadedFile !== null;
  };

  return (
    <div className="flex flex-col flex-1 h-full bg-studio-content">
      <div className="flex items-center justify-between px-4 md:px-12 pb-0 pt-6 sticky top-0 bg-studio-content z-10 border-b border-studio-border/50 backdrop-blur-sm">
        <div className="flex-1 text-xl font-bold leading-7 font-pretendard bg-gradient-to-r from-[#FFCC00] to-[#E8FA07] bg-clip-text text-transparent">
          가상 캐스팅
        </div>

        <div className="flex items-center gap-2">
          {!resultImage ? (
            <button
              onClick={handleGenerate}
              disabled={isProcessing || !isFormValid()}
              className="inline-flex items-center overflow-hidden rounded-md justify-center px-3 md:px-5 py-2.5 h-[38px] bg-studio-button-primary hover:bg-studio-button-hover active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              <div className="text-studio-header text-xs md:text-sm font-bold leading-[14px] whitespace-nowrap font-pretendard-bold">
                {isProcessing ? '생성중...' : '캐스팅생성'}
              </div>
            </button>
          ) : (
            <button
              onClick={handleDownload}
              className="inline-flex items-center overflow-hidden rounded-md justify-center border border-solid border-studio-button-primary px-3 md:px-5 py-2.5 h-[38px] hover:bg-studio-button-primary/10 active:scale-95 transition-all duration-200"
            >
              <Download className="w-4 h-4 mr-1" />
              <div className="text-studio-button-primary text-xs md:text-sm font-bold leading-[14px] whitespace-nowrap font-pretendard-bold">
                다운로드
              </div>
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col md:flex-row flex-1 items-start gap-4 md:gap-6 self-stretch w-full px-4 md:px-12 pt-4 md:pt-6 pb-[100px] md:pb-12 md:h-[calc(100vh-180px)] md:overflow-hidden">
        <div className="flex flex-col w-full md:w-[330px] md:h-[calc(100vh-180px)] md:max-h-[calc(100vh-180px)] md:min-h-0 bg-studio-border rounded-[20px] p-[15px] gap-[18px] shadow-sm md:overflow-y-auto">
          {/* 제목 */}
          <div className="flex items-center justify-between">
            <div className="text-studio-text-primary text-sm font-pretendard-medium">
              내 사진
            </div>
          </div>

          {/* 드래그 앤 드롭 영역 */}
          <div
            className={`flex flex-col h-[280px] w-full items-center justify-center bg-studio-content rounded-[20px] transition-all duration-200 ease-out flex-shrink-0 ${
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

        <div className="relative w-full md:flex-1 md:h-[calc(100vh-180px)] md:flex-shrink-0 bg-studio-border rounded-[20px] min-h-[300px] md:min-h-0 shadow-sm md:overflow-hidden">
          <div className="flex flex-col items-center justify-center gap-2.5 p-2.5 absolute top-[15px] left-[15px] right-[15px] bottom-[15px] bg-studio-header rounded-[20px] border border-dashed border-studio-header">
            {isProcessing ? (
              // 로딩 상태
              <div className="flex flex-col items-center justify-center gap-4 w-full h-full">
                <Loader2 className="w-12 h-12 animate-spin text-studio-button-primary" />
                <div className="flex flex-col items-center gap-2 text-center">
                  <div className="text-studio-text-primary text-base font-pretendard-medium">
                    가상 캐스팅 생성 중...
                  </div>
                  <div className="text-studio-text-muted text-sm font-pretendard">
                    잠시 기다리시면 결과가 나옵니다
                  </div>
                </div>
              </div>
            ) : resultImage ? (
              // 결과 이미지 표시
              <div className="relative w-full h-full">
                <img
                  src={resultImage}
                  alt="Generated virtual casting result"
                  className="w-full h-full object-contain rounded-[20px]"
                />
                <button
                  onClick={handleDownload}
                  className="absolute top-4 right-4 p-2 bg-studio-sidebar/80 hover:bg-studio-sidebar rounded-lg backdrop-blur-sm transition-all duration-200"
                  title="다운로드"
                >
                  <Download className="w-5 h-5 text-studio-text-primary" />
                </button>
              </div>
            ) : (
              // 기본 상태
              <div className="flex flex-col items-center justify-center w-full h-full">
                <div className="flex flex-col items-center text-center">
                  <HelpCircle className="w-12 h-12 text-studio-text-muted mb-4" />
                  <div className="font-pretendard-medium text-studio-text-secondary text-base leading-6 mb-2">
                    결과 이미지
                  </div>
                  <div className="font-pretendard text-studio-text-muted text-xs leading-[18px]">
                    사이드바에서 설정을 완료하고
                    <br />
                    '캐스팅생성'을 눌러주세요
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
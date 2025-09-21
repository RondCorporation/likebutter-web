'use client';

import { useState, useRef } from 'react';
import StudioButton from '../../_components/ui/StudioButton';
import StudioSlider from '@/app/_components/shared/StudioSlider';
import { Upload, Music } from 'lucide-react';
import { CREDIT_COSTS } from '@/app/_lib/apis/credit.api';

interface MusicUploadProps {
  onGenerate: (data: {
    file: File;
    pitch: number;
    format: 'mp3' | 'wav';
  }) => void;
  onPrevious?: () => void;
}

export default function MusicUpload({
  onGenerate,
  onPrevious,
}: MusicUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [pitch, setPitch] = useState(0);
  const [format, setFormat] = useState<'mp3' | 'wav'>('mp3');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check if file is audio
      if (file.type.startsWith('audio/')) {
        setSelectedFile(file);
      } else {
        alert('오디오 파일만 업로드 가능합니다.');
      }
    }
  };

  const handleGenerate = () => {
    if (!selectedFile) {
      alert('음원 파일을 선택해주세요.');
      return;
    }

    onGenerate({
      file: selectedFile,
      pitch,
      format,
    });
  };

  return (
    <div className="flex flex-col items-center justify-center flex-1 px-4 sm:px-6 py-6 sm:py-8">
      <div className="w-full max-w-lg space-y-6 sm:space-y-8">
        <div className="space-y-6">
          {/* File Upload */}
          <div>
            <label className="block text-white text-xl sm:text-lg font-medium mb-3 sm:mb-4">
              음원 파일 선택
            </label>
            <div
              onClick={handleFileSelect}
              className="flex flex-col items-center justify-center w-full h-32 sm:h-40 border-2 border-dashed border-slate-600 rounded-xl cursor-pointer hover:border-slate-500 transition-colors bg-slate-800/30 hover:bg-slate-800/50"
            >
              {selectedFile ? (
                <div className="flex items-center gap-2 sm:gap-3 text-butter-yellow">
                  <Music size={24} className="sm:w-7 sm:h-7" />
                  <span className="text-sm sm:text-base font-medium max-w-48 sm:max-w-64 truncate">
                    {selectedFile.name}
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 sm:gap-3 text-slate-400">
                  <Upload size={28} className="sm:w-8 sm:h-8" />
                  <div className="text-center">
                    <div className="text-sm sm:text-base font-medium text-white mb-1">
                      파일 찾아보기
                    </div>
                    <div className="text-xs sm:text-sm">MP3, WAV, M4A 등</div>
                  </div>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="audio/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {/* Pitch Control */}
          <div>
            <label className="block text-white text-xl sm:text-lg font-medium mb-3 sm:mb-4">
              목소리 높낮이
            </label>
            <div className="space-y-4">
              <StudioSlider
                value={pitch}
                onChange={setPitch}
                min={-12}
                max={12}
                step={1}
              />
              <div className="flex justify-between text-sm text-slate-400">
                <span>낮게 (-12)</span>
                <span className="text-butter-yellow font-medium">
                  {pitch > 0 ? '+' : ''}
                  {pitch}
                </span>
                <span>높게 (+12)</span>
              </div>
            </div>
          </div>

          {/* File Format */}
          <div>
            <label className="block text-white text-xl sm:text-lg font-medium mb-3 sm:mb-4">
              저장 파일 형식
            </label>
            <div className="flex gap-4 sm:gap-6">
              <label className="flex items-center gap-2 sm:gap-3 cursor-pointer">
                <input
                  type="radio"
                  value="mp3"
                  checked={format === 'mp3'}
                  onChange={(e) => setFormat(e.target.value as 'mp3' | 'wav')}
                  className="w-4 h-4 sm:w-5 sm:h-5 text-butter-yellow bg-slate-700 border-slate-600 focus:ring-butter-yellow focus:ring-2"
                />
                <span className="text-white text-sm sm:text-base font-medium">
                  MP3
                </span>
              </label>
              <label className="flex items-center gap-2 sm:gap-3 cursor-pointer">
                <input
                  type="radio"
                  value="wav"
                  checked={format === 'wav'}
                  onChange={(e) => setFormat(e.target.value as 'mp3' | 'wav')}
                  className="w-4 h-4 sm:w-5 sm:h-5 text-butter-yellow bg-slate-700 border-slate-600 focus:ring-butter-yellow focus:ring-2"
                />
                <span className="text-white text-sm sm:text-base font-medium">
                  WAV
                </span>
              </label>
            </div>
          </div>
        </div>

        <div className="pt-4">
          <div className="flex flex-col sm:flex-row gap-3">
            {onPrevious && (
              <button
                onClick={onPrevious}
                className="flex items-center justify-center px-5 py-3 h-12 rounded-md border-2 border-slate-600 text-slate-300 hover:border-slate-500 hover:text-white transition-colors bg-transparent sm:w-32"
              >
                이전
              </button>
            )}
            <StudioButton
              text="음원생성"
              onClick={handleGenerate}
              className="flex-1"
              creditCost={CREDIT_COSTS.BUTTER_COVER}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

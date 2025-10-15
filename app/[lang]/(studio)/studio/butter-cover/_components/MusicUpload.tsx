'use client';

import { useState, useRef } from 'react';
import StudioButton from '../../_components/ui/StudioButton';
import StudioSlider from '@/app/_components/shared/StudioSlider';
import { Upload, Music } from 'lucide-react';
import { CREDIT_COSTS } from '@/app/_lib/apis/credit.api';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-hot-toast';
import {
  processAudioFile,
  formatFileSize,
  ConversionProgress,
} from '@/app/_lib/audioConverter';

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
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [pitch, setPitch] = useState(0);
  const [format, setFormat] = useState<'mp3' | 'wav'>('mp3');
  const [isProcessing, setIsProcessing] = useState(false);
  const [conversionProgress, setConversionProgress] =
    useState<ConversionProgress | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslation(['studio']);

  const handleFileSelect = () => {
    if (isProcessing) return;
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setConversionProgress(null);

    try {
      // Process file (validate + convert if needed)
      const { file: processedFile, wasConverted, originalSize } =
        await processAudioFile(file, (progress) => {
          setConversionProgress(progress);
        });

      setOriginalFile(file);
      setSelectedFile(processedFile);

      // Show conversion success message
      if (wasConverted) {
        toast.success(
          `${t('butterCover.musicUpload.wavConverted')}: ${formatFileSize(originalSize)} → ${formatFileSize(processedFile.size)} (${Math.round((1 - processedFile.size / originalSize) * 100)}% ${t('butterCover.musicUpload.reduced')})`
        );
      } else {
        toast.success(t('butterCover.musicUpload.fileSelected'));
      }
    } catch (error: any) {
      console.error('File processing error:', error);
      toast.error(error.message || t('butterCover.musicUpload.audioOnlyError'));
      setSelectedFile(null);
      setOriginalFile(null);
    } finally {
      setIsProcessing(false);
      setConversionProgress(null);
      // Reset input so same file can be selected again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleGenerate = () => {
    if (!selectedFile) {
      toast.error(t('butterCover.musicUpload.selectAudioFileError'));
      return;
    }

    onGenerate({
      file: selectedFile,
      pitch,
      format,
    });
  };

  return (
    <div className="flex flex-col items-center justify-center flex-1 sm:px-6 py-6 sm:py-8">
      <div className="w-full max-w-lg space-y-6 sm:space-y-8">
        <div className="space-y-6">
          {/* File Upload */}
          <div>
            <label className="block text-white text-base sm:text-lg font-medium mb-3 sm:mb-4">
              {t('butterCover.musicUpload.selectAudioFile')}
            </label>
            <div
              onClick={handleFileSelect}
              className={`flex flex-col items-center justify-center w-full h-32 sm:h-40 border-2 border-dashed rounded-xl transition-colors ${
                isProcessing
                  ? 'border-butter-yellow bg-slate-800/50 cursor-wait'
                  : 'border-slate-600 hover:border-slate-500 cursor-pointer bg-slate-800/30 hover:bg-slate-800/50'
              }`}
            >
              {isProcessing ? (
                <div className="flex flex-col items-center gap-3 text-butter-yellow">
                  <div className="w-10 h-10 border-3 border-butter-yellow border-t-transparent rounded-full animate-spin" />
                  <div className="text-center">
                    <div className="text-sm sm:text-base font-medium">
                      {conversionProgress?.stage === 'decoding'
                        ? t('butterCover.musicUpload.decoding')
                        : conversionProgress?.stage === 'encoding'
                          ? t('butterCover.musicUpload.converting')
                          : t('butterCover.musicUpload.processing')}
                    </div>
                    {conversionProgress && (
                      <div className="text-xs sm:text-sm mt-1">
                        {conversionProgress.progress}%
                      </div>
                    )}
                  </div>
                </div>
              ) : selectedFile ? (
                <div className="flex flex-col items-center gap-2">
                  <div className="flex items-center gap-2 sm:gap-3 text-butter-yellow">
                    <Music size={24} className="sm:w-7 sm:h-7" />
                    <span className="text-sm sm:text-base font-medium max-w-48 sm:max-w-64 truncate">
                      {originalFile?.name || selectedFile.name}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400">
                    {formatFileSize(selectedFile.size)}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 sm:gap-3 text-slate-400">
                  <Upload size={28} className="sm:w-8 sm:h-8" />
                  <div className="text-center">
                    <div className="text-sm sm:text-base font-medium text-white mb-1">
                      {t('butterCover.musicUpload.browseFile')}
                    </div>
                    <div className="text-xs sm:text-sm text-butter-yellow">
                      {t('butterCover.musicUpload.audioFormats')}
                    </div>
                    <div className="text-xs text-slate-400 mt-1">
                      {t('butterCover.musicUpload.audioFormatsDetail')}
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      {t('butterCover.musicUpload.maxSize')}
                    </div>
                  </div>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="audio/mpeg,audio/wav,audio/mp3,.mp3,.wav"
              onChange={handleFileChange}
              className="hidden"
              disabled={isProcessing}
            />
          </div>

          {/* Pitch Control */}
          <div>
            <label className="block text-white text-base sm:text-lg font-medium mb-3 sm:mb-4">
              {t('butterCover.musicUpload.voicePitch')}
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
                <span>{t('butterCover.musicUpload.lowPitch')}</span>
                <span className="text-butter-yellow font-medium">
                  {pitch > 0 ? '+' : ''}
                  {pitch}
                </span>
                <span>{t('butterCover.musicUpload.highPitch')}</span>
              </div>
            </div>
          </div>

          {/* File Format */}
          <div>
            <label className="block text-white text-base sm:text-lg font-medium mb-3 sm:mb-4">
              {t('butterCover.musicUpload.outputFormat')}
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
                disabled={isProcessing}
                className="flex items-center justify-center px-5 py-3 h-12 rounded-md border-2 border-slate-600 text-slate-300 hover:border-slate-500 hover:text-white transition-colors bg-transparent sm:w-32 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t('butterCover.musicUpload.previous')}
              </button>
            )}
            <StudioButton
              text={t('butterCover.musicUpload.generateAudio')}
              onClick={handleGenerate}
              className="flex-1"
              creditCost={CREDIT_COSTS.BUTTER_COVER}
              disabled={isProcessing || !selectedFile}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

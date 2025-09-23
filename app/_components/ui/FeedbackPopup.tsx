'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Upload, X } from 'lucide-react';
import BasePopup from './BasePopup';
import StudioButton from '@/app/[lang]/(studio)/studio/_components/ui/StudioButton';

interface FeedbackPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FeedbackPopup({ isOpen, onClose }: FeedbackPopupProps) {
  const [email, setEmail] = useState('');
  const [description, setDescription] = useState('');
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileUpload = (file: File) => {
    // 5MB 제한
    if (file.size > 5 * 1024 * 1024) {
      toast.error('파일 크기가 5MB를 초과합니다.');
      return;
    }

    setAttachedFile(file);
  };

  const handleSubmit = async () => {
    // 필수 필드 검증
    if (!email.trim()) {
      toast.error('이메일을 입력해주세요.');
      return;
    }

    if (!description.trim()) {
      toast.error('설명을 입력해주세요.');
      return;
    }

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('올바른 이메일 형식을 입력해주세요.');
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: API 연결 시 실제 요청 로직 추가
      await new Promise(resolve => setTimeout(resolve, 1000)); // 임시 딜레이

      toast.success('피드백이 성공적으로 제출되었습니다.');

      // 폼 초기화
      setEmail('');
      setDescription('');
      setAttachedFile(null);
      onClose();
    } catch (error) {
      toast.error('피드백 제출에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeFile = () => {
    setAttachedFile(null);
  };

  return (
    <BasePopup
      isOpen={isOpen}
      onClose={onClose}
      title="피드백"
    >
      <div className="flex flex-col gap-6">
        {/* 이메일 입력 */}
        <div className="flex flex-col gap-2">
          <label className="text-studio-text-primary text-sm font-medium">
            이메일 <span className="text-red-400">*</span>
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="연락받을 이메일을 입력해주세요"
            className="w-full px-3 py-2.5 bg-studio-sidebar border border-studio-border rounded-md text-studio-text-primary placeholder-studio-text-secondary focus:outline-none focus:border-studio-button-primary transition-colors"
          />
        </div>

        {/* 설명 입력 */}
        <div className="flex flex-col gap-2">
          <label className="text-studio-text-primary text-sm font-medium">
            설명 <span className="text-red-400">*</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="경험한 문제를 신고하여 새로운 아이디어로 서비스를 개선할 수 있게 도와주세요."
            rows={4}
            className="w-full px-3 py-2.5 bg-studio-sidebar border border-studio-border rounded-md text-studio-text-primary placeholder-studio-text-secondary focus:outline-none focus:border-studio-button-primary transition-colors resize-none"
          />
        </div>

        {/* 첨부파일 */}
        <div className="flex flex-col gap-2">
          <label className="text-studio-text-primary text-sm font-medium">
            첨부파일 (5MB 이하)
          </label>

          {attachedFile ? (
            <div className="flex items-center justify-between p-3 bg-studio-border rounded-md">
              <div className="flex items-center gap-2">
                <Upload className="w-4 h-4 text-studio-text-secondary" />
                <span className="text-studio-text-primary text-sm truncate">
                  {attachedFile.name}
                </span>
                <span className="text-studio-text-secondary text-xs">
                  ({(attachedFile.size / 1024 / 1024).toFixed(2)}MB)
                </span>
              </div>
              <button
                onClick={removeFile}
                className="text-studio-text-secondary hover:text-red-400 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <>
              <input
                id="feedback-file"
                type="file"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file);
                }}
                className="hidden"
                accept="image/*,.pdf,.doc,.docx,.txt"
              />
              <button
                onClick={() => document.getElementById('feedback-file')?.click()}
                className="flex items-center justify-center gap-2 w-full p-3 border-2 border-dashed border-studio-border rounded-md hover:border-studio-button-primary/50 transition-colors"
              >
                <Upload className="w-4 h-4 text-studio-text-secondary" />
                <span className="text-studio-text-secondary text-sm">
                  파일을 선택하거나 드래그해주세요
                </span>
              </button>
            </>
          )}
        </div>

        {/* 제출 버튼 */}
        <div className="flex gap-3 pt-4">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1 h-12 border border-studio-border rounded-xl text-studio-text-primary hover:bg-studio-border/50 transition-colors disabled:opacity-50"
          >
            취소
          </button>
          <StudioButton
            text={isSubmitting ? '제출 중...' : '제출'}
            onClick={handleSubmit}
            disabled={isSubmitting}
            loading={isSubmitting}
            className="flex-1"
          />
        </div>
      </div>
    </BasePopup>
  );
}
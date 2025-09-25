'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-hot-toast';
import { Upload, X } from 'lucide-react';
import BasePopup from './BasePopup';
import StudioButton from '@/app/[lang]/(studio)/studio/_components/ui/StudioButton';

interface BusinessInquiryPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BusinessInquiryPopup({ isOpen, onClose }: BusinessInquiryPopupProps) {
  const { t } = useTranslation(['common', 'marketing']);
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [description, setDescription] = useState('');
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileUpload = (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      toast.error(t('common:feedback.errors.fileSizeExceeded'));
      return;
    }

    setAttachedFile(file);
  };

  const handleSubmit = async () => {
    if (!email.trim()) {
      toast.error(t('common:feedback.errors.emailRequired'));
      return;
    }

    if (!company.trim()) {
      toast.error('회사명을 입력해주세요.');
      return;
    }

    if (!description.trim()) {
      toast.error(t('common:feedback.errors.descriptionRequired'));
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error(t('common:feedback.errors.invalidEmailFormat'));
      return;
    }

    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success('비즈니스 문의가 성공적으로 전송되었습니다.');

      setEmail('');
      setCompany('');
      setDescription('');
      setAttachedFile(null);
      onClose();
    } catch (error) {
      toast.error(t('common:feedback.errors.submitFailed'));
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
      title="비즈니스 문의"
    >
      <div className="flex flex-col gap-6">
        {/* Company Name Input */}
        <div className="flex flex-col gap-2">
          <label className="text-studio-text-primary text-sm font-medium">
            회사명 <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="회사명을 입력해주세요"
            className="w-full px-3 py-2.5 bg-studio-sidebar border border-studio-border rounded-md text-studio-text-primary placeholder-studio-text-secondary focus:outline-none focus:border-studio-button-primary transition-colors"
          />
        </div>

        {/* Email Input */}
        <div className="flex flex-col gap-2">
          <label className="text-studio-text-primary text-sm font-medium">
            {t('common:feedback.email')} <span className="text-red-400">*</span>
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('common:feedback.emailPlaceholder')}
            className="w-full px-3 py-2.5 bg-studio-sidebar border border-studio-border rounded-md text-studio-text-primary placeholder-studio-text-secondary focus:outline-none focus:border-studio-button-primary transition-colors"
          />
        </div>

        {/* Description Input */}
        <div className="flex flex-col gap-2">
          <label className="text-studio-text-primary text-sm font-medium">
            문의 내용 <span className="text-red-400">*</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="비즈니스 문의 내용을 자세히 작성해주세요"
            rows={4}
            className="w-full px-3 py-2.5 bg-studio-sidebar border border-studio-border rounded-md text-studio-text-primary placeholder-studio-text-secondary focus:outline-none focus:border-studio-button-primary transition-colors resize-none"
          />
        </div>

        {/* File Attachment */}
        <div className="flex flex-col gap-2">
          <label className="text-studio-text-primary text-sm font-medium">
            {t('common:feedback.attachment')}
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
                id="business-inquiry-file"
                type="file"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file);
                }}
                className="hidden"
                accept="image/*,.pdf,.doc,.docx,.txt"
              />
              <button
                onClick={() =>
                  document.getElementById('business-inquiry-file')?.click()
                }
                className="flex items-center justify-center gap-2 w-full p-3 border-2 border-dashed border-studio-border rounded-md hover:border-studio-button-primary/50 transition-colors"
              >
                <Upload className="w-4 h-4 text-studio-text-secondary" />
                <span className="text-studio-text-secondary text-sm">
                  {t('common:feedback.attachmentPlaceholder')}
                </span>
              </button>
            </>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex gap-3 pt-4">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1 h-12 border border-studio-border rounded-xl text-studio-text-primary hover:bg-studio-border/50 transition-colors disabled:opacity-50"
          >
            {t('common:cancel')}
          </button>
          <StudioButton
            text={
              isSubmitting
                ? t('common:feedback.submitting')
                : '문의하기'
            }
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
'use client';

import { useReducer, useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import {
  Sparkles,
  UploadCloud,
  X,
} from 'lucide-react';
import StudioToolCard from '@/components/shared/StudioToolCard';
import StudioButton from '@/components/shared/StudioButton';
import StudioInput from '@/components/shared/StudioInput';
import { createButterGenTask } from '@/app/_lib/apis/task.api';
import { ApiResponse } from '@/app/_types/api';
import Image from 'next/image';

interface TaskResponse {
  taskId: number;
  status: string;
}

type State = {
  isLoading: boolean;
  error: string | null;
  result: ApiResponse<TaskResponse> | null;
};

type Action =
  | { type: 'SUBMIT_START' }
  | { type: 'SUBMIT_SUCCESS'; payload: ApiResponse<TaskResponse> }
  | { type: 'SUBMIT_ERROR'; payload: string }
  | { type: 'RESET' };

const initialState: State = {
  isLoading: false,
  error: null,
  result: null,
};

function apiSubmitReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SUBMIT_START':
      return { ...initialState, isLoading: true };
    case 'SUBMIT_SUCCESS':
      return { ...state, isLoading: false, result: action.payload };
    case 'SUBMIT_ERROR':
      return { ...state, isLoading: false, error: action.payload };
    case 'RESET':
      return initialState;
    default:
      throw new Error('Unhandled action type');
  }
}

export default function ButterGenClient() {
  const { t } = useTranslation();
  const [sourceImage, setSourceImage] = useState<File | null>(null);
  const [prompt, setPrompt] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [state, dispatch] = useReducer(apiSubmitReducer, initialState);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        dispatch({
          type: 'SUBMIT_ERROR',
          payload: 'Image size must be less than 5MB',
        });
        return;
      }
      setSourceImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      dispatch({ type: 'RESET' });
    }
  };

  const handleRemoveImage = () => {
    setSourceImage(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  const handleSubmit = async () => {
    if (!prompt || !sourceImage) {
      dispatch({
        type: 'SUBMIT_ERROR',
        payload: t('butterGenErrorPrompt'),
      });
      return;
    }
    dispatch({ type: 'SUBMIT_START' });

    const formData = new FormData();
    const requestPayload = { prompt };
    formData.append(
      'request',
      new Blob([JSON.stringify(requestPayload)], { type: 'application/json' })
    );
    formData.append('sourceImage', sourceImage);

    try {
      const response = await createButterGenTask(formData);
      dispatch({ type: 'SUBMIT_SUCCESS', payload: response });
    } catch (e: any) {
      dispatch({
        type: 'SUBMIT_ERROR',
        payload: e.message,
      });
    }
  };

  const isGenerationDisabled = state.isLoading || !prompt || !sourceImage;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Left Column: Image Upload */}
        <StudioToolCard>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">
              {t('butterGenStep1')}
            </h3>
            <div
              className="relative flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-600 bg-slate-900/50 text-center transition-all duration-300 hover:border-butter-yellow/50 hover:bg-slate-800/50"
              onClick={() => document.getElementById('face-upload')?.click()}
            >
              {previewUrl ? (
                <>
                  <Image
                    src={previewUrl}
                    alt="Source preview"
                    layout="fill"
                    objectFit="contain"
                    className="rounded-xl p-2"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveImage();
                    }}
                    className="absolute -right-2 -top-2 rounded-full bg-red-500 p-2 text-white shadow-lg transition-all duration-300 hover:scale-110 hover:bg-red-600"
                  >
                    <X size={16} />
                  </button>
                </>
              ) : (
                <div className="flex flex-col items-center text-slate-400">
                  <UploadCloud className="mb-4 h-12 w-12 text-butter-yellow/70" />
                  <p className="mb-2 font-semibold text-slate-200">
                    {t('butterGenUploadLabel')}
                  </p>
                  <p className="text-sm text-slate-400">
                    {t('butterGenUploadPlaceholder')}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    PNG, JPG, WEBP up to 5MB
                  </p>
                </div>
              )}
              <input
                id="face-upload"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </div>
        </StudioToolCard>

        {/* Right Column: Prompt */}
        <StudioToolCard>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">
              {t('butterGenStep2')}
            </h3>
            <StudioInput
              variant="textarea"
              value={prompt}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setPrompt(e.target.value)}
              placeholder={t('butterGenPromptPlaceholder')}
              rows={10}
              className="resize-none"
              error={state.error || undefined}
            />
          </div>
        </StudioToolCard>
      </div>

      {/* Submit Button */}
      <div className="flex justify-center">
        <StudioButton
          onClick={handleSubmit}
          disabled={isGenerationDisabled}
          loading={state.isLoading}
          icon={<Sparkles size={18} />}
          size="lg"
          className="w-full max-w-md"
        >
          {state.isLoading ? t('butterGenButtonLoading') : t('butterGenButton')}
        </StudioButton>
      </div>

      {/* Success Display */}
      {state.result && state.result.data && (
        <StudioToolCard className="border-butter-yellow/30 bg-butter-yellow/5">
          <div className="text-center">
            <div className="mb-4 flex justify-center">
              <div className="rounded-full bg-butter-yellow/20 p-3">
                <Sparkles className="h-6 w-6 text-butter-yellow" />
              </div>
            </div>
            <h4 className="mb-2 text-lg font-semibold text-white">
              {t('butterGenSuccessTitle')}
            </h4>
            <p className="mb-4 text-slate-300">
              {t('butterGenSuccessTaskId')} {state.result.data.taskId} • {' '}
              {t('butterGenSuccessStatus')} {state.result.data.status}
            </p>
            <Link href="/studio/history">
              <StudioButton variant="secondary" size="sm">
                {t('butterGenSuccessLink')}
              </StudioButton>
            </Link>
          </div>
        </StudioToolCard>
      )}
    </div>
  );
}

'use client';

import { useReducer, useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import {
  Sparkles,
  LoaderCircle,
  UploadCloud,
  X,
} from 'lucide-react';
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
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Left Column: Image Upload */}
        <div>
          <label className="mb-3 block text-lg font-medium text-slate-200">
            {t('butterGenStep1')}
          </label>
          <div
            className="relative flex h-80 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-600 bg-slate-800/50 text-center transition-colors hover:border-accent"
            onClick={() => document.getElementById('face-upload')?.click()}
          >
            {previewUrl ? (
              <>
                <Image
                  src={previewUrl}
                  alt="Source preview"
                  layout="fill"
                  objectFit="contain"
                  className="rounded-lg p-2"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveImage();
                  }}
                  className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white shadow-lg transition-transform hover:scale-110"
                >
                  <X size={16} />
                </button>
              </>
            ) : (
              <div className="flex flex-col items-center text-slate-400">
                <UploadCloud className="mb-3 h-10 w-10" />
                <p className="mb-1 font-semibold text-slate-300">
                  {t('butterGenUploadLabel')}
                </p>
                <p className="text-xs text-slate-500">
                  {t('butterGenUploadPlaceholder')}
                </p>
                <p className="text-xs text-slate-500">
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

        {/* Right Column: Prompt */}
        <div>
          <label
            htmlFor="art-prompt"
            className="mb-3 block text-lg font-medium text-slate-200"
          >
            {t('butterGenStep2')}
          </label>
          <textarea
            id="art-prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={t('butterGenPromptPlaceholder')}
            rows={12}
            className="w-full rounded-md border border-white/10 bg-white/5 p-3 text-sm text-white placeholder-slate-500 focus:border-accent focus:ring-0"
          />
        </div>
      </div>

      {/* Submit Button */}
      <button
        disabled={isGenerationDisabled}
        onClick={handleSubmit}
        className="flex w-full items-center justify-center gap-2 rounded-md bg-accent py-3 text-base font-medium text-black transition hover:brightness-90 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
      >
        {state.isLoading ? (
          <LoaderCircle size={18} className="animate-spin" />
        ) : (
          <Sparkles size={18} />
        )}
        {state.isLoading ? t('butterGenButtonLoading') : t('butterGenButton')}
      </button>

      {/* Result/Error Display */}
      <div className="mt-6 text-center text-sm">
        {state.error && <p className="text-red-400">{state.error}</p>}
        {state.result && state.result.data && (
          <div className="rounded-md border border-green-500/30 bg-green-500/10 p-4 text-green-300">
            <p className="font-semibold">{t('butterGenSuccessTitle')}</p>
            <p>
              {t('butterGenSuccessTaskId')} {state.result.data.taskId} |{' '}
              {t('butterGenSuccessStatus')} {state.result.data.status}
            </p>
            <Link
              href="/studio/history"
              className="mt-2 inline-block text-accent underline"
            >
              {t('butterGenSuccessLink')}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

'use client';

import { useReducer, useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { Sparkles, Image as ImageIcon, LoaderCircle } from 'lucide-react';
import { createButterGenTask } from '@/lib/apis/task.api';
import { ApiResponse } from '@/lib/apiClient';

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
  const [idolName, setIdolName] = useState('');
  const [sourceImage, setSourceImage] = useState<File | null>(null);
  const [prompt, setPrompt] = useState('');
  const [imageCount, setImageCount] = useState(1);
  const [width, setWidth] = useState(512);
  const [height, setHeight] = useState(512);

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
      setSourceImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setIdolName('');
    }
  };

  const handleIdolNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIdolName(e.target.value);
    setSourceImage(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  const handleSubmit = async () => {
    if (!prompt || (!idolName && !sourceImage)) {
      dispatch({
        type: 'SUBMIT_ERROR',
        payload: t('butterGenErrorPrompt'),
      });
      return;
    }
    dispatch({ type: 'SUBMIT_START' });

    const formData = new FormData();

    const requestPayload = {
      idolName: sourceImage ? '' : idolName,
      prompt,
      imageCount,
      width,
      height,
    };

    formData.append(
      'request',
      new Blob([JSON.stringify(requestPayload)], { type: 'application/json' })
    );

    if (sourceImage) {
      formData.append('sourceImage', sourceImage);
    }

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

  const isGenerationDisabled =
    state.isLoading || !prompt || (!idolName && !sourceImage);

  return (
    <>
      <div className="mb-6">
        <h3 className="mb-3 block text-lg font-medium text-slate-200">
          {t('butterGenStep1')}
        </h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label
              htmlFor="idol-name"
              className="mb-2 block text-sm text-slate-400"
            >
              {t('butterGenIdolNameLabel')}
            </label>
            <input
              id="idol-name"
              type="text"
              value={idolName}
              onChange={handleIdolNameChange}
              placeholder={t('butterGenIdolNamePlaceholder')}
              className="w-full rounded-md border border-white/10 bg-white/5 p-3 text-sm text-white placeholder-slate-500 focus:border-accent focus:ring-0"
            />
          </div>
          <div className="flex items-center justify-center md:mt-6">
            <div className="relative flex w-full items-center">
              <div className="flex-grow border-t border-white/20"></div>
              <span className="mx-4 flex-shrink text-sm text-slate-400">
                {t('butterGenOr')}
              </span>
              <div className="flex-grow border-t border-white/20"></div>
            </div>
          </div>
          <div>
            <label
              htmlFor="face-upload"
              className="mb-2 block text-sm text-slate-400"
            >
              {t('butterGenUploadLabel')}
            </label>
            <div className="relative flex h-[50px] w-full items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-white/20 bg-white/5 px-4 text-slate-400 transition-colors hover:border-accent/50 hover:text-accent">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Source preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex items-center">
                  <ImageIcon size={20} className="mr-2" />
                  <span className="text-sm">
                    {sourceImage
                      ? sourceImage.name
                      : t('butterGenUploadPlaceholder')}
                  </span>
                </div>
              )}
              <input
                id="face-upload"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleFileChange}
                className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6">
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
          rows={4}
          className="w-full rounded-md border border-white/10 bg-white/5 p-3 text-sm text-white placeholder-slate-500 focus:border-accent focus:ring-0"
        />
      </div>

      <div className="mb-8">
        <h3 className="mb-3 block text-lg font-medium text-slate-200">
          {t('butterGenStep3')}
        </h3>
        <div className="grid grid-cols-1 gap-4 rounded-lg border border-white/10 bg-white/5 p-4 md:grid-cols-3">
          <div>
            <label
              htmlFor="image-count"
              className="mb-2 block text-sm text-slate-300"
            >
              {t('butterGenImageCount')}
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4].map((num) => (
                <button
                  key={num}
                  onClick={() => setImageCount(num)}
                  className={`flex-1 rounded-md border py-2 text-xs font-semibold transition-all ${
                    imageCount === num
                      ? 'border-accent bg-accent text-black'
                      : 'border-white/20 bg-white/10 hover:border-accent/50'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label
              htmlFor="width"
              className="mb-2 block text-sm text-slate-300"
            >
              {t('butterGenWidth')}
            </label>
            <input
              id="width"
              type="number"
              step="64"
              min="512"
              max="1024"
              value={width}
              onChange={(e) => setWidth(parseInt(e.target.value, 10))}
              className="w-full rounded-md border border-white/20 bg-white/10 p-2 text-center text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="height"
              className="mb-2 block text-sm text-slate-300"
            >
              {t('butterGenHeight')}
            </label>
            <input
              id="height"
              type="number"
              step="64"
              min="512"
              max="1024"
              value={height}
              onChange={(e) => setHeight(parseInt(e.target.value, 10))}
              className="w-full rounded-md border border-white/20 bg-white/10 p-2 text-center text-sm"
            />
          </div>
        </div>
      </div>

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
              className="mt-2 inline-block underline"
            >
              {t('butterGenSuccessLink')}
            </Link>
          </div>
        )}
      </div>
    </>
  );
}

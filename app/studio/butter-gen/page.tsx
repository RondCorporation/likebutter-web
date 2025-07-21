'use client';

import { useReducer, useState, useEffect } from 'react';
import Link from 'next/link';
import { Sparkles, Image as ImageIcon, LoaderCircle } from 'lucide-react';
import { apiFetch, ApiResponse } from '@/lib/api';

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

export default function ButterGenPage() {
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
        payload: 'Please provide a face (by name or image) and a prompt.',
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
      const response = await apiFetch<TaskResponse>('/tasks/butter-gen', {
        method: 'POST',
        body: formData,
      });
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
    <div className="mx-auto max-w-4xl">
      <h2 className="mb-2 text-xl font-semibold">Generate with ButterGen</h2>
      <p className="mb-8 text-slate-400">
        원하는 아이돌의 이름을 입력하거나, 인물 사진을 업로드하여 새로운 AI
        아트를 만들어보세요.
      </p>

      <div className="mb-6">
        <h3 className="mb-3 block text-lg font-medium text-slate-200">
          1. Choose a Face
        </h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label
              htmlFor="idol-name"
              className="mb-2 block text-sm text-slate-400"
            >
              By Idol Name
            </label>
            <input
              id="idol-name"
              type="text"
              value={idolName}
              onChange={handleIdolNameChange}
              placeholder="e.g., Jungkook, V, Jimin..."
              className="w-full rounded-md border border-white/10 bg-white/5 p-3 text-sm text-white placeholder-slate-500 focus:border-accent focus:ring-0"
            />
          </div>
          <div className="flex items-center justify-center md:mt-6">
            <div className="relative flex w-full items-center">
              <div className="flex-grow border-t border-white/20"></div>
              <span className="mx-4 flex-shrink text-sm text-slate-400">
                OR
              </span>
              <div className="flex-grow border-t border-white/20"></div>
            </div>
          </div>
          <div>
            <label
              htmlFor="face-upload"
              className="mb-2 block text-sm text-slate-400"
            >
              By Uploading Image
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
                      : 'Click or drag to upload face'}
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
          2. Describe Your Scene
        </label>
        <textarea
          id="art-prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., A cyberpunk warrior in neon-lit Seoul, cinematic lighting, highly detailed..."
          rows={4}
          className="w-full rounded-md border border-white/10 bg-white/5 p-3 text-sm text-white placeholder-slate-500 focus:border-accent focus:ring-0"
        />
      </div>

      <div className="mb-8">
        <h3 className="mb-3 block text-lg font-medium text-slate-200">
          3. Adjust Settings
        </h3>
        <div className="grid grid-cols-1 gap-4 rounded-lg border border-white/10 bg-white/5 p-4 md:grid-cols-3">
          <div>
            <label
              htmlFor="image-count"
              className="mb-2 block text-sm text-slate-300"
            >
              Image Count
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
              Width
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
              Height
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
        Generate Image
      </button>

      <div className="mt-6 text-center text-sm">
        {state.error && <p className="text-red-400">{state.error}</p>}
        {state.result && state.result.data && (
          <div className="rounded-md border border-green-500/30 bg-green-500/10 p-4 text-green-300">
            <p className="font-semibold">Task submitted successfully!</p>
            <p>
              Task ID: {state.result.data.taskId} | Status:{' '}
              {state.result.data.status}
            </p>
            <Link
              href="/studio/history"
              className="mt-2 inline-block underline"
            >
              Check progress in your History page →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

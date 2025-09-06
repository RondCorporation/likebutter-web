'use client';

import { useReducer, useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import {
  Package,
  UploadCloud,
  X,
  Palette,
  Type,
  Sparkles,
} from 'lucide-react';
import StudioToolCard from '@/components/shared/StudioToolCard';
import StudioButton from '@/components/shared/StudioButton';
import StudioInput from '@/components/shared/StudioInput';
import StudioSelect from '@/components/shared/StudioSelect';
import { createDigitalGoodsTask } from '@/app/_lib/apis/task.api';
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

const styles = [
  { value: '포스터', label: '포스터 (Poster)' },
  { value: '스티커', label: '스티커 (Sticker)' },
  { value: '지브리', label: '지브리 (Ghibli)' },
  { value: '피규어', label: '피규어 (Figure)' },
  { value: '카툰', label: '카툰 (Cartoon)' },
];

const accentColors = [
  { value: '#FF5733', label: '🔴 Red', color: '#FF5733' },
  { value: '#33FF57', label: '🟢 Green', color: '#33FF57' },
  { value: '#3357FF', label: '🔵 Blue', color: '#3357FF' },
  { value: '#FF33F5', label: '🟣 Purple', color: '#FF33F5' },
  { value: '#FFFF33', label: '🟡 Yellow', color: '#FFFF33' },
  { value: '#FF8333', label: '🟠 Orange', color: '#FF8333' },
  { value: '#33FFF5', label: '🔵 Cyan', color: '#33FFF5' },
  { value: '#F533FF', label: '🟣 Magenta', color: '#F533FF' },
];

export default function DigitalGoodsClient() {
  const { t } = useTranslation();
  const [sourceImage, setSourceImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [style, setStyle] = useState('포스터');
  const [customPrompt, setCustomPrompt] = useState('');
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [accentColor, setAccentColor] = useState('#FF5733');
  const [productName, setProductName] = useState('');
  const [brandName, setBrandName] = useState('');
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
    if (!sourceImage) {
      dispatch({
        type: 'SUBMIT_ERROR',
        payload: 'Please upload an image to create digital goods',
      });
      return;
    }
    dispatch({ type: 'SUBMIT_START' });

    const request = {
      style,
      ...(customPrompt && { customPrompt }),
      ...(title && { title }),
      ...(subtitle && { subtitle }),
      accentColor,
      ...(productName && { productName }),
      ...(brandName && { brandName }),
    };

    try {
      const response = await createDigitalGoodsTask(sourceImage, request);
      dispatch({ type: 'SUBMIT_SUCCESS', payload: response });
    } catch (e: any) {
      dispatch({
        type: 'SUBMIT_ERROR',
        payload: e.message,
      });
    }
  };

  const isGenerationDisabled = state.isLoading || !sourceImage;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Left Column: Image Upload */}
        <StudioToolCard>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Package size={20} />
              Upload Source Image
            </h3>
            <div
              className="relative flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-600 bg-slate-900/50 text-center transition-all duration-300 hover:border-butter-yellow/50 hover:bg-slate-800/50"
              onClick={() => document.getElementById('image-upload')?.click()}
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
                    Click to upload image
                  </p>
                  <p className="text-sm text-slate-400">
                    Upload your product image
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    PNG, JPG, WEBP up to 5MB
                  </p>
                </div>
              )}
              <input
                id="image-upload"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </div>
        </StudioToolCard>

        {/* Right Column: Digital Goods Settings */}
        <StudioToolCard>
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Sparkles size={20} />
              Digital Goods Settings
            </h3>
            
            {/* Style Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Style</label>
              <StudioSelect
                value={style}
                onChange={setStyle}
                options={styles}
              />
            </div>

            {/* Custom Prompt */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Custom Prompt (Optional)</label>
              <StudioInput
                variant="textarea"
                value={customPrompt}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setCustomPrompt(e.target.value)}
                placeholder="Add custom instructions for your digital goods..."
                rows={3}
                className="resize-none"
              />
            </div>

            {/* Title and Subtitle */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Title</label>
                <StudioInput
                  value={title}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                  placeholder="Product title"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Subtitle</label>
                <StudioInput
                  value={subtitle}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSubtitle(e.target.value)}
                  placeholder="Product subtitle"
                />
              </div>
            </div>

            {/* Accent Color */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <Palette size={16} />
                Accent Color
              </label>
              <div className="grid grid-cols-4 gap-2">
                {accentColors.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => setAccentColor(color.value)}
                    className={`flex items-center gap-2 rounded-lg border-2 p-2 text-xs transition-all ${
                      accentColor === color.value
                        ? 'border-butter-yellow bg-butter-yellow/10'
                        : 'border-slate-600 bg-slate-800 hover:border-slate-500'
                    }`}
                  >
                    <div
                      className="h-4 w-4 rounded-full"
                      style={{ backgroundColor: color.color }}
                    />
                    <span className="text-slate-300">{color.label.split(' ')[0]}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Product and Brand Name */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Product Name</label>
                <StudioInput
                  value={productName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProductName(e.target.value)}
                  placeholder="Product name"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Brand Name</label>
                <StudioInput
                  value={brandName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBrandName(e.target.value)}
                  placeholder="Brand name"
                />
              </div>
            </div>
          </div>
        </StudioToolCard>
      </div>

      {/* Submit Button */}
      <div className="flex justify-center">
        <StudioButton
          onClick={handleSubmit}
          disabled={isGenerationDisabled}
          loading={state.isLoading}
          icon={<Package size={18} />}
          size="lg"
          className="w-full max-w-md"
        >
          {state.isLoading ? 'Creating Digital Goods...' : 'Create Digital Goods'}
        </StudioButton>
      </div>

      {/* Success Display */}
      {state.result && state.result.data && (
        <StudioToolCard className="border-butter-yellow/30 bg-butter-yellow/5">
          <div className="text-center">
            <div className="mb-4 flex justify-center">
              <div className="rounded-full bg-butter-yellow/20 p-3">
                <Package className="h-6 w-6 text-butter-yellow" />
              </div>
            </div>
            <h4 className="mb-2 text-lg font-semibold text-white">
              Digital Goods Creation Started!
            </h4>
            <p className="mb-4 text-slate-300">
              Task ID: {state.result.data.taskId} • Status: {state.result.data.status}
            </p>
            <Link href="/studio/history">
              <StudioButton variant="secondary" size="sm">
                View in History
              </StudioButton>
            </Link>
          </div>
        </StudioToolCard>
      )}

      {/* Error Display */}
      {state.error && (
        <StudioToolCard className="border-red-500/30 bg-red-500/5">
          <div className="text-center">
            <p className="text-red-400">{state.error}</p>
          </div>
        </StudioToolCard>
      )}
    </div>
  );
}
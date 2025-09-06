'use client';

import { useReducer, useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import {
  Moon,
  UploadCloud,
  X,
  Sparkles,
  Image as ImageIcon,
} from 'lucide-react';
import StudioToolCard from '@/components/shared/StudioToolCard';
import StudioButton from '@/components/shared/StudioButton';
import StudioInput from '@/components/shared/StudioInput';
import StudioSelect from '@/components/shared/StudioSelect';
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

const continuationStyles = [
  { value: 'surreal', label: 'Surreal Dreams' },
  { value: 'fantasy', label: 'Fantasy World' },
  { value: 'abstract', label: 'Abstract Art' },
  { value: 'realistic', label: 'Realistic Vision' },
  { value: 'artistic', label: 'Artistic Style' },
  { value: 'cinematic', label: 'Cinematic Scene' },
];

const imageCounts = [
  { value: 1, label: '1 Image' },
  { value: 2, label: '2 Images' },
  { value: 4, label: '4 Images' },
  { value: 6, label: '6 Images' },
  { value: 8, label: '8 Images' },
];

export default function DreamContiClient() {
  const { t } = useTranslation();
  const [sourceImage, setSourceImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dreamPrompt, setDreamPrompt] = useState('');
  const [continuationStyle, setContinuationStyle] = useState('surreal');
  const [imageCount, setImageCount] = useState(4);
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
    if (!dreamPrompt || !sourceImage) {
      dispatch({
        type: 'SUBMIT_ERROR',
        payload: 'Please upload an image and enter a dream prompt',
      });
      return;
    }
    dispatch({ type: 'SUBMIT_START' });

    // TODO: Replace with actual API call when endpoint is available
    setTimeout(() => {
      dispatch({
        type: 'SUBMIT_ERROR',
        payload: 'Dream Conti API endpoint is not yet available. Coming soon!',
      });
    }, 2000);
  };

  const isGenerationDisabled = state.isLoading || !dreamPrompt || !sourceImage;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Left Column: Image Upload */}
        <StudioToolCard>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <ImageIcon size={20} />
              Upload Source Image
            </h3>
            <div
              className="relative flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-600 bg-slate-900/50 text-center transition-all duration-300 hover:border-butter-yellow/50 hover:bg-slate-800/50"
              onClick={() => document.getElementById('dream-image-upload')?.click()}
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
                    Click to upload dream image
                  </p>
                  <p className="text-sm text-slate-400">
                    Upload an image to continue your dream
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    PNG, JPG, WEBP up to 5MB
                  </p>
                </div>
              )}
              <input
                id="dream-image-upload"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </div>
        </StudioToolCard>

        {/* Right Column: Dream Settings */}
        <StudioToolCard>
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Moon size={20} />
              Dream Settings
            </h3>
            
            {/* Dream Prompt */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Dream Prompt</label>
              <StudioInput
                variant="textarea"
                value={dreamPrompt}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDreamPrompt(e.target.value)}
                placeholder="Describe your dream continuation... Flying through colorful clouds, walking in an enchanted forest, swimming in a galaxy of stars..."
                rows={4}
                className="resize-none"
                error={state.error || undefined}
              />
            </div>

            {/* Continuation Style */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Continuation Style</label>
              <StudioSelect
                value={continuationStyle}
                onChange={setContinuationStyle}
                options={continuationStyles}
              />
            </div>

            {/* Image Count */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Number of Images</label>
              <div className="grid grid-cols-3 gap-2">
                {imageCounts.map((count) => (
                  <button
                    key={count.value}
                    type="button"
                    onClick={() => setImageCount(count.value)}
                    className={`rounded-lg border-2 p-3 text-sm font-medium transition-all ${
                      imageCount === count.value
                        ? 'border-butter-yellow bg-butter-yellow/10 text-butter-yellow'
                        : 'border-slate-600 bg-slate-800 text-slate-300 hover:border-slate-500'
                    }`}
                  >
                    {count.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="rounded-lg bg-slate-800/50 p-4">
              <div className="flex items-start gap-3">
                <Moon className="h-5 w-5 text-butter-yellow/70 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-medium text-slate-200 mb-1">About Dream Conti</h4>
                  <p className="text-xs text-slate-400">
                    Create a series of connected images that continue your dream narrative. 
                    Upload a starting image and describe where you want your dream to go next.
                  </p>
                </div>
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
          icon={<Sparkles size={18} />}
          size="lg"
          className="w-full max-w-md"
        >
          {state.isLoading ? 'Creating Dream Continuation...' : 'Continue Dream'}
        </StudioButton>
      </div>

      {/* Coming Soon Notice */}
      <StudioToolCard className="border-butter-yellow/30 bg-butter-yellow/5">
        <div className="text-center">
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-butter-yellow/20 p-3">
              <Moon className="h-6 w-6 text-butter-yellow" />
            </div>
          </div>
          <h4 className="mb-2 text-lg font-semibold text-white">
            Coming Soon!
          </h4>
          <p className="text-slate-300">
            Dream Conti feature is currently in development. Stay tuned for magical dream continuations!
          </p>
        </div>
      </StudioToolCard>

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
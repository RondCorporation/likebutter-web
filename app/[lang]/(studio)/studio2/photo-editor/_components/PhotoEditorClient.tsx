'use client';

import { useReducer, useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import {
  ImageIcon,
  UploadCloud,
  X,
  Sliders,
} from 'lucide-react';
import StudioToolCard from '@/components/shared/StudioToolCard';
import StudioButton from '@/components/shared/StudioButton';
import StudioInput from '@/components/shared/StudioInput';
import StudioSelect from '@/components/shared/StudioSelect';
import StudioSlider from '@/components/shared/StudioSlider';
import { createPhotoEditorTask } from '@/app/_lib/apis/task.api';
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

const editTypes = [
  { value: 'background_removal', label: 'Background Removal' },
  { value: 'enhance_quality', label: 'Enhance Quality' },
  { value: 'color_correction', label: 'Color Correction' },
  { value: 'noise_reduction', label: 'Noise Reduction' },
  { value: 'artistic_filter', label: 'Artistic Filter' },
];

const filters = [
  { value: 'none', label: 'None' },
  { value: 'vintage', label: 'Vintage' },
  { value: 'sepia', label: 'Sepia' },
  { value: 'black_white', label: 'Black & White' },
  { value: 'warm', label: 'Warm' },
  { value: 'cool', label: 'Cool' },
  { value: 'dramatic', label: 'Dramatic' },
];

export default function PhotoEditorClient() {
  const { t } = useTranslation();
  const [sourceImage, setSourceImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [editType, setEditType] = useState('background_removal');
  const [enhanceQuality, setEnhanceQuality] = useState(true);
  const [applyFilter, setApplyFilter] = useState('none');
  const [brightness, setBrightness] = useState(1.0);
  const [contrast, setContrast] = useState(1.0);
  const [saturation, setSaturation] = useState(1.0);
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
        payload: 'Please upload an image to edit',
      });
      return;
    }
    dispatch({ type: 'SUBMIT_START' });

    const request = {
      editType,
      enhanceQuality,
      applyFilter,
      brightness,
      contrast,
      saturation,
    };

    try {
      const response = await createPhotoEditorTask(sourceImage, request);
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
            <h3 className="text-lg font-semibold text-white">
              Upload Image to Edit
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
                    Upload your photo to edit
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

        {/* Right Column: Edit Settings */}
        <StudioToolCard>
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Sliders size={20} />
              Edit Settings
            </h3>
            
            {/* Edit Type */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Edit Type</label>
              <StudioSelect
                value={editType}
                onChange={setEditType}
                options={editTypes}
              />
            </div>

            {/* Quality Enhancement */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
                <input
                  type="checkbox"
                  checked={enhanceQuality}
                  onChange={(e) => setEnhanceQuality(e.target.checked)}
                  className="rounded"
                />
                Enhance Quality
              </label>
            </div>

            {/* Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Apply Filter</label>
              <StudioSelect
                value={applyFilter}
                onChange={setApplyFilter}
                options={filters}
              />
            </div>

            {/* Adjustments */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-slate-300">Adjustments</h4>
              
              <div className="space-y-2">
                <label className="text-sm text-slate-400">Brightness: {brightness.toFixed(1)}</label>
                <StudioSlider
                  min={0.5}
                  max={2.0}
                  step={0.1}
                  value={brightness}
                  onChange={setBrightness}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-slate-400">Contrast: {contrast.toFixed(1)}</label>
                <StudioSlider
                  min={0.5}
                  max={2.0}
                  step={0.1}
                  value={contrast}
                  onChange={setContrast}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-slate-400">Saturation: {saturation.toFixed(1)}</label>
                <StudioSlider
                  min={0.0}
                  max={2.0}
                  step={0.1}
                  value={saturation}
                  onChange={setSaturation}
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
          icon={<ImageIcon size={18} />}
          size="lg"
          className="w-full max-w-md"
        >
          {state.isLoading ? 'Processing...' : 'Edit Photo'}
        </StudioButton>
      </div>

      {/* Success Display */}
      {state.result && state.result.data && (
        <StudioToolCard className="border-butter-yellow/30 bg-butter-yellow/5">
          <div className="text-center">
            <div className="mb-4 flex justify-center">
              <div className="rounded-full bg-butter-yellow/20 p-3">
                <ImageIcon className="h-6 w-6 text-butter-yellow" />
              </div>
            </div>
            <h4 className="mb-2 text-lg font-semibold text-white">
              Photo Edit Started!
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
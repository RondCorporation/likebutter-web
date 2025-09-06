'use client';

import { useReducer, useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import {
  Heart,
  UploadCloud,
  X,
  Sparkles,
  Users,
  Lightbulb,
  Music,
} from 'lucide-react';
import StudioToolCard from '@/components/shared/StudioToolCard';
import StudioButton from '@/components/shared/StudioButton';
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

const studioStyles = [
  { value: 'concert_hall', label: 'Concert Hall' },
  { value: 'intimate_cafe', label: 'Intimate Cafe' },
  { value: 'outdoor_stage', label: 'Outdoor Stage' },
  { value: 'recording_studio', label: 'Recording Studio' },
  { value: 'cozy_living_room', label: 'Cozy Living Room' },
  { value: 'rooftop_terrace', label: 'Rooftop Terrace' },
];

const lightingModes = [
  { value: 'stage_lights', label: 'Stage Lights' },
  { value: 'soft_ambient', label: 'Soft Ambient' },
  { value: 'neon_glow', label: 'Neon Glow' },
  { value: 'natural_daylight', label: 'Natural Daylight' },
  { value: 'warm_golden_hour', label: 'Warm Golden Hour' },
  { value: 'dramatic_spotlights', label: 'Dramatic Spotlights' },
];

const backgroundMusic = [
  { value: 'ballad', label: 'Ballad' },
  { value: 'upbeat_pop', label: 'Upbeat Pop' },
  { value: 'acoustic', label: 'Acoustic' },
  { value: 'jazz', label: 'Jazz' },
  { value: 'r_and_b', label: 'R&B' },
  { value: 'rock', label: 'Rock' },
];

export default function FanmeetingStudioClient() {
  const { t } = useTranslation();
  const [fanImage, setFanImage] = useState<File | null>(null);
  const [idolImage, setIdolImage] = useState<File | null>(null);
  const [fanPreviewUrl, setFanPreviewUrl] = useState<string | null>(null);
  const [idolPreviewUrl, setIdolPreviewUrl] = useState<string | null>(null);
  const [studioStyle, setStudioStyle] = useState('concert_hall');
  const [lightingMode, setLightingMode] = useState('stage_lights');
  const [backgroundMusicType, setBackgroundMusicType] = useState('ballad');
  const [state, dispatch] = useReducer(apiSubmitReducer, initialState);

  useEffect(() => {
    return () => {
      if (fanPreviewUrl) URL.revokeObjectURL(fanPreviewUrl);
      if (idolPreviewUrl) URL.revokeObjectURL(idolPreviewUrl);
    };
  }, [fanPreviewUrl, idolPreviewUrl]);

  const handleFanImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (fanPreviewUrl) URL.revokeObjectURL(fanPreviewUrl);

    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        dispatch({
          type: 'SUBMIT_ERROR',
          payload: 'Image size must be less than 5MB',
        });
        return;
      }
      setFanImage(file);
      setFanPreviewUrl(URL.createObjectURL(file));
      dispatch({ type: 'RESET' });
    }
  };

  const handleIdolImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (idolPreviewUrl) URL.revokeObjectURL(idolPreviewUrl);

    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        dispatch({
          type: 'SUBMIT_ERROR',
          payload: 'Image size must be less than 5MB',
        });
        return;
      }
      setIdolImage(file);
      setIdolPreviewUrl(URL.createObjectURL(file));
      dispatch({ type: 'RESET' });
    }
  };

  const handleRemoveFanImage = () => {
    setFanImage(null);
    if (fanPreviewUrl) {
      URL.revokeObjectURL(fanPreviewUrl);
      setFanPreviewUrl(null);
    }
  };

  const handleRemoveIdolImage = () => {
    setIdolImage(null);
    if (idolPreviewUrl) {
      URL.revokeObjectURL(idolPreviewUrl);
      setIdolPreviewUrl(null);
    }
  };

  const handleSubmit = async () => {
    if (!fanImage || !idolImage) {
      dispatch({
        type: 'SUBMIT_ERROR',
        payload: 'Please upload both fan and idol images',
      });
      return;
    }
    dispatch({ type: 'SUBMIT_START' });

    // TODO: Replace with actual API call when endpoint is available
    setTimeout(() => {
      dispatch({
        type: 'SUBMIT_ERROR',
        payload: 'Fanmeeting Studio API endpoint is not yet available. Coming soon!',
      });
    }, 2000);
  };

  const isGenerationDisabled = state.isLoading || !fanImage || !idolImage;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Left Column: Image Uploads */}
        <div className="space-y-6">
          {/* Fan Image Upload */}
          <StudioToolCard>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Users size={20} />
                Upload Fan Image
              </h3>
              <div
                className="relative flex h-48 w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-600 bg-slate-900/50 text-center transition-all duration-300 hover:border-butter-yellow/50 hover:bg-slate-800/50"
                onClick={() => document.getElementById('fan-upload')?.click()}
              >
                {fanPreviewUrl ? (
                  <>
                    <Image
                      src={fanPreviewUrl}
                      alt="Fan preview"
                      layout="fill"
                      objectFit="contain"
                      className="rounded-xl p-2"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveFanImage();
                      }}
                      className="absolute -right-2 -top-2 rounded-full bg-red-500 p-2 text-white shadow-lg transition-all duration-300 hover:scale-110 hover:bg-red-600"
                    >
                      <X size={16} />
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col items-center text-slate-400">
                    <UploadCloud className="mb-3 h-10 w-10 text-butter-yellow/70" />
                    <p className="mb-1 font-semibold text-slate-200">Upload Fan Photo</p>
                    <p className="text-xs text-slate-500">PNG, JPG, WEBP up to 5MB</p>
                  </div>
                )}
                <input
                  id="fan-upload"
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleFanImageChange}
                  className="hidden"
                />
              </div>
            </div>
          </StudioToolCard>

          {/* Idol Image Upload */}
          <StudioToolCard>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Heart size={20} />
                Upload Idol Image
              </h3>
              <div
                className="relative flex h-48 w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-600 bg-slate-900/50 text-center transition-all duration-300 hover:border-butter-yellow/50 hover:bg-slate-800/50"
                onClick={() => document.getElementById('idol-upload')?.click()}
              >
                {idolPreviewUrl ? (
                  <>
                    <Image
                      src={idolPreviewUrl}
                      alt="Idol preview"
                      layout="fill"
                      objectFit="contain"
                      className="rounded-xl p-2"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveIdolImage();
                      }}
                      className="absolute -right-2 -top-2 rounded-full bg-red-500 p-2 text-white shadow-lg transition-all duration-300 hover:scale-110 hover:bg-red-600"
                    >
                      <X size={16} />
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col items-center text-slate-400">
                    <UploadCloud className="mb-3 h-10 w-10 text-butter-yellow/70" />
                    <p className="mb-1 font-semibold text-slate-200">Upload Idol Photo</p>
                    <p className="text-xs text-slate-500">PNG, JPG, WEBP up to 5MB</p>
                  </div>
                )}
                <input
                  id="idol-upload"
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleIdolImageChange}
                  className="hidden"
                />
              </div>
            </div>
          </StudioToolCard>
        </div>

        {/* Right Column: Studio Settings */}
        <StudioToolCard>
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Sparkles size={20} />
              Studio Settings
            </h3>
            
            {/* Studio Style */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <Heart size={16} />
                Studio Style
              </label>
              <StudioSelect
                value={studioStyle}
                onChange={setStudioStyle}
                options={studioStyles}
              />
            </div>

            {/* Lighting Mode */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <Lightbulb size={16} />
                Lighting Mode
              </label>
              <StudioSelect
                value={lightingMode}
                onChange={setLightingMode}
                options={lightingModes}
              />
            </div>

            {/* Background Music */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <Music size={16} />
                Background Music
              </label>
              <StudioSelect
                value={backgroundMusicType}
                onChange={setBackgroundMusicType}
                options={backgroundMusic}
              />
            </div>

            {/* Description */}
            <div className="rounded-lg bg-slate-800/50 p-4">
              <div className="flex items-start gap-3">
                <Heart className="h-5 w-5 text-butter-yellow/70 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-medium text-slate-200 mb-1">About Fanmeeting Studio</h4>
                  <p className="text-xs text-slate-400">
                    Create magical fanmeeting moments! Upload photos of both the fan and idol, 
                    then choose your perfect studio setting, lighting, and music to create a 
                    personalized fanmeeting experience.
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
          icon={<Heart size={18} />}
          size="lg"
          className="w-full max-w-md"
        >
          {state.isLoading ? 'Creating Fanmeeting...' : 'Create Fanmeeting'}
        </StudioButton>
      </div>

      {/* Coming Soon Notice */}
      <StudioToolCard className="border-butter-yellow/30 bg-butter-yellow/5">
        <div className="text-center">
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-butter-yellow/20 p-3">
              <Heart className="h-6 w-6 text-butter-yellow" />
            </div>
          </div>
          <h4 className="mb-2 text-lg font-semibold text-white">
            Coming Soon!
          </h4>
          <p className="text-slate-300">
            Fanmeeting Studio feature is currently in development. Get ready for amazing fan interactions!
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
'use client';

import { useReducer, useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  LoaderCircle,
  UploadCloud,
  X,
  Music,
} from 'lucide-react';
import {
  createButterCoverTask,
  ButterCoverRequest,
} from '@/app/_lib/apis/task.api';
import { ApiResponse } from '@/app/_types/api';
import CustomSelect from '@/app/_components/shared/CustomSelect';

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

const voiceModels = [
  { value: 'Jungkook', labelKey: 'jungkook' },
  { value: 'IU', labelKey: 'iu' },
  { value: 'NewJeans', labelKey: 'newjeans' },
];

export default function ButterCoverClient({ dictionary }: { dictionary: any }) {
  const [state, dispatch] = useReducer(apiSubmitReducer, initialState);

  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [voiceModel, setVoiceModel] = useState<string>(voiceModels[0].value);
  const [pitchChange, setPitchChange] = useState<number>(0);
  const [useUvr, setUseUvr] = useState<boolean>(true);
  const [outputFormat, setOutputFormat] = useState<string>('mp3');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // 20MB limit
      if (file.size > 20 * 1024 * 1024) {
        dispatch({
          type: 'SUBMIT_ERROR',
          payload: 'Audio file size must be less than 20MB',
        });
        return;
      }
      setAudioFile(file);
      dispatch({ type: 'RESET' });
    }
  };

  const handleRemoveFile = () => {
    setAudioFile(null);
  };

  const handleSubmit = async () => {
    if (!audioFile || !voiceModel) {
      dispatch({
        type: 'SUBMIT_ERROR',
        payload: 'Please upload an audio file and select a voice model.',
      });
      return;
    }
    dispatch({ type: 'SUBMIT_START' });

    const request: ButterCoverRequest = {
      voiceModel,
      pitchChange,
      useUvr,
      outputFormat,
    };

    try {
      const response = await createButterCoverTask(audioFile, request);
      dispatch({ type: 'SUBMIT_SUCCESS', payload: response });
    } catch (e: any) {
      dispatch({
        type: 'SUBMIT_ERROR',
        payload: e.message || 'An unknown error occurred.',
      });
    }
  };

  const isGenerationDisabled = state.isLoading || !audioFile || !voiceModel;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Left Column: Audio Upload */}
        <div>
          <label className="mb-3 block text-lg font-medium text-slate-200">
            {dictionary.butterCoverStep2}
          </label>
          <div
            className="relative flex h-60 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-600 bg-slate-800/50 text-center transition-colors hover:border-accent"
            onClick={() => document.getElementById('audio-upload')?.click()}
          >
            {audioFile ? (
              <div className="flex flex-col items-center text-slate-300">
                <Music className="mb-3 h-10 w-10 text-accent" />
                <p className="font-semibold">{audioFile.name}</p>
                <p className="text-xs text-slate-500">
                  {(audioFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveFile();
                  }}
                  className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white shadow-lg transition-transform hover:scale-110"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center text-slate-400">
                <UploadCloud className="mb-3 h-10 w-10" />
                <p className="mb-1 font-semibold text-slate-300">
                  {dictionary.butterCoverUploadPlaceholder}
                </p>
                <p className="text-xs text-slate-500">MP3, WAV, FLAC up to 20MB</p>
              </div>
            )}
            <input
              id="audio-upload"
              type="file"
              accept="audio/mpeg,audio/wav,audio/flac"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        </div>

        {/* Right Column: Settings */}
        <div className="space-y-6">
          <div>
            <label
              htmlFor="voice-model"
              className="mb-2 block text-lg font-medium text-slate-200"
            >
              {dictionary.butterCoverStep1}
            </label>
            <CustomSelect
              value={voiceModel}
              onChange={(value) => setVoiceModel(value)}
              options={voiceModels.map((model) => ({
                value: model.value,
                label: dictionary.voiceModel[model.labelKey],
              }))}
            />
          </div>

          <div>
            <label htmlFor="pitch-change" className="mb-2 block font-medium text-slate-300">
              Pitch Change: {pitchChange} semitones
            </label>
            <input
              id="pitch-change"
              type="range"
              min="-12"
              max="12"
              step="1"
              value={pitchChange}
              onChange={(e) => setPitchChange(parseInt(e.target.value, 10))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-accent"
            />
          </div>

          <div className="flex items-center justify-between">
            <label htmlFor="use-uvr" className="font-medium text-slate-300">
              Separate Vocals (UVR)
            </label>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                id="use-uvr"
                type="checkbox"
                checked={useUvr}
                onChange={(e) => setUseUvr(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
            </label>
          </div>
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
        {state.isLoading ? dictionary.butterGenButtonLoading : dictionary.butterCoverButton}
      </button>

      {/* Result/Error Display */}
      <div className="mt-6 text-center text-sm">
        {state.error && <p className="text-red-400">{state.error}</p>}
        {state.result && state.result.data && (
          <div className="rounded-md border border-green-500/30 bg-green-500/10 p-4 text-green-300">
            <p className="font-semibold">{dictionary.butterGenSuccessTitle}</p>
            <p>
              {dictionary.butterGenSuccessTaskId} {state.result.data.taskId} |{' '}
              {dictionary.butterGenSuccessStatus} {state.result.data.status}
            </p>
            <Link
              href="/studio/history"
              className="mt-2 inline-block text-accent underline"
            >
              {dictionary.butterGenSuccessLink}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
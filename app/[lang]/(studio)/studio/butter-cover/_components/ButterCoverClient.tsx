'use client';

import { useReducer, useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  LoaderCircle,
  UploadCloud,
  X,
  Music,
  Settings,
  ChevronDown,
  ChevronUp,
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

  // Basic settings
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [voiceModel, setVoiceModel] = useState<string>(voiceModels[0].value);
  const [pitchAdjust, setPitchAdjust] = useState<number>(0);
  const [separatorModel, setSeparatorModel] = useState<string>('');
  const [outputFormat, setOutputFormat] = useState<string>('mp3');
  const [saveIntermediate, setSaveIntermediate] = useState<boolean>(false);

  // Advanced settings
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [indexRate, setIndexRate] = useState<number>(0.75);
  const [filterRadius, setFilterRadius] = useState<number>(3);
  const [rmsMixRate, setRmsMixRate] = useState<number>(0.25);
  const [protect, setProtect] = useState<number>(0.33);
  const [f0Method, setF0Method] = useState<string>('rmvpe');
  const [crepeHopLength, setCrepeHopLength] = useState<number>(128);

  // Reverb settings
  const [reverbRmSize, setReverbRmSize] = useState<number>(0.15);
  const [reverbWet, setReverbWet] = useState<number>(0.2);
  const [reverbDry, setReverbDry] = useState<number>(0.8);
  const [reverbDamping, setReverbDamping] = useState<number>(0.7);

  // Gain settings
  const [mainGain, setMainGain] = useState<number>(0);
  const [instGain, setInstGain] = useState<number>(0);
  const [pitchChangeAll, setPitchChangeAll] = useState<number>(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // 50MB limit per API specification
      if (file.size > 50 * 1024 * 1024) {
        dispatch({
          type: 'SUBMIT_ERROR',
          payload: 'Audio file exceeds maximum size limit (50MB)',
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
      pitchAdjust,
      separatorModel: separatorModel || undefined,
      outputFormat,
      saveIntermediate,
      // Advanced parameters - only include if different from defaults
      ...(indexRate !== 0.75 && { indexRate }),
      ...(filterRadius !== 3 && { filterRadius }),
      ...(rmsMixRate !== 0.25 && { rmsMixRate }),
      ...(protect !== 0.33 && { protect }),
      ...(f0Method !== 'rmvpe' && { f0Method }),
      ...(crepeHopLength !== 128 && { crepeHopLength }),
      // Reverb parameters
      ...(reverbRmSize !== 0.15 && { reverbRmSize }),
      ...(reverbWet !== 0.2 && { reverbWet }),
      ...(reverbDry !== 0.8 && { reverbDry }),
      ...(reverbDamping !== 0.7 && { reverbDamping }),
      // Gain parameters
      ...(mainGain !== 0 && { mainGain }),
      ...(instGain !== 0 && { instGain }),
      ...(pitchChangeAll !== 0 && { pitchChangeAll }),
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
                <p className="text-xs text-slate-500">
                  MP3, WAV, M4A, FLAC up to 50MB
                </p>
              </div>
            )}
            <input
              id="audio-upload"
              type="file"
              accept="audio/mpeg,audio/wav,audio/m4a,audio/flac"
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
            <label
              htmlFor="pitch-adjust"
              className="mb-2 block font-medium text-slate-300"
            >
              Pitch Adjust: {pitchAdjust} semitones
            </label>
            <input
              id="pitch-adjust"
              type="range"
              min="-12"
              max="12"
              step="1"
              value={pitchAdjust}
              onChange={(e) => setPitchAdjust(parseInt(e.target.value, 10))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-accent"
            />
          </div>

          <div>
            <label
              htmlFor="output-format"
              className="mb-2 block font-medium text-slate-300"
            >
              Output Format
            </label>
            <CustomSelect
              value={outputFormat}
              onChange={(value) => setOutputFormat(value)}
              options={[
                { value: 'mp3', label: 'MP3' },
                { value: 'wav', label: 'WAV' },
              ]}
            />
          </div>

          <div className="flex items-center justify-between">
            <label
              htmlFor="save-intermediate"
              className="font-medium text-slate-300"
            >
              Save Intermediate Files
            </label>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                id="save-intermediate"
                type="checkbox"
                checked={saveIntermediate}
                onChange={(e) => setSaveIntermediate(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Advanced Settings */}
      <div className="border-t border-slate-700 pt-6">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex w-full items-center justify-between text-left text-lg font-medium text-slate-200 hover:text-accent transition-colors"
        >
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Advanced Settings
          </div>
          {showAdvanced ? (
            <ChevronUp className="h-5 w-5" />
          ) : (
            <ChevronDown className="h-5 w-5" />
          )}
        </button>

        {showAdvanced && (
          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* AI Cover Generation Parameters */}
            <div className="space-y-4">
              <h4 className="font-medium text-slate-300">
                AI Cover Parameters
              </h4>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-400">
                  Index Rate: {indexRate.toFixed(2)}
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={indexRate}
                  onChange={(e) => setIndexRate(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-accent"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-400">
                  Filter Radius: {filterRadius}
                </label>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="1"
                  value={filterRadius}
                  onChange={(e) => setFilterRadius(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-accent"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-400">
                  RMS Mix Rate: {rmsMixRate.toFixed(2)}
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={rmsMixRate}
                  onChange={(e) => setRmsMixRate(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-accent"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-400">
                  Protect: {protect.toFixed(2)}
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={protect}
                  onChange={(e) => setProtect(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-accent"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-400">
                  F0 Method
                </label>
                <CustomSelect
                  value={f0Method}
                  onChange={(value) => setF0Method(value)}
                  options={[
                    { value: 'rmvpe', label: 'RMVPE' },
                    { value: 'harvest', label: 'Harvest' },
                    { value: 'crepe', label: 'CREPE' },
                  ]}
                />
              </div>

              {f0Method === 'crepe' && (
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-400">
                    CREPE Hop Length: {crepeHopLength}
                  </label>
                  <input
                    type="range"
                    min="64"
                    max="512"
                    step="64"
                    value={crepeHopLength}
                    onChange={(e) =>
                      setCrepeHopLength(parseInt(e.target.value))
                    }
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-accent"
                  />
                </div>
              )}
            </div>

            {/* Reverb Parameters */}
            <div className="space-y-4">
              <h4 className="font-medium text-slate-300">Reverb Settings</h4>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-400">
                  Room Size: {reverbRmSize.toFixed(2)}
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={reverbRmSize}
                  onChange={(e) => setReverbRmSize(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-accent"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-400">
                  Wet Level: {reverbWet.toFixed(2)}
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={reverbWet}
                  onChange={(e) => setReverbWet(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-accent"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-400">
                  Dry Level: {reverbDry.toFixed(2)}
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={reverbDry}
                  onChange={(e) => setReverbDry(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-accent"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-400">
                  Damping: {reverbDamping.toFixed(2)}
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={reverbDamping}
                  onChange={(e) => setReverbDamping(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-accent"
                />
              </div>
            </div>

            {/* Gain Parameters */}
            <div className="space-y-4">
              <h4 className="font-medium text-slate-300">Gain Settings</h4>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-400">
                  Main Vocal Gain: {mainGain}dB
                </label>
                <input
                  type="range"
                  min="-20"
                  max="20"
                  step="1"
                  value={mainGain}
                  onChange={(e) => setMainGain(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-accent"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-400">
                  Instrumental Gain: {instGain}dB
                </label>
                <input
                  type="range"
                  min="-20"
                  max="20"
                  step="1"
                  value={instGain}
                  onChange={(e) => setInstGain(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-accent"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-400">
                  Overall Pitch Change: {pitchChangeAll} semitones
                </label>
                <input
                  type="range"
                  min="-12"
                  max="12"
                  step="1"
                  value={pitchChangeAll}
                  onChange={(e) => setPitchChangeAll(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-accent"
                />
              </div>

              <div>
                <label
                  htmlFor="separator-model"
                  className="mb-2 block text-sm font-medium text-slate-400"
                >
                  Separator Model (Optional)
                </label>
                <input
                  id="separator-model"
                  type="text"
                  value={separatorModel}
                  onChange={(e) => setSeparatorModel(e.target.value)}
                  placeholder="e.g., UVR-MDX-NET-Voc_FT"
                  className="w-full rounded-md border border-slate-600 bg-slate-800 px-3 py-2 text-slate-300 placeholder-slate-500 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>
            </div>
          </div>
        )}
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
        {state.isLoading
          ? dictionary.butterGenButtonLoading
          : dictionary.butterCoverButton}
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

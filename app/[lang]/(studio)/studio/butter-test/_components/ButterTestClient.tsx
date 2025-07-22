'use client';

import { useReducer, useState } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { Sparkles, LoaderCircle, TestTube } from 'lucide-react';
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

export default function ButterTestClient() {
  const { t } = useTranslation();
  const [prompt, setPrompt] = useState('');
  const [state, dispatch] = useReducer(apiSubmitReducer, initialState);

  const handleSubmit = async () => {
    if (!prompt) {
      dispatch({
        type: 'SUBMIT_ERROR',
        payload: t('butterTestErrorPrompt'),
      });
      return;
    }
    dispatch({ type: 'SUBMIT_START' });

    try {
      const response = await apiFetch<TaskResponse>('/tasks/butter-test', {
        method: 'POST',
        body: { prompt },
      });
      dispatch({ type: 'SUBMIT_SUCCESS', payload: response });
    } catch (e: any) {
      dispatch({
        type: 'SUBMIT_ERROR',
        payload: e.message,
      });
    }
  };

  const isGenerationDisabled = state.isLoading || !prompt;

  return (
    <>
      <div className="mb-6">
        <label
          htmlFor="art-prompt"
          className="mb-3 block text-lg font-medium text-slate-200"
        >
          {t('butterTestStep1')}
        </label>
        <textarea
          id="art-prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={t('butterTestPromptPlaceholder')}
          rows={4}
          className="w-full rounded-md border border-white/10 bg-white/5 p-3 text-sm text-white placeholder-slate-500 focus:border-accent focus:ring-0"
        />
      </div>

      <button
        disabled={isGenerationDisabled}
        onClick={handleSubmit}
        className="flex w-full items-center justify-center gap-2 rounded-md bg-accent py-3 text-base font-medium text-black transition hover:brightness-90 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
      >
        {state.isLoading ? (
          <LoaderCircle size={18} className="animate-spin" />
        ) : (
          <TestTube size={18} />
        )}
        {state.isLoading ? t('butterTestButtonLoading') : t('butterTestButton')}
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

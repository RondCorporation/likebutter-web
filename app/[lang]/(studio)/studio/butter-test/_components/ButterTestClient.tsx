'use client';

import { useReducer, useState } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { Sparkles, TestTube } from 'lucide-react';
import StudioToolCard from '@/components/shared/StudioToolCard';
import StudioButton from '@/components/shared/StudioButton';
import StudioInput from '@/components/shared/StudioInput';
import { createButterTestTask } from '@/app/_lib/apis/task.api';
import { ApiResponse } from '@/app/_types/api';

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
      const response = await createButterTestTask(prompt);
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
    <div className="space-y-8">
      <StudioToolCard>
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="rounded-full bg-butter-yellow/20 p-2">
              <TestTube className="h-5 w-5 text-butter-yellow" />
            </div>
            <h3 className="text-lg font-semibold text-white">
              {t('butterTestStep1')}
            </h3>
          </div>
          <StudioInput
            variant="textarea"
            value={prompt}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setPrompt(e.target.value)}
            placeholder={t('butterTestPromptPlaceholder')}
            rows={6}
            className="resize-none"
            error={state.error || undefined}
          />
        </div>
      </StudioToolCard>

      <div className="flex justify-center">
        <StudioButton
          onClick={handleSubmit}
          disabled={isGenerationDisabled}
          loading={state.isLoading}
          icon={<TestTube size={18} />}
          size="lg"
          className="w-full max-w-md"
        >
          {state.isLoading ? t('butterTestButtonLoading') : t('butterTestButton')}
        </StudioButton>
      </div>

      {state.result && state.result.data && (
        <StudioToolCard className="border-butter-yellow/30 bg-butter-yellow/5">
          <div className="text-center">
            <div className="mb-4 flex justify-center">
              <div className="rounded-full bg-butter-yellow/20 p-3">
                <TestTube className="h-6 w-6 text-butter-yellow" />
              </div>
            </div>
            <h4 className="mb-2 text-lg font-semibold text-white">
              {t('butterGenSuccessTitle')}
            </h4>
            <p className="mb-4 text-slate-300">
              {t('butterGenSuccessTaskId')} {state.result.data.taskId} • {' '}
              {t('butterGenSuccessStatus')} {state.result.data.status}
            </p>
            <Link href="/studio/history">
              <StudioButton variant="secondary" size="sm">
                {t('butterGenSuccessLink')}
              </StudioButton>
            </Link>
          </div>
        </StudioToolCard>
      )}
    </div>
  );
}

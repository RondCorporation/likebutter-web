import { apiFetch } from '../apiClient';
import { ApiResponse } from '@/app/_types/api';
import {
  Page,
  Task,
  TaskImageUrlResponse,
  TaskStatusResponse,
} from '@/types/task';

interface TaskCreationResponse {
  taskId: number;
  status: string;
}

export const getTaskHistory = (
  page: number,
  filters: { status?: string; actionType?: string; size?: number; summary?: boolean }
): Promise<ApiResponse<Page<Task>>> => {
  const params = new URLSearchParams({
    page: page.toString(),
    size: (filters.size || 10).toString(),
    sort: 'createdAt,desc',
    summary: (filters.summary || false).toString(),
  });
  if (filters.status) params.append('status', filters.status);
  if (filters.actionType) params.append('actionType', filters.actionType);

  return apiFetch<Page<Task>>(`/tasks/me?${params.toString()}`);
};

export const getTaskStatus = (
  taskId: number
): Promise<ApiResponse<TaskStatusResponse>> => {
  return apiFetch<TaskStatusResponse>(`/tasks/me/${taskId}`);
};

export const getBatchTaskStatus = (
  taskIds: number[]
): Promise<ApiResponse<TaskStatusResponse[]>> => {
  return apiFetch<TaskStatusResponse[]>('/tasks/batch/status', {
    method: 'POST',
    body: { taskIds },
  });
};

// Digital Goods task creation
export interface DigitalGoodsRequest {
  style: string;
  customPrompt?: string;
  title?: string;
  subtitle?: string;
  accentColor?: string;
  productName?: string;
  brandName?: string;
}

export const createDigitalGoodsTask = (
  image: File,
  request: DigitalGoodsRequest
): Promise<ApiResponse<TaskCreationResponse>> => {
  const formData = new FormData();
  formData.append('image', image);
  
  // Add form fields individually
  Object.entries(request).forEach(([key, value]) => {
    if (value !== undefined) {
      formData.append(key, value);
    }
  });

  return apiFetch<TaskCreationResponse>('/tasks/digital-goods', {
    method: 'POST',
    body: formData,
  });
};

// Photo Editor task creation (replacing Butter Gen functionality)
export interface PhotoEditorRequest {
  editType: string;
  enhanceQuality: boolean;
  applyFilter: string;
  brightness: number;
  contrast: number;
  saturation: number;
}

export const createPhotoEditorTask = (
  image: File,
  request: PhotoEditorRequest
): Promise<ApiResponse<TaskCreationResponse>> => {
  const formData = new FormData();
  formData.append('image', image);
  formData.append(
    'request',
    new Blob([JSON.stringify(request)], { type: 'application/json' })
  );

  return apiFetch<TaskCreationResponse>('/tasks/photo-editor', {
    method: 'POST',
    body: formData,
  });
};

export interface ButterCoverRequest {
  voiceModel: string;
  pitchAdjust?: number;
  separatorModel?: string;
  outputFormat?: string;
  saveIntermediate?: boolean;
  // Advanced AI Cover parameters
  indexRate?: number;
  filterRadius?: number;
  rmsMixRate?: number;
  protect?: number;
  f0Method?: string;
  crepeHopLength?: number;
  // Reverb parameters
  reverbRmSize?: number;
  reverbWet?: number;
  reverbDry?: number;
  reverbDamping?: number;
  // Gain parameters
  mainGain?: number;
  instGain?: number;
  pitchChangeAll?: number;
}

export const createButterCoverTask = (
  audio: File,
  request: ButterCoverRequest
): Promise<ApiResponse<TaskCreationResponse>> => {
  const formData = new FormData();
  formData.append('audio', audio);
  formData.append(
    'request',
    new Blob([JSON.stringify(request)], { type: 'application/json' })
  );

  return apiFetch<TaskCreationResponse>('/tasks/butter-cover', {
    method: 'POST',
    body: formData,
  });
};

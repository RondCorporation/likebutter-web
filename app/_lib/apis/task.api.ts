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
  filters: {
    status?: string;
    actionType?: string;
    size?: number;
    summary?: boolean;
  }
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

// API response format for batch tasks (uses 'id' instead of 'taskId')
export interface BatchTaskResponse {
  id: number;
  accountId: number;
  actionType: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  details: any;
}

export const getBatchTaskStatus = (
  taskIds: number[]
): Promise<ApiResponse<BatchTaskResponse[]>> => {
  const params = new URLSearchParams({
    ids: taskIds.join(','),
    summary: 'false',
  });
  return apiFetch<BatchTaskResponse[]>(`/tasks/batch?${params.toString()}`);
};

// Digital Goods style enum values
export const DIGITAL_GOODS_STYLES = {
  POSTER: 'POSTER',
  STICKER: 'STICKER',
  GHIBLI: 'GHIBLI',
  FIGURE: 'FIGURE',
  CARTOON: 'CARTOON',
} as const;

export type DigitalGoodsStyle =
  (typeof DIGITAL_GOODS_STYLES)[keyof typeof DIGITAL_GOODS_STYLES];

// Digital Goods task creation
export interface DigitalGoodsRequest {
  style: DigitalGoodsStyle;
  customPrompt?: string;
  title?: string;
  subtitle?: string;
  accentColor?: string;
  productName?: string;
  brandName?: string;
}

export const createDigitalGoodsTask = (
  request: DigitalGoodsRequest,
  image?: File
): Promise<ApiResponse<TaskCreationResponse>> => {
  const formData = new FormData();

  // Add image if provided
  if (image) {
    formData.append('image', image);
  }

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

// Stylist task creation
export interface StylistRequest {
  prompt: string;
  hairStyleImage?: File;
  outfitImage?: File;
  backgroundImage?: File;
  accessoryImage?: File;
  moodImage?: File;
  customPrompt?: string;
}

export const createStylistTask = (
  idolImage: File,
  request: StylistRequest
): Promise<ApiResponse<TaskCreationResponse>> => {
  const formData = new FormData();

  // Add required idol image
  formData.append('idolImage', idolImage);

  // Add required prompt
  formData.append('prompt', request.prompt);

  // Add optional style images
  if (request.hairStyleImage) {
    formData.append('hairStyleImage', request.hairStyleImage);
  }
  if (request.outfitImage) {
    formData.append('outfitImage', request.outfitImage);
  }
  if (request.backgroundImage) {
    formData.append('backgroundImage', request.backgroundImage);
  }
  if (request.accessoryImage) {
    formData.append('accessoryImage', request.accessoryImage);
  }
  if (request.moodImage) {
    formData.append('moodImage', request.moodImage);
  }

  // Add optional custom prompt
  if (request.customPrompt) {
    formData.append('customPrompt', request.customPrompt);
  }

  return apiFetch<TaskCreationResponse>('/tasks/stylist', {
    method: 'POST',
    body: formData,
  });
};

// Virtual Casting task creation
export interface VirtualCastingRequest {
  keyword: string;
  customPrompt?: string;
}

export const createVirtualCastingTask = (
  idolImage: File,
  request: VirtualCastingRequest
): Promise<ApiResponse<TaskCreationResponse>> => {
  const formData = new FormData();

  // Add required files and data
  formData.append('idolImage', idolImage);
  formData.append('keyword', request.keyword);

  // Add optional custom prompt
  if (request.customPrompt) {
    formData.append('customPrompt', request.customPrompt);
  }

  return apiFetch<TaskCreationResponse>('/tasks/virtual-casting', {
    method: 'POST',
    body: formData,
  });
};

// Fanmeeting Studio task creation
export interface FanmeetingStudioRequest {
  situationPrompt: string;
  backgroundPrompt: string;
  customPrompt?: string;
}

export const createFanmeetingStudioTask = (
  fanImage: File,
  idolImage: File,
  request: FanmeetingStudioRequest
): Promise<ApiResponse<TaskCreationResponse>> => {
  const formData = new FormData();

  // Add required images
  formData.append('fanImage', fanImage);
  formData.append('idolImage', idolImage);

  // Add required prompts
  formData.append('situationPrompt', request.situationPrompt);
  formData.append('backgroundPrompt', request.backgroundPrompt);

  // Add optional custom prompt
  if (request.customPrompt) {
    formData.append('customPrompt', request.customPrompt);
  }

  return apiFetch<TaskCreationResponse>('/tasks/fanmeeting-studio', {
    method: 'POST',
    body: formData,
  });
};

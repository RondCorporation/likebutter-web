import { apiFetch } from '../apiClient';
import { ApiResponse } from '@/app/_types/api';
import {
  Page,
  Task,
  TaskStatusResponse,
  EditTaskRequest,
  EditTaskResponse,
  TaskHistoryResponse,
  ActionType,
} from '@/types/task';

interface TaskCreationResponse {
  taskId: number;
  status: string;
}

export type TaskCategory = 'IMAGE' | 'AUDIO';

export interface TaskFilters {
  status?: string;
  actionType?: string;
  actionTypes?: string[];
  category?: TaskCategory;
  size?: number;
  summary?: boolean;
}

export const getTaskHistory = (
  page: number,
  filters: TaskFilters
): Promise<ApiResponse<Page<Task>>> => {
  const params = new URLSearchParams({
    page: page.toString(),
    size: (filters.size || 10).toString(),
    sort: 'createdAt,desc',
    summary: (filters.summary || false).toString(),
  });

  if (filters.status) params.append('status', filters.status);
  if (filters.actionType) params.append('actionType', filters.actionType);
  if (filters.actionTypes && filters.actionTypes.length > 0) {
    params.append('actionTypes', filters.actionTypes.join(','));
  }
  if (filters.category) params.append('category', filters.category);

  return apiFetch<Page<Task>>(`/tasks/me?${params.toString()}`);
};

export const getTaskStatus = (
  taskId: number
): Promise<ApiResponse<TaskStatusResponse>> => {
  return apiFetch<TaskStatusResponse>(`/tasks/me/${taskId}`);
};

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
    taskIds: taskIds.join(','),
    summary: 'false',
  });
  return apiFetch<BatchTaskResponse[]>(`/tasks/batch?${params.toString()}`);
};

export const DIGITAL_GOODS_STYLES = {
  GHIBLI: 'GHIBLI',
  PIXEL_ART: 'PIXEL_ART',
  ANIMATION: 'ANIMATION',
  CARTOON: 'CARTOON',
  SKETCH: 'SKETCH',
  GRADUATION_PHOTO: 'GRADUATION_PHOTO',
  LEGO: 'LEGO',
  STICKER: 'STICKER',
  FIGURE: 'FIGURE',
} as const;

export type DigitalGoodsStyle =
  (typeof DIGITAL_GOODS_STYLES)[keyof typeof DIGITAL_GOODS_STYLES];

export interface DigitalGoodsRequest {
  style: DigitalGoodsStyle;
}

export const createDigitalGoodsTask = (
  request: DigitalGoodsRequest,
  image?: File
): Promise<ApiResponse<TaskCreationResponse>> => {
  const formData = new FormData();

  if (image) {
    formData.append('image', image);
  }

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
  outputFormat?: string;
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

  formData.append('idolImage', idolImage);

  formData.append('prompt', request.prompt);

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

  if (request.customPrompt) {
    formData.append('customPrompt', request.customPrompt);
  }

  return apiFetch<TaskCreationResponse>('/tasks/stylist', {
    method: 'POST',
    body: formData,
  });
};

export const VIRTUAL_CASTING_STYLES = {
  FROZEN: 'FROZEN',
  SPONGEBOB: 'SPONGEBOB',
  ALADDIN: 'ALADDIN',
  INSIDE_OUT: 'INSIDE_OUT',
  TOY_STORY: 'TOY_STORY',
  MINIONS: 'MINIONS',
  ZOOTOPIA: 'ZOOTOPIA',

  TWILIGHT: 'TWILIGHT',
  STAR_WARS: 'STAR_WARS',
  LORD_OF_THE_RINGS: 'LORD_OF_THE_RINGS',
  HARRY_POTTER: 'HARRY_POTTER',
  AVENGERS: 'AVENGERS',
  OVERWATCH: 'OVERWATCH',

  TRUE_BEAUTY: 'TRUE_BEAUTY',
  LOOKISM: 'LOOKISM',
  KENGAN_ASHURA: 'KENGAN_ASHURA',
  ITAEWON_CLASS: 'ITAEWON_CLASS',
  SQUID_GAME: 'SQUID_GAME',
  VOLCANO_RETURNS: 'VOLCANO_RETURNS',

  CRAYON_SHIN_CHAN: 'CRAYON_SHIN_CHAN',
  FRIEREN: 'FRIEREN',
  MY_LOVE_MIX_UP: 'MY_LOVE_MIX_UP',
  NARUTO: 'NARUTO',

  KIMI_NI_TODOKE: 'KIMI_NI_TODOKE',
  DETECTIVE_CONAN: 'DETECTIVE_CONAN',
  NANA: 'NANA',
  YOUR_NAME: 'YOUR_NAME',
  DORAEMON: 'DORAEMON',
  SPY_FAMILY: 'SPY_FAMILY',
  SLAM_DUNK: 'SLAM_DUNK',
  OURAN_HIGH_SCHOOL: 'OURAN_HIGH_SCHOOL',
  JUJUTSU_KAISEN: 'JUJUTSU_KAISEN',
} as const;

export type VirtualCastingStyle =
  (typeof VIRTUAL_CASTING_STYLES)[keyof typeof VIRTUAL_CASTING_STYLES];

export interface VirtualCastingRequest {
  style: VirtualCastingStyle;
}

export const createVirtualCastingTask = (
  idolImage: File,
  request: VirtualCastingRequest
): Promise<ApiResponse<TaskCreationResponse>> => {
  const formData = new FormData();

  formData.append('idolImage', idolImage);
  formData.append('style', request.style);

  return apiFetch<TaskCreationResponse>('/tasks/virtual-casting', {
    method: 'POST',
    body: formData,
  });
};

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

  formData.append('fanImage', fanImage);
  formData.append('idolImage', idolImage);

  formData.append('situationPrompt', request.situationPrompt);
  formData.append('backgroundPrompt', request.backgroundPrompt);

  if (request.customPrompt) {
    formData.append('customPrompt', request.customPrompt);
  }

  return apiFetch<TaskCreationResponse>('/tasks/fanmeeting-studio', {
    method: 'POST',
    body: formData,
  });
};

export const deleteTask = (taskId: number): Promise<void> => {
  return apiFetch<void>(`/tasks/${taskId}`, {
    method: 'DELETE',
  }).then(() => {});
};

export interface BatchDeleteResponse {
  totalRequested: number;
  successfullyDeleted: number;
  failed: number;
  failedTaskIds: number[];
}

export const deleteBatchTasks = (
  taskIds: number[]
): Promise<ApiResponse<BatchDeleteResponse>> => {
  return apiFetch<BatchDeleteResponse>('/tasks', {
    method: 'DELETE',
    body: { taskIds },
  });
};

export const canEditTask = (
  taskId: number,
  actionType: ActionType
): Promise<ApiResponse<boolean>> => {
  const endpoint = getActionTypeEndpoint(actionType);
  return apiFetch<boolean>(`/tasks/${endpoint}/${taskId}/can-edit`);
};

export const editTask = (
  taskId: number,
  actionType: ActionType,
  editPrompt: string
): Promise<ApiResponse<EditTaskResponse>> => {
  const endpoint = getActionTypeEndpoint(actionType);
  const request: EditTaskRequest = {
    originalTaskId: taskId,
    editPrompt: editPrompt,
  };

  return apiFetch<EditTaskResponse>(`/tasks/${endpoint}/${taskId}/edit`, {
    method: 'POST',
    body: request,
  });
};

export const getTaskEditHistory = (
  taskId: number,
  actionType: ActionType
): Promise<ApiResponse<TaskHistoryResponse[]>> => {
  const endpoint = getActionTypeEndpoint(actionType);
  return apiFetch<TaskHistoryResponse[]>(
    `/tasks/${endpoint}/${taskId}/history`
  );
};

const getActionTypeEndpoint = (actionType: ActionType): string => {
  switch (actionType) {
    case 'DIGITAL_GOODS':
    case 'DIGITAL_GOODS_EDIT':
      return 'digital-goods';
    case 'FANMEETING_STUDIO':
    case 'FANMEETING_STUDIO_EDIT':
      return 'fanmeeting-studio';
    case 'STYLIST':
    case 'STYLIST_EDIT':
      return 'stylist';
    case 'VIRTUAL_CASTING':
    case 'VIRTUAL_CASTING_EDIT':
      return 'virtual-casting';
    default:
      throw new Error(`Edit not supported for action type: ${actionType}`);
  }
};

export const isEditableActionType = (actionType: ActionType): boolean => {
  return [
    'DIGITAL_GOODS',
    'FANMEETING_STUDIO',
    'STYLIST',
    'VIRTUAL_CASTING',
  ].includes(actionType);
};

export const isEditActionType = (actionType: ActionType): boolean => {
  return [
    'DIGITAL_GOODS_EDIT',
    'FANMEETING_STUDIO_EDIT',
    'STYLIST_EDIT',
    'VIRTUAL_CASTING_EDIT',
  ].includes(actionType);
};

export const getOriginalActionType = (
  editActionType: ActionType
): ActionType => {
  const mapping: { [key: string]: ActionType } = {
    DIGITAL_GOODS_EDIT: 'DIGITAL_GOODS',
    FANMEETING_STUDIO_EDIT: 'FANMEETING_STUDIO',
    STYLIST_EDIT: 'STYLIST',
    VIRTUAL_CASTING_EDIT: 'VIRTUAL_CASTING',
  };
  return mapping[editActionType] || editActionType;
};

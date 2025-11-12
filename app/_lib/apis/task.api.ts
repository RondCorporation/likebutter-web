import { apiFetch } from '../apiClient';
import { ApiResponse } from '@/app/_types/api';
import {
  Page,
  Task,
  EditTaskRequest,
  EditTaskResponse,
  TaskHistoryResponse,
  ActionType,
} from '@/types/task';

interface TaskCreationResponse {
  taskId: number;
  status: string;
  actionType: ActionType;
  createdAt: string;
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

export const getTaskHistory = async (
  page: number,
  filters: TaskFilters
): Promise<ApiResponse<Page<Task>>> => {
  const params = new URLSearchParams({
    page: page.toString(),
    size: (filters.size || 10).toString(),
    sort: 'createdAt,desc',
    summary: (filters.summary !== undefined
      ? filters.summary
      : false
    ).toString(),
  });

  if (filters.status) params.append('status', filters.status);
  if (filters.actionType) params.append('actionType', filters.actionType);
  if (filters.actionTypes && filters.actionTypes.length > 0) {
    params.append('actionTypes', filters.actionTypes.join(','));
  }
  if (filters.category) params.append('category', filters.category);

  return await apiFetch<Page<Task>>(`/api/v1/tasks?${params.toString()}`);
};

export const getTaskStatus = async (
  taskId: number
): Promise<ApiResponse<Task>> => {
  return await apiFetch<Task>(`/api/v1/tasks/${taskId}`);
};

export interface BatchTaskResponse {
  taskId: number;
  actionType: ActionType;
  status: string;
  createdAt: string;
  parentTaskId?: number | null;
  editSequence?: number | null;
  isOriginal?: boolean;
  isEditTask?: boolean;
  digitalGoods?: any;
  virtualCasting?: any;
  stylist?: any;
  fanmeetingStudio?: any;
  butterCover?: any;
  error?: string | null;
}

export const getBatchTaskStatus = async (
  taskIds: number[]
): Promise<ApiResponse<Task[]>> => {
  const params = new URLSearchParams({
    taskIds: taskIds.join(','),
  });

  return await apiFetch<Task[]>(`/api/v1/tasks/batch?${params.toString()}`);
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

export const createDigitalGoodsTask = async (
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

  return await apiFetch<TaskCreationResponse>('/api/v1/tasks/digital-goods', {
    method: 'POST',
    body: formData,
  });
};

export interface ButterCoverRequest {
  voiceModel: string;
  pitchAdjust?: number;
  outputFormat?: string;
}

export const createButterCoverTask = async (
  audio: File,
  request: ButterCoverRequest
): Promise<ApiResponse<TaskCreationResponse>> => {
  const formData = new FormData();
  formData.append('audio', audio);
  formData.append('voiceModel', request.voiceModel);

  if (request.pitchAdjust !== undefined) {
    formData.append('pitchAdjust', request.pitchAdjust.toString());
  }

  if (request.outputFormat) {
    formData.append('outputFormat', request.outputFormat);
  }

  return await apiFetch<TaskCreationResponse>('/api/v1/tasks/butter-cover', {
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

export const createStylistTask = async (
  image: File,
  request: StylistRequest
): Promise<ApiResponse<TaskCreationResponse>> => {
  const formData = new FormData();

  formData.append('image', image);

  formData.append('prompt', request.prompt);

  if (request.hairStyleImage) {
    formData.append('hairStyleReference', request.hairStyleImage);
  }
  if (request.outfitImage) {
    formData.append('outfitReference', request.outfitImage);
  }
  if (request.backgroundImage) {
    formData.append('backgroundReference', request.backgroundImage);
  }
  if (request.accessoryImage) {
    formData.append('accessoryReference', request.accessoryImage);
  }
  if (request.moodImage) {
    formData.append('moodReference', request.moodImage);
  }

  if (request.customPrompt) {
    formData.append('customPrompt', request.customPrompt);
  }

  return await apiFetch<TaskCreationResponse>('/api/v1/tasks/stylist', {
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
  KPOP_DEMON_HUNTERS: 'KPOP_DEMON_HUNTERS',

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

export const createVirtualCastingTask = async (
  image: File,
  request: VirtualCastingRequest
): Promise<ApiResponse<TaskCreationResponse>> => {
  const formData = new FormData();

  formData.append('image', image);
  formData.append('style', request.style);

  return await apiFetch<TaskCreationResponse>('/api/v1/tasks/virtual-casting', {
    method: 'POST',
    body: formData,
  });
};

export const FANMEETING_IMAGE_PROMPT_STYLES = {
  WINTER_SAPPORO: 'WINTER_SAPPORO',
  POLAROID: 'POLAROID',
} as const;

export type FanmeetingImagePromptStyle =
  (typeof FANMEETING_IMAGE_PROMPT_STYLES)[keyof typeof FANMEETING_IMAGE_PROMPT_STYLES];

export interface FanmeetingStudioRequest {
  mode?: 'text' | 'image';
  situationPrompt?: string;
  backgroundPrompt?: string;
  imagePromptStyle?: FanmeetingImagePromptStyle;
}

export const createFanmeetingStudioTask = async (
  fanImage: File,
  idolImage: File,
  request: FanmeetingStudioRequest
): Promise<ApiResponse<TaskCreationResponse>> => {
  const formData = new FormData();

  formData.append('image1', fanImage);
  formData.append('image2', idolImage);

  const mode = request.mode || 'text';
  formData.append('mode', mode);

  if (mode === 'image' && request.imagePromptStyle) {
    formData.append('imagePromptStyle', request.imagePromptStyle);
  } else {
    if (request.situationPrompt) {
      formData.append('situationPrompt', request.situationPrompt);
    }
    if (request.backgroundPrompt) {
      formData.append('backgroundPrompt', request.backgroundPrompt);
    }
  }

  return await apiFetch<TaskCreationResponse>(
    '/api/v1/tasks/fanmeeting-studio',
    {
      method: 'POST',
      body: formData,
    }
  );
};

export const deleteTask = async (taskId: number): Promise<void> => {
  await apiFetch<null>(`/api/v1/tasks/${taskId}`, {
    method: 'DELETE',
  });
};

export interface BatchDeleteResponse {
  message: string;
  deletedCount: string;
}

export const deleteBatchTasks = async (
  taskIds: number[]
): Promise<ApiResponse<BatchDeleteResponse>> => {
  return await apiFetch<BatchDeleteResponse>('/api/v1/tasks/batch', {
    method: 'DELETE',
    body: { taskIds },
  });
};

export const canEditTask = async (
  taskId: number,
  actionType: ActionType
): Promise<ApiResponse<boolean>> => {
  return await apiFetch<boolean>(`/api/v1/tasks/${taskId}/can-edit`);
};

export const editTask = async (
  taskId: number,
  actionType: ActionType,
  editPrompt: string
): Promise<ApiResponse<EditTaskResponse>> => {
  const endpoint = getActionTypeEndpoint(actionType);
  const request: EditTaskRequest = {
    originalTaskId: taskId,
    editPrompt: editPrompt,
  };

  return await apiFetch<EditTaskResponse>(
    `/api/v1/tasks/${endpoint}/${taskId}/edit`,
    {
      method: 'POST',
      body: request,
    }
  );
};

export const getTaskEditHistory = async (
  taskId: number,
  actionType: ActionType
): Promise<ApiResponse<TaskHistoryResponse[]>> => {
  return await apiFetch<TaskHistoryResponse[]>(
    `/api/v1/tasks/${taskId}/history`
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

export const getTaskResultUrl = (task: Task): string | null => {
  switch (task.actionType) {
    case 'DIGITAL_GOODS':
    case 'DIGITAL_GOODS_EDIT':
      return task.digitalGoods?.imageUrl || null;
    case 'VIRTUAL_CASTING':
    case 'VIRTUAL_CASTING_EDIT':
      return task.virtualCasting?.imageUrl || null;
    case 'STYLIST':
    case 'STYLIST_EDIT':
      return task.stylist?.imageUrl || null;
    case 'FANMEETING_STUDIO':
    case 'FANMEETING_STUDIO_EDIT':
      return task.fanmeetingStudio?.imageUrl || null;
    case 'BUTTER_COVER':
      return task.butterCover?.audioUrl || null;
    default:
      return null;
  }
};

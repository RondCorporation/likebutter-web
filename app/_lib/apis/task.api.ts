import { apiFetch } from '../apiClient';
import { ApiResponse } from '@/app/_types/api';
import { Page, Task, TaskStatusResponse } from '@/types/task';

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

// Digital Goods task creation
export interface DigitalGoodsRequest {
  style: DigitalGoodsStyle;
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
  voiceModel: string;              // 필수: AI 보이스 모델명
  pitchAdjust?: number;            // 선택: 목소리 높낮이 조절 (-12 ~ +12, 기본값: 0)
  outputFormat?: string;           // 선택: 출력 파일 형식 (mp3/wav, 기본값: "mp3")
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

// Virtual Casting style enum values
export const VIRTUAL_CASTING_STYLES = {
  // Disney, Pixar & Hollywood Animation
  FROZEN: 'FROZEN',
  SPONGEBOB: 'SPONGEBOB',
  ALADDIN: 'ALADDIN',
  INSIDE_OUT: 'INSIDE_OUT',
  TOY_STORY: 'TOY_STORY',
  MINIONS: 'MINIONS',
  ZOOTOPIA: 'ZOOTOPIA',
  // Fantasy & SF
  TWILIGHT: 'TWILIGHT',
  STAR_WARS: 'STAR_WARS',
  LORD_OF_THE_RINGS: 'LORD_OF_THE_RINGS',
  HARRY_POTTER: 'HARRY_POTTER',
  AVENGERS: 'AVENGERS',
  OVERWATCH: 'OVERWATCH', // 이미지 있음, API 스펙에 없음 - 더미
  // Korean Webtoons & Dramas
  TRUE_BEAUTY: 'TRUE_BEAUTY',
  LOOKISM: 'LOOKISM',
  KENGAN_ASHURA: 'KENGAN_ASHURA',
  ITAEWON_CLASS: 'ITAEWON_CLASS',
  SQUID_GAME: 'SQUID_GAME',
  VOLCANO_RETURNS: 'VOLCANO_RETURNS', // 이미지 있음, API 스펙에 없음 - 더미
  // Japanese Animation
  CRAYON_SHIN_CHAN: 'CRAYON_SHIN_CHAN',
  FRIEREN: 'FRIEREN',
  MY_LOVE_MIX_UP: 'MY_LOVE_MIX_UP',
  NARUTO: 'NARUTO',
  // 이미지 있음, API 스펙에 없음 - 더미 열거형들
  KIMI_NI_TODOKE: 'KIMI_NI_TODOKE', // 너에게 닿기를
  DETECTIVE_CONAN: 'DETECTIVE_CONAN', // 명탐정 코난
  NANA: 'NANA', // 나나
  YOUR_NAME: 'YOUR_NAME', // 너의이름은
  DORAEMON: 'DORAEMON', // 도라에몽
  SPY_FAMILY: 'SPY_FAMILY', // 스파이패밀리
  SLAM_DUNK: 'SLAM_DUNK', // 슬램덩크
  OURAN_HIGH_SCHOOL: 'OURAN_HIGH_SCHOOL', // 오란고교
  JUJUTSU_KAISEN: 'JUJUTSU_KAISEN', // 주술회전
} as const;

export type VirtualCastingStyle =
  (typeof VIRTUAL_CASTING_STYLES)[keyof typeof VIRTUAL_CASTING_STYLES];

// Virtual Casting task creation
export interface VirtualCastingRequest {
  style: VirtualCastingStyle;
}

export const createVirtualCastingTask = (
  idolImage: File,
  request: VirtualCastingRequest
): Promise<ApiResponse<TaskCreationResponse>> => {
  const formData = new FormData();

  // Add required files and data
  formData.append('idolImage', idolImage);
  formData.append('style', request.style);

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

// Task 삭제 API
export const deleteTask = (taskId: number): Promise<void> => {
  return apiFetch<void>(`/tasks/${taskId}`, {
    method: 'DELETE',
  }).then(() => {
    // 204 No Content 응답의 경우 void를 반환
  });
};

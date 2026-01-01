export interface SuccessResponseEntity<T> {
  success: boolean;
  data: T;
  timestamp: string;
}

export type GenerationStatus =
  | 'PENDING'
  | 'PROCESSING'
  | 'COMPLETED'
  | 'FAILED';

export type PipelineStatus =
  | 'PENDING'
  | 'AUDIO_SEPARATION_IN_PROGRESS'
  | 'AUDIO_SEPARATION_COMPLETED'
  | 'AI_COVER_GENERATION_IN_PROGRESS'
  | 'COMPLETED'
  | 'FAILED';

export type ActionType =
  | 'BUTTER_COVER'
  | 'DIGITAL_GOODS'
  | 'FANMEETING_STUDIO'
  | 'STYLIST'
  | 'VIRTUAL_CASTING'
  | 'VIDEO_GENERATION'
  | 'DIGITAL_GOODS_EDIT'
  | 'FANMEETING_STUDIO_EDIT'
  | 'STYLIST_EDIT'
  | 'VIRTUAL_CASTING_EDIT';

export interface DigitalGoodsResponse {
  imageUrl: string;
  downloadUrl: string;
  filename: string;
  fileSize: number;
  executionTime: number;
  requestImageUrl?: string;
  style?: string;
}

export interface VirtualCastingResponse {
  imageUrl: string;
  downloadUrl: string;
  filename: string;
  fileSize: number;
  executionTime: number;
  requestImageUrl?: string;
}

export interface StylistResponse {
  imageUrl: string;
  downloadUrl: string;
  filename: string;
  fileSize: number;
  executionTime: number;
  requestImageUrl?: string;
  hairStyleImageUrl?: string;
  outfitImageUrl?: string;
  backgroundImageUrl?: string;
  accessoryImageUrl?: string;
  moodImageUrl?: string;
}

export interface FanmeetingStudioResponse {
  imageUrl: string;
  downloadUrl: string;
  filename: string;
  fileSize: number;
  executionTime: number;
  requestImage1Url?: string;
  requestImage2Url?: string;
}

export interface ButterCoverResponse {
  audioUrl: string;
  downloadUrl: string;
  filename: string;
  fileSize: number;
  executionTime: number;
}

export interface VideoGenerationResponse {
  videoUrl: string;
  downloadUrl: string;
  filename: string;
  fileSize: number;
  executionTime: number;
  requestImageUrl?: string;
  duration?: number;
}

type ActionMap = {
  BUTTER_COVER: {
    butterCover?: ButterCoverResponse;
    error?: string | null;
  };
  DIGITAL_GOODS: {
    digitalGoods?: DigitalGoodsResponse;
    error?: string | null;
  };
  FANMEETING_STUDIO: {
    fanmeetingStudio?: FanmeetingStudioResponse;
    error?: string | null;
  };
  STYLIST: {
    stylist?: StylistResponse;
    error?: string | null;
  };
  VIRTUAL_CASTING: {
    virtualCasting?: VirtualCastingResponse;
    error?: string | null;
  };
  VIDEO_GENERATION: {
    videoGeneration?: VideoGenerationResponse;
    error?: string | null;
  };
  DIGITAL_GOODS_EDIT: {
    digitalGoods?: DigitalGoodsResponse;
    error?: string | null;
  };
  FANMEETING_STUDIO_EDIT: {
    fanmeetingStudio?: FanmeetingStudioResponse;
    error?: string | null;
  };
  STYLIST_EDIT: {
    stylist?: StylistResponse;
    error?: string | null;
  };
  VIRTUAL_CASTING_EDIT: {
    virtualCasting?: VirtualCastingResponse;
    error?: string | null;
  };
};

export type Task = {
  taskId: number;
  status: GenerationStatus;
  createdAt: string;
  parentTaskId?: number | null;
  editSequence?: number | null;
  isOriginal?: boolean;
  isEditTask?: boolean;
} & {
  [K in ActionType]: { actionType: K } & ActionMap[K];
}[ActionType];

export interface Page<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      sorted: boolean;
      unsorted: boolean;
      empty: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  last: boolean;
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  sort: {
    sorted: boolean;
    unsorted: boolean;
    empty: boolean;
  };
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}

export interface EditTaskRequest {
  originalTaskId: number;
  editPrompt: string;
}

export interface EditTaskResponse {
  taskId: number;
  originalTaskId: number;
  actionType: ActionType;
  status: GenerationStatus;
  editSequence: number;
  createdAt: string;
}

export interface TaskHistoryResponse {
  taskId: number;
  actionType: ActionType;
  status: GenerationStatus;
  editSequence: number;
  isOriginal: boolean;
  createdAt: string;
  resultImageUrl?: string;
}

// Success Response Entity wrapper (new API spec)
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
  | 'DIGITAL_GOODS_EDIT'
  | 'FANMEETING_STUDIO_EDIT'
  | 'STYLIST_EDIT'
  | 'VIRTUAL_CASTING_EDIT';

// ActionType별 응답 필드 타입 (새 API 명세 기준)
export interface DigitalGoodsResponse {
  imageUrl: string;
  filename: string;
  fileSize: number;
  executionTime: number;
  requestImageUrl?: string; // 원본 요청 이미지 URL
  style?: string; // 사용된 스타일
}

export interface VirtualCastingResponse {
  imageUrl: string;
  filename: string;
  fileSize: number;
  executionTime: number;
  requestImageUrl?: string; // 원본 요청 이미지 URL
}

export interface StylistResponse {
  imageUrl: string;
  filename: string;
  fileSize: number;
  executionTime: number;
  requestImageUrl?: string; // 메인 아이돌 이미지 URL
  hairStyleImageUrl?: string; // 헤어 스타일 참조 이미지 URL
  outfitImageUrl?: string; // 의상 참조 이미지 URL
  backgroundImageUrl?: string; // 배경 참조 이미지 URL
  accessoryImageUrl?: string; // 액세서리 참조 이미지 URL
  moodImageUrl?: string; // 무드/분위기 참조 이미지 URL
}

export interface FanmeetingStudioResponse {
  imageUrl: string;
  filename: string;
  fileSize: number;
  executionTime: number;
  requestImage1Url?: string; // 첫 번째 인물 이미지 URL
  requestImage2Url?: string; // 두 번째 인물 이미지 URL
}

export interface ButterCoverResponse {
  audioUrl: string;
  filename: string;
  fileSize: number;
  executionTime: number;
}

// 기존 Details 구조 (하위 호환성 유지)
interface DigitalGoodsRequestDetails {
  imageKey?: string;
  imageUrl?: string;
  style: string;
  editPrompt?: string;
}

interface DigitalGoodsResultDetails {
  imageKey: string;
  imageUrl: string;
  filename: string;
  style: string;
  promptUsed: string;
  fileSize: number;
  executionTime: number;
}

export interface DigitalGoodsDetails {
  request: DigitalGoodsRequestDetails;
  result?: DigitalGoodsResultDetails;
  error?: string;
}

interface FanmeetingStudioRequestDetails {
  fanImageKey: string;
  fanImageUrl?: string;
  idolImageKey: string;
  idolImageUrl?: string;
  situationPrompt: string;
  backgroundPrompt: string;
  customPrompt?: string;
  editPrompt?: string;
}

interface FanmeetingStudioResultDetails {
  imageKey: string;
  imageUrl?: string;
  filename: string;
  situationPrompt: string;
  backgroundPrompt: string;
  promptUsed: string;
  fileSize: number;
  executionTime: number;
}

export interface FanmeetingStudioDetails {
  request: FanmeetingStudioRequestDetails;
  result?: FanmeetingStudioResultDetails;
  error?: string;
}

interface ButterCoverRequestDetails {
  voiceModel: string;
  pitchAdjust?: number;
  outputFormat?: string;
  sourceAudioKey: string;
}

interface ButterCoverResultDetails {
  audioKey: string;
  audioUrl?: string;
  vocalsKey?: string;
  instrumentalsKey?: string;
}

interface ButterCoverIntermediateResult {
  vocalsUrl?: string;
  instrumentalsUrl?: string;
  vocalsKey?: string;
  instrumentalsKey?: string;
}

export interface ButterCoverDetails {
  request: ButterCoverRequestDetails;
  result?: ButterCoverResultDetails;
  intermediateResult?: ButterCoverIntermediateResult;
  pipelineStatus?: string;
  separationJobId?: string;
  coverGenerationJobId?: string;
  error?: string | null;
}

interface StylistRequestDetails {
  prompt: string;
  idolImageKey: string;
  idolImageUrl?: string;
  hairStyleImageKey?: string;
  hairStyleImageUrl?: string;
  outfitImageKey?: string;
  outfitImageUrl?: string;
  backgroundImageKey?: string;
  backgroundImageUrl?: string;
  accessoryImageKey?: string;
  accessoryImageUrl?: string;
  moodImageKey?: string;
  moodImageUrl?: string;
  customPrompt?: string;
  editPrompt?: string;
}

interface StylistResultDetails {
  imageKey: string;
  imageUrl?: string;
  filename: string;
  promptUsed: string;
  fileSize: number;
  executionTime: number;
  hairStyleUsed?: string;
  outfitUsed?: string;
  backgroundUsed?: string;
  accessoryUsed?: string;
  moodUsed?: string;
}

export interface StylistDetails {
  request: StylistRequestDetails;
  result?: StylistResultDetails;
  error?: string;
}

interface VirtualCastingRequestDetails {
  idolImageKey: string;
  idolImageUrl: string;
  style: string;
  editPrompt?: string;
}

interface VirtualCastingResultDetails {
  imageKey: string;
  imageUrl: string;
  filename: string;
  styleUsed: string;
  promptUsed: string;
  fileSize: number;
  executionTime: number;
}

export interface VirtualCastingDetails {
  request: VirtualCastingRequestDetails;
  result?: VirtualCastingResultDetails;
  error?: string;
}

// ActionType별 매핑 (새 API 명세 기준)
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

// Task 타입 (새 API 명세 기준)
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

export interface TaskStatusResponse {
  taskId: number;
  status: GenerationStatus;
  pipelineStatus?: PipelineStatus;
  createdAt: string;
  updatedAt: string;
  details: any;
}

export interface TaskImageUrlResponse {
  taskId: number;
  imageUrl: string;
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

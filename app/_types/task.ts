export type GenerationStatus =
  | 'PENDING'
  | 'PROCESSING'
  | 'COMPLETED'
  | 'FAILED';

// Pipeline status for ButterCover tasks
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
  | 'DREAM_CONTI'
  | 'FANMEETING_STUDIO'
  | 'PHOTO_EDITOR'
  | 'STYLIST'
  | 'VIRTUAL_CASTING';

// Digital Goods types
interface DigitalGoodsRequestDetails {
  imageKey?: string;
  imageUrl?: string;
  style: string;
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

// Dream Conti types
interface DreamContiRequestDetails {
  dreamPrompt: string;
  continuationStyle: string;
  imageCount: number;
  sourceImageKey: string;
}

interface DreamContiResultDetails {
  imageKey: string;
}

export interface DreamContiDetails {
  request: DreamContiRequestDetails;
  result?: DreamContiResultDetails;
}

// Fanmeeting Studio types
interface FanmeetingStudioRequestDetails {
  fanImageKey: string;
  fanImageUrl?: string;
  idolImageKey: string;
  idolImageUrl?: string;
  situationPrompt: string;
  backgroundPrompt: string;
  customPrompt?: string;
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

// Photo Editor types
interface PhotoEditorRequestDetails {
  editType: string;
  enhanceQuality: boolean;
  applyFilter: string;
  brightness: number;
  contrast: number;
  saturation: number;
  sourceImageKey: string;
}

interface PhotoEditorResultDetails {
  originalImageKey: string;
  editedImageKey: string;
}

export interface PhotoEditorDetails {
  request: PhotoEditorRequestDetails;
  result?: PhotoEditorResultDetails;
}

// ButterCover types based on updated API specification
interface ButterCoverRequestDetails {
  voiceModel: string;              // 필수: AI 보이스 모델명
  pitchAdjust?: number;            // 선택: 목소리 높낮이 조절 (-12 ~ +12, 기본값: 0)
  outputFormat?: string;           // 선택: 출력 파일 형식 (mp3/wav, 기본값: "mp3")
  sourceAudioKey: string;
}

interface ButterCoverResultDetails {
  audioKey: string;
  vocalsKey?: string;
  instrumentalsKey?: string;
}

export interface ButterCoverDetails {
  request: ButterCoverRequestDetails;
  result?: ButterCoverResultDetails;
}

// Stylist types
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

// Virtual Casting types
interface VirtualCastingRequestDetails {
  idolImageKey: string;
  idolImageUrl: string;
  style: string;
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

type ActionMap = {
  BUTTER_COVER: { details?: ButterCoverDetails };
  DIGITAL_GOODS: { details?: DigitalGoodsDetails };
  DREAM_CONTI: { details?: DreamContiDetails };
  FANMEETING_STUDIO: { details?: FanmeetingStudioDetails };
  PHOTO_EDITOR: { details?: PhotoEditorDetails };
  STYLIST: { details?: StylistDetails };
  VIRTUAL_CASTING: { details?: VirtualCastingDetails };
};

export type Task = {
  taskId: number;
  status: GenerationStatus;
  createdAt: string; // ISO 8601 string format
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

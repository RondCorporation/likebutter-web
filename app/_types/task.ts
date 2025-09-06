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

export type ActionType = 'BUTTER_COVER' | 'DIGITAL_GOODS' | 'DREAM_CONTI' | 'FANMEETING_STUDIO' | 'PHOTO_EDITOR';

// Digital Goods types
interface DigitalGoodsRequestDetails {
  style: string;
  customPrompt?: string;
  title?: string;
  subtitle?: string;
  accentColor?: string;
  productName?: string;
  brandName?: string;
  sourceImageKey: string;
}

interface DigitalGoodsResultDetails {
  imageKey: string;
}

export interface DigitalGoodsDetails {
  request: DigitalGoodsRequestDetails;
  result?: DigitalGoodsResultDetails;
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
  idolImageKey: string;
  studioStyle: string;
  lightingMode: string;
  backgroundMusic: string;
}

interface FanmeetingStudioResultDetails {
  imageKey: string;
}

export interface FanmeetingStudioDetails {
  request: FanmeetingStudioRequestDetails;
  result?: FanmeetingStudioResultDetails;
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

type ActionMap = {
  BUTTER_COVER: { details?: ButterCoverDetails };
  DIGITAL_GOODS: { details?: DigitalGoodsDetails };
  DREAM_CONTI: { details?: DreamContiDetails };
  FANMEETING_STUDIO: { details?: FanmeetingStudioDetails };
  PHOTO_EDITOR: { details?: PhotoEditorDetails };
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

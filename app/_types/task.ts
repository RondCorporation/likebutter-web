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

export interface ButterCoverDetails {
  request: ButterCoverRequestDetails;
  result?: ButterCoverResultDetails;
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

type ActionMap = {
  BUTTER_COVER: { details?: ButterCoverDetails };
  DIGITAL_GOODS: { details?: DigitalGoodsDetails };
  FANMEETING_STUDIO: { details?: FanmeetingStudioDetails };
  STYLIST: { details?: StylistDetails };
  VIRTUAL_CASTING: { details?: VirtualCastingDetails };
  DIGITAL_GOODS_EDIT: { details?: DigitalGoodsDetails };
  FANMEETING_STUDIO_EDIT: { details?: FanmeetingStudioDetails };
  STYLIST_EDIT: { details?: StylistDetails };
  VIRTUAL_CASTING_EDIT: { details?: VirtualCastingDetails };
};

export type Task = {
  taskId: number;
  status: GenerationStatus;
  createdAt: string;
  parentTaskId?: number;
  editSequence?: number;
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
  editPrompt: string;
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

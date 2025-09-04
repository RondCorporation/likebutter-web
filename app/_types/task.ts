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

export type ActionType = 'BUTTER_GEN' | 'BUTTER_TEST' | 'BUTTER_COVER';

interface ButterGenRequestDetails {
  sourceImageUrl: string;
  prompt: string;
}

interface ButterGenResultDetails {
  imageUrl?: string;
}

export interface ButterGenDetails {
  request: ButterGenRequestDetails;
  result?: ButterGenResultDetails;
  jobId?: string;
  error?: string;
}

interface ButterTestRequestDetails {
  prompt: string;
}

interface ButterTestResultDetails {
  imageUrl?: string;
}

export interface ButterTestDetails {
  request: ButterTestRequestDetails;
  result?: ButterTestResultDetails;
  jobId?: string;
  error?: string;
}

// ButterCover types based on API specification
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
}

interface ButterCoverResultDetails {
  audioKey?: string;
  downloadUrl?: string;
  filename?: string;
  voiceModel?: string;
  pitchAdjust?: number;
  outputFormat?: string;
  fileSize?: number;
  executionTime?: number;
}

interface ButterCoverIntermediateResult {
  vocalsUrl?: string;
  instrumentalsUrl?: string;
}

export interface ButterCoverDetails {
  request: ButterCoverRequestDetails;
  result?: ButterCoverResultDetails;
  separationJobId?: string;
  coverGenerationJobId?: string;
  intermediateResult?: ButterCoverIntermediateResult;
  error?: string;
  errorMessage?: string;
}

type ActionMap = {
  BUTTER_GEN: { details?: ButterGenDetails };
  BUTTER_TEST: { details?: ButterTestDetails };
  BUTTER_COVER: { details?: ButterCoverDetails };
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

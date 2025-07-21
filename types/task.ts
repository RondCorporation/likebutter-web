export type GenerationStatus =
  | 'PENDING'
  | 'PROCESSING'
  | 'COMPLETED'
  | 'FAILED';

export type ActionType = 'BUTTER_GEN' | 'BUTTER_TEST';

// ================= BUTTER_GEN Types =================
interface ButterGenRequestDetails {
  idolName: string;
  sourceImageUrl: string;
  prompt: string;
  imageCount: number;
  width: number;
  height: number;
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

// ================= BUTTER_TEST Types =================
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

// ================= Discriminated Union for Tasks =================
type ActionMap = {
  BUTTER_GEN: { details?: ButterGenDetails };
  BUTTER_TEST: { details?: ButterTestDetails };
};

export type Task = {
  taskId: number;
  status: GenerationStatus;
  createdAt: string; // ISO 8601 string format
} & {
  [K in ActionType]: { actionType: K } & ActionMap[K];
}[ActionType];

// ================= API Response Types =================
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
  details: any;
}

export interface TaskImageUrlResponse {
  taskId: number;
  imageUrl: string;
}

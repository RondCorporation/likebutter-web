export interface ApiResponse<T> {
  status: number;
  data?: T;
  msg?: string;
}

export interface Pageable {
  sort: {
    sorted: boolean;
    unsorted: boolean;
    empty: boolean;
  };
  offset: number;
  pageNumber: number;
  pageSize: number;
  paged: boolean;
  unpaged: boolean;
}

export interface PaginatedResponse<T> {
  content: T[];
  pageable: Pageable;
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

export enum PlanType {
  FREE = 0,
  CREATOR = 1,
  PROFESSIONAL = 2,
  ENTERPRISE = 3,
}

export type PlanKey =
  | 'FREE'
  | 'CREATOR_MONTHLY'
  | 'CREATOR_YEARLY'
  | 'PROFESSIONAL_MONTHLY'
  | 'PROFESSIONAL_YEARLY'
  | 'ENTERPRISE';

export interface Subscription {
  id: number;
  status: 'ACTIVE' | 'CANCELED' | 'INACTIVE';
  planName: string;
}

export interface User {
  accountId: number;
  email: string;
  name: string;
  gender: string;
  countryCode: string;
  countryName: string;
  phoneNumber: string | null;
  planKey: PlanKey;
  planName: string;
  roles: string;
  subscription?: Subscription | null;
}

export interface AttendanceCheckResponse {
  attendanceDate: string;
  creditGranted: number;
  message: string;
  isFirstTimeToday: boolean;
}

export interface TodayAttendanceStatus {
  hasCheckedToday: boolean;
  today: string;
  consecutiveDays: number;
}

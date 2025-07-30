import { apiFetch } from '../apiClient';
import { ApiResponse } from '@/app/_types/api';
import {
  Page,
  Task,
  TaskImageUrlResponse,
  TaskStatusResponse,
} from '@/types/task';

interface TaskCreationResponse {
  taskId: number;
  status: string;
}

export const getTaskHistory = (
  page: number,
  filters: { status?: string; actionType?: string }
): Promise<ApiResponse<Page<Task>>> => {
  const params = new URLSearchParams({
    page: page.toString(),
    size: '10',
    sort: 'createdAt,desc',
  });
  if (filters.status) params.append('status', filters.status);
  if (filters.actionType) params.append('actionType', filters.actionType);

  return apiFetch<Page<Task>>(`/tasks/me?${params.toString()}`);
};

export const getTaskStatus = (
  taskId: number
): Promise<ApiResponse<TaskStatusResponse>> => {
  return apiFetch<TaskStatusResponse>(`/tasks/${taskId}/status`);
};

export const getTaskImageUrl = (
  taskId: number
): Promise<ApiResponse<TaskImageUrlResponse>> => {
  return apiFetch<TaskImageUrlResponse>(`/tasks/${taskId}/image`);
};

export const createButterGenTask = (
  formData: FormData
): Promise<ApiResponse<TaskCreationResponse>> => {
  return apiFetch<TaskCreationResponse>('/tasks/butter-gen', {
    method: 'POST',
    body: formData,
  });
};

export const createButterTestTask = (
  prompt: string
): Promise<ApiResponse<TaskCreationResponse>> => {
  return apiFetch<TaskCreationResponse>('/tasks/butter-test', {
    method: 'POST',
    body: { prompt },
  });
};

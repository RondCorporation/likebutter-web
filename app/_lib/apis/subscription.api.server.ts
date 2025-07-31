import { apiServer } from '../apiServer';
import { ApiResponse } from '@/app/_types/api';
import { Plan } from '@/app/_types/plan';

// Payment APIs - Server-side implementations
export const getPlansOnServer = (): Promise<ApiResponse<Plan[]>> => {
  return apiServer.get<Plan[]>('/plans', false);
};

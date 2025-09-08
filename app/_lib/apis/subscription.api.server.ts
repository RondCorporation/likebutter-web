import { apiServer } from '../apiServer';
import { ApiResponse } from '@/app/_types/api';
import { Plan } from '@/app/_types/plan';

// Payment APIs - Server-side implementations
export const getPlansOnServer = async (): Promise<ApiResponse<Plan[]>> => {
  return apiServer.get<Plan[]>(
    '/plans',
    {
      cache: 'default', // Allow caching
      next: {
        revalidate: 3600, // 1 hour cache
        tags: ['plans'],
      },
    },
    false
  );
};

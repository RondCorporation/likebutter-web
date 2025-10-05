import { apiServer } from '../apiServer';
import { ApiResponse } from '@/app/_types/api';
import { Plan } from '@/app/_types/plan';

export const getPlansOnServer = async (): Promise<ApiResponse<Plan[]>> => {
  return apiServer.get<Plan[]>(
    '/plans',
    {
      cache: 'default',
      next: {
        revalidate: 3600,
        tags: ['plans'],
      },
    },
    false
  );
};

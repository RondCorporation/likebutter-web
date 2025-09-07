import { apiServer } from '../apiServer';
import { ApiResponse } from '@/app/_types/api';
import { Plan } from '@/app/_types/plan';
import { unstable_cache } from 'next/cache';

// Payment APIs - Server-side implementations
export const getPlansOnServer = unstable_cache(
  async (): Promise<ApiResponse<Plan[]>> => {
    return apiServer.get<Plan[]>(
      '/plans',
      { 
        next: { 
          revalidate: 3600, // 1 hour cache
          tags: ['plans'] 
        } 
      },
      false
    );
  },
  ['plans'],
  {
    revalidate: 3600, // 1 hour
    tags: ['plans']
  }
);

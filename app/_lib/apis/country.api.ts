import { apiFetch } from '../apiClient';
import { ApiResponse } from '@/app/_types/api';

interface Country {
  code: string;
  countryEn: string;
  countryKo: string;
  isoCode: string;
}

export const getCountries = (): Promise<ApiResponse<Country[]>> => {
  return apiFetch<Country[]>('/api/v1/countries', {}, false);
};

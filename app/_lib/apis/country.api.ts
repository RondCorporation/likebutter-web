import { apiFetch, ApiResponse } from '../apiClient';

interface Country {
  code: string;
  countryEn: string;
  countryKo: string;
  isoCode: string;
}

export const getCountries = (): Promise<ApiResponse<Country[]>> => {
  return apiFetch<Country[]>('/countries', {}, false);
};

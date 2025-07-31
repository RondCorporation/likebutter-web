export interface ApiResponse<T> {
  status: number;
  data?: T;
  msg?: string;
}

export interface QueryParams {
  limit: number;
  offset: number;
}

export interface ApiPagination {
  _next: string | null;
  _prev: string | null;
  _first: string;
  _last: string;
}
export interface ApiResponse<T> {
  data: T[];
  _links: ApiPagination;
  total: number;
}

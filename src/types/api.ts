export interface ApiSuccess<T> {
  data: T;
  message?: string;
}

export interface ApiErrorShape {
  message: string;
  code?: string;
}

export interface RequestOptions<TBody = unknown> {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: TBody;
  headers?: Record<string, string>;
  timeoutMs?: number;
}


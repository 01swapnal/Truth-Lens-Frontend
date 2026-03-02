import { appEnv } from "../config/env";
import type { ApiSuccess, RequestOptions } from "../types/api";

function withTimeout(timeoutMs: number): AbortController {
  const controller = new AbortController();
  window.setTimeout(() => controller.abort(), timeoutMs);
  return controller;
}

export async function apiRequest<TResponse, TBody = unknown>(
  path: string,
  options: RequestOptions<TBody> = {}
): Promise<TResponse> {
  const method = options.method ?? "GET";
  const timeoutMs = options.timeoutMs ?? appEnv.requestTimeoutMs;
  const controller = withTimeout(timeoutMs);
  const baseUrl = appEnv.apiBaseUrl.replace(/\/$/, "");
  const url = `${baseUrl}${path}`;

  const response = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {})
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
    signal: controller.signal
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  const payload = (await response.json()) as ApiSuccess<TResponse> | TResponse;

  if (typeof payload === "object" && payload !== null && "data" in payload) {
    return payload.data as TResponse;
  }

  return payload as TResponse;
}


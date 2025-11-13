import { ApiError, HttpErrorPayload, ValidationDetail } from "./types";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:8000";

async function parseError(res: Response): Promise<never> {
  let message = `Request failed (${res.status})`;
  let details: ValidationDetail[] | undefined;

  try {
    const payload = (await res.clone().json()) as HttpErrorPayload;
    const maybeError =
      payload && typeof payload === "object"
        ? (payload as { error?: { message?: string } }).error
        : undefined;
    const maybeDetail =
      payload && typeof payload === "object"
        ? (payload as { detail?: string | ValidationDetail[] }).detail
        : undefined;

    if (maybeError?.message) {
      message = maybeError.message;
    } else if (typeof maybeDetail === "string") {
      message = maybeDetail;
    } else if (Array.isArray(maybeDetail)) {
      details = maybeDetail;
      message = maybeDetail.map((detail) => detail.msg ?? "Invalid value").join("; ");
    }
  } catch {
    const text = await res
      .text()
      .catch(() => res.statusText || "Unable to parse error response");
    if (text) {
      message = `${message}: ${text}`;
    }
  }

  throw new ApiError(message, {
    status: res.status,
    details,
  });
}

async function readBody<T>(res: Response): Promise<T> {
  const text = await res.text();
  if (!text) {
    return undefined as T;
  }
  try {
    return JSON.parse(text) as T;
  } catch {
    throw new ApiError("Failed to parse server response", { status: res.status });
  }
}

export async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const url = path.startsWith("http") ? path : `${API_BASE_URL}${path}`;
  const headers = new Headers(init.headers ?? {});

  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const execute = () =>
    fetch(url, {
      ...init,
      headers,
      credentials: "include",
    });

  const res = await execute();

  if (res.status === 204) {
    return undefined as T;
  }

  if (!res.ok) {
    return parseError(res);
  }

  return readBody<T>(res);
}

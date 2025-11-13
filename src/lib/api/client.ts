export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers ?? {});
  headers.set("Content-Type", "application/json");

  const res = await fetch(path, {
    method: init?.method ?? "GET",
    credentials: "include",
    headers,
    body: init?.body,
  });

  if (!res.ok) {
    let message = "Request failed";
    try {
      message = (await res.json())?.message ?? message;
    } catch {
      // ignore json parse failures
    }
    throw new ApiError(message, res.status);
  }

  if (res.status === 204) {
    return undefined as unknown as T;
  }

  return (await res.json()) as T;
}

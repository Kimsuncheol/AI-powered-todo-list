import { apiFetch } from "@/lib/api/http";
import type { MotivationResponse } from "@/types/motivation";

export async function getCurrentMotivation(opts?: {
  name?: string;
  locale?: string | null;
}): Promise<MotivationResponse> {
  const params = new URLSearchParams();
  const providedName = opts?.name?.trim();
  const nameToSend = providedName && providedName.length > 0 ? providedName : "Friend";
  params.set("name", nameToSend);

  if (opts && "locale" in opts && opts.locale != null) {
    params.set("locale", opts.locale);
  }

  const qs = params.toString();
  return apiFetch<MotivationResponse>(`/motivation/now${qs ? `?${qs}` : ""}`);
}

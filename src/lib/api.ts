const API_ROOT = "http://localhost:9999";
export const API_BASE = `${API_ROOT}/api`;

type ApiFetchOptions = RequestInit & {
  skipJsonContentType?: boolean;
};

export async function apiFetch<T>(path: string, options: ApiFetchOptions = {}): Promise<T> {
  const { skipJsonContentType = false, headers, ...rest } = options;

  const res = await fetch(`${API_BASE}${path}`, {
    credentials: "include",
    cache: "no-store",
    ...rest,
    headers: {
      ...(skipJsonContentType ? {} : { "Content-Type": "application/json" }),
      ...(headers ?? {}),
    },
  });

  if (!res.ok) {
    let message = `API 요청 실패: ${res.status}`;
    try {
      const text = await res.text();
      if (text) message = text;
    } catch {
      // ignore
    }
    throw new Error(message);
  }

  const contentType = res.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    return undefined as T;
  }

  return res.json() as Promise<T>;
}
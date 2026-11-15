
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  if (!API_URL) {
    throw new Error("API URL is not configured");
  }

  // Get token from browser storage
  let token: string | null = null;

  if (typeof window !== "undefined") {
    token =
      localStorage.getItem("access_token") ||
      sessionStorage.getItem("access_token");
  }

  const headers = new Headers(options.headers);

  // Set JSON content type unless sending FormData
  if (!(options.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  // Attach JWT when available
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(
    `${API_URL.replace(/\/$/, "")}${endpoint}`,
    {
      ...options,
      headers,
    }
  );

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const detail = data?.detail;

    const errorMessage =
      typeof detail === "string"
        ? detail
        : detail
          ? JSON.stringify(detail)
          : `API Error: ${response.status}`;

    throw new Error(errorMessage);
  }

  return data as T;
}

export const API_CONFIG = {
  // Point to internal Proxy API instead of direct external URL
  BASE_URL: "/api",
  TIMEOUT: 10000,
  HEADERS: {
    "Content-Type": "application/json",
    Accept: "application/json",
  } as Record<string, string>,
};

export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public data?: any,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get("content-type");
  const isJson = contentType && contentType.includes("application/json");
  const data = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    throw new ApiError(
      response.status,
      (data && data.detail) || data.message || response.statusText,
      data,
    );
  }

  return data as T;
}

export const apiClient = {
  get: async <T>(endpoint: string, token?: string) => {
    const headers = { ...API_CONFIG.HEADERS };
    // Token is now handled by the Proxy via HttpOnly cookie
    // But we keep this for potential overrides if needed
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
      method: "GET",
      headers,
    });
    return handleResponse<T>(response);
  },

  post: async <T>(endpoint: string, body: any, token?: string) => {
    const headers = { ...API_CONFIG.HEADERS };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });
    return handleResponse<T>(response);
  },

  put: async <T>(endpoint: string, body: any, token?: string) => {
    const headers = { ...API_CONFIG.HEADERS };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(body),
    });
    return handleResponse<T>(response);
  },

  patch: async <T>(endpoint: string, body: any, token?: string) => {
    const headers = { ...API_CONFIG.HEADERS };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(body),
    });
    return handleResponse<T>(response);
  },

  delete: async <T>(endpoint: string, token?: string) => {
    const headers = { ...API_CONFIG.HEADERS };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
      method: "DELETE",
      headers,
    });
    return handleResponse<T>(response);
  },
};

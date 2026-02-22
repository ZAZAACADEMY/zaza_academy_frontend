import { tokenStore } from "./tokenStore";

export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL,
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
  
  // Handle empty responses (e.g., 204 No Content)
  if (response.status === 204) {
    return null as T;
  }
  
  const data = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    const errorMessage = (data && (data.detail || data.message)) || response.statusText;
    throw new ApiError(
      response.status,
      errorMessage,
      data,
    );
  }

  return data as T;
}

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];
let refreshErrorSubscribers: ((error: any) => void)[] = [];

const subscribeTokenRefresh = (cb: (token: string) => void, errorCb: (error: any) => void) => {
  refreshSubscribers.push(cb);
  refreshErrorSubscribers.push(errorCb);
};

const onTokenRefreshed = (token: string) => {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
  refreshErrorSubscribers = [];
};

const onTokenRefreshError = (error: any) => {
  refreshErrorSubscribers.forEach((cb) => cb(error));
  refreshSubscribers = [];
  refreshErrorSubscribers = [];
};

const createFetcher = (method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE") => {
  const fetcher = async <T>(endpoint: string, body?: any): Promise<T> => {
    const headers = { ...API_CONFIG.HEADERS };
    const token = tokenStore.getToken();

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const config: RequestInit = {
      method,
      headers,
    };

    if (body) {
      config.body = JSON.stringify(body);
    }

    const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, config);

    if (response.status === 401 && !endpoint.includes("/auth/token/refresh/")) {
      if (!isRefreshing) {
        isRefreshing = true;
        const refreshToken = tokenStore.getRefreshToken();
        
        if (refreshToken) {
          try {
            const refreshResponse = await fetch(`${API_CONFIG.BASE_URL}/api/v1/auth/token/refresh/`, {
              method: "POST",
              headers: { ...API_CONFIG.HEADERS },
              body: JSON.stringify({ refresh: refreshToken }),
            });

            if (refreshResponse.ok) {
              const refreshData = await refreshResponse.json();
              tokenStore.setToken(refreshData.access);
              isRefreshing = false;
              onTokenRefreshed(refreshData.access);
            } else {
              tokenStore.removeTokens();
              isRefreshing = false;
              const error = new ApiError(401, "Session expired");
              onTokenRefreshError(error);
              throw error;
            }
          } catch (err) {
            tokenStore.removeTokens();
            isRefreshing = false;
            onTokenRefreshError(err);
            throw err;
          }
        } else {
          tokenStore.removeTokens();
          const error = new ApiError(401, "No refresh token available");
          throw error;
        }
      }

      return new Promise<T>((resolve, reject) => {
        subscribeTokenRefresh(
          (newToken) => {
            const retryHeaders = { ...headers, Authorization: `Bearer ${newToken}` };
            resolve(fetch(`${API_CONFIG.BASE_URL}${endpoint}`, { ...config, headers: retryHeaders }).then(res => handleResponse<T>(res)));
          },
          (err) => reject(err)
        );
      });
    }

    return handleResponse<T>(response);
  };
  return fetcher;
};

export const apiClient = {
  get: createFetcher("GET"),
  post: createFetcher("POST"),
  put: createFetcher("PUT"),
  patch: createFetcher("PATCH"),
  delete: createFetcher("DELETE"),
};

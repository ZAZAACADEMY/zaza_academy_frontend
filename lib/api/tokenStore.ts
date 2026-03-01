const ACCESS_TOKEN_KEY = "zaza_access_token";
const REFRESH_TOKEN_KEY = "zaza_refresh_token";

export const tokenStore = {
  getToken: (): string | null => {
    if (typeof window === "undefined") {
      return null;
    }
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },

  setToken: (token: string): void => {
    if (typeof window === "undefined") {
      return;
    }
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
  },

  getRefreshToken: (): string | null => {
    if (typeof window === "undefined") {
      return null;
    }
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  setRefreshToken: (token: string): void => {
    if (typeof window === "undefined") {
      return;
    }
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  },

  removeTokens: (): void => {
    if (typeof window === "undefined") {
      return;
    }
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },

  // Keep compatibility for now if needed
  removeToken: (): void => {
    if (typeof window === "undefined") {
      return;
    }
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },
};

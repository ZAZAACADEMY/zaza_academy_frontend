const ACCESS_TOKEN_KEY = "zaza_access_token";
const REFRESH_TOKEN_KEY = "zaza_refresh_token";
const COOKIE_NAME = "auth_token";

// Helper to set cookie
const setCookie = (name: string, value: string, days = 7) => {
  if (typeof document === "undefined") return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${value}; expires=${expires}; path=/; SameSite=Lax`;
};

// Helper to remove cookie
const removeCookie = (name: string) => {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

export const tokenStore = {
  getToken: (): string | null => {
    if (typeof window === "undefined") {
      return null;
    }
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },

  setToken: (token: string): void => {
    if (typeof window === "undefined") {
      console.warn("Attempted to set token in a non-browser environment");
      return;
    }
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
    console.log("Token stored in localStorage:", token);
    setCookie(COOKIE_NAME, token);
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
    removeCookie(COOKIE_NAME);
  },

  // Keep compatibility for now if needed
  removeToken: (): void => {
    if (typeof window === "undefined") {
      return;
    }
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    removeCookie(COOKIE_NAME);
  },
};

import { apiClient } from "./client";
import { ENDPOINTS } from "./endpoints";
import { tokenStore } from "./tokenStore";
import {
  LoginCredentials,
  RegisterData,
  AuthResponse,
  UserProfile,
} from "./types";

// The backend's token response may have access and refresh tokens
interface TokenResponse {
  access: string;
  refresh?: string;
  user?: UserProfile;
  requires_2fa?: boolean;
  token?: string;
}

export const authService = {
  // Login
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post<TokenResponse>(ENDPOINTS.AUTH.LOGIN, credentials);
    if (response.access) {
      tokenStore.setToken(response.access);
    }
    if (response.refresh) {
      tokenStore.setRefreshToken(response.refresh);
    }
    // The AuthResponse might need to be constructed from the user part of the response
    return { user: response.user } as AuthResponse;
  },

  // Inscription
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await apiClient.post<TokenResponse>(ENDPOINTS.AUTH.REGISTER, data);
    if (response.access) {
      tokenStore.setToken(response.access);
    }
    if (response.refresh) {
      tokenStore.setRefreshToken(response.refresh);
    }
    return { user: response.user } as AuthResponse;
  },

  // Récupérer le profil utilisateur actuel
  getCurrentUser: async (): Promise<UserProfile> => {
    return apiClient.get<UserProfile>(ENDPOINTS.AUTH.ME);
  },

  // Refresh token
  refreshToken: async (refresh: string): Promise<{ access: string }> => {
    const response = await apiClient.post<{ access: string }>(ENDPOINTS.AUTH.REFRESH, { refresh });
    if (response.access) {
      tokenStore.setToken(response.access);
    }
    return response;
  },

  // Logout
  logout: async () => {
    // It's good practice to have a backend endpoint to invalidate tokens
    try {
      await apiClient.post(ENDPOINTS.AUTH.LOGOUT, {});
    } catch (error) {
      console.warn("Could not reach logout endpoint. Clearing token locally.", error);
    } finally {
      // Always remove the token from local storage
      tokenStore.removeTokens();
    }
  },
};

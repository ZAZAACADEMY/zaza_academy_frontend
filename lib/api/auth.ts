import { apiClient } from "./client";
import { ENDPOINTS } from "./endpoints";
import {
  LoginCredentials,
  RegisterData,
  AuthResponse,
  UserProfile,
} from "./types";

export const authService = {
  // Login
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    return apiClient.post<AuthResponse>(ENDPOINTS.AUTH.LOGIN, credentials);
  },

  // Inscription
  register: async (data: RegisterData): Promise<AuthResponse> => {
    return apiClient.post<AuthResponse>(ENDPOINTS.AUTH.REGISTER, data);
  },

  // Récupérer le profil utilisateur actuel
  getCurrentUser: async (): Promise<UserProfile> => {
    return apiClient.get<UserProfile>(ENDPOINTS.AUTH.ME);
  },

  // Refresh token (handled effectively by cookie rotation in proxy or skipped for MVP)
  // For now we keep the signature but it might not be needed client-side
  refreshToken: async (refresh: string): Promise<{ access: string }> => {
    return apiClient.post(ENDPOINTS.AUTH.REFRESH, { refresh });
  },

  // Logout
  logout: async () => {
    return apiClient.post(ENDPOINTS.AUTH.LOGOUT, {});
  },
};

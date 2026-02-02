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
  getCurrentUser: async (token: string): Promise<UserProfile> => {
    return apiClient.get<UserProfile>(ENDPOINTS.AUTH.ME, token);
  },

  // Refresh token (si on utilise JWT standard)
  refreshToken: async (refresh: string): Promise<{ access: string }> => {
    return apiClient.post(ENDPOINTS.AUTH.REFRESH, { refresh });
  },

  // Logout (souvent géré côté client juste en supprimant le token,
  // mais parfois le backend a besoin d'invalider le refresh token)
  logout: async (token?: string) => {
    if (token) {
      return apiClient.post(ENDPOINTS.AUTH.LOGOUT, {}, token);
    }
  },
};

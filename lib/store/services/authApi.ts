import { baseApi } from "./api";
import { tokenStore } from "@/lib/api/tokenStore";
import {
  AuthResponse,
  LoginCredentials,
  RegisterData,
  UserProfile,
} from "@/lib/api/types";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginCredentials>({
      query: (credentials) => ({
        url: "/api/v1/auth/login/",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["User", "Me"],
    }),
    register: builder.mutation<AuthResponse, RegisterData>({
      query: (data) => ({
        url: "/api/v1/auth/register/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    verifyEmail: builder.mutation<{ message: string; user: UserProfile }, { email: string; otp: string }>({
      query: (data) => ({
        url: "/api/v1/auth/verify-email/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User", "Me"],
    }),
    resendOtp: builder.mutation<{ message: string; email: string }, { email: string }>({
      query: (data) => ({
        url: "/api/v1/auth/resend-otp/",
        method: "POST",
        body: data,
      }),
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: "/api/v1/auth/logout/",
        method: "POST",
      }),
      invalidatesTags: ["User", "Me"],
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        // Always remove token even if request fails
        tokenStore.removeTokens();
        try {
          await queryFulfilled;
          dispatch(baseApi.util.resetApiState());
        } catch {
          // Ignore errors
        }
      },
    }),
    getCurrentUser: builder.query<UserProfile, void>({
      query: () => "/api/v1/users/me/",
      providesTags: ["Me"],
    }),
    verify2FA: builder.mutation<AuthResponse, { token: string; otp: string }>({
      query: (data) => ({
        url: "/api/v1/auth/verify-2fa/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User", "Me"],
    }),
    resend2FACode: builder.mutation<{ message: string }, { token: string }>({
      query: (data) => ({
        url: "/api/v1/auth/resend-2fa-code/",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useVerifyEmailMutation,
  useResendOtpMutation,
  useVerify2FAMutation,
  useResend2FACodeMutation,
  useLogoutMutation,
  useGetCurrentUserQuery,
} = authApi;

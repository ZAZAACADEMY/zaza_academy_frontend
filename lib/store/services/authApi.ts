import { baseApi } from "./api";
import { tokenStore } from "@/lib/api/tokenStore";
import { components } from "@/lib/api/v1";

export type UserProfile = components["schemas"]["UserSerializer"];
export type AuthResponse = any // components["schemas"]["AuthResponse"];
export type LoginCredentials = components["schemas"]["Login"];
export type RegisterData = components["schemas"]["Register"];
export type Country = any //  components["schemas"]["Country"];

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
    register: builder.mutation<any, RegisterData>({
      query: (data) => ({
        url: "/api/v1/auth/register/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    verifyEmail: builder.mutation<{ message: string; user: UserProfile }, components["schemas"]["VerifyEmail"]>({
      query: (data) => ({
        url: "/api/v1/auth/verify-email/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User", "Me"],
    }),
    resendOtp: builder.mutation<{ detail: string }, components["schemas"]["ResendOtp"]>({
      query: (data) => ({
        url: "/api/v1/auth/resend-otp/",
        method: "POST",
        body: data,
      }),
    }),
    passwordResetRequest: builder.mutation<{ detail: string }, components["schemas"]["PasswordResetRequest"]>({
      query: (data) => ({
        url: "/api/v1/auth/password/reset/request/",
        method: "POST",
        body: data,
      }),
    }),
    passwordResetVerifyOtp: builder.mutation<{ token: string; detail: string }, components["schemas"]["PasswordResetVerifyOTP"]>({
      query: (data) => ({
        url: "/api/v1/auth/password/reset/verify-otp/",
        method: "POST",
        body: data,
      }),
    }),
    passwordResetConfirm: builder.mutation<{ detail: string }, components["schemas"]["PasswordResetConfirm"]>({
      query: (data) => ({
        url: "/api/v1/auth/password/reset/confirm/",
        method: "POST",
        body: data,
      }),
    }),
    getCountries: builder.query<Country[], void>({
      query: () => "/api/v1/country/",
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
    verify2FA: builder.mutation<AuthResponse, components["schemas"]["Verify2FA"]>({
      query: (data) => ({
        url: "/api/v1/auth/verify-2fa/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User", "Me"],
    }),
    resend2FACode: builder.mutation<{ detail: string }, components["schemas"]["Resend2FACode"]>({
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
  usePasswordResetRequestMutation,
  usePasswordResetVerifyOtpMutation,
  usePasswordResetConfirmMutation,
  useGetCountriesQuery,
  useVerify2FAMutation,
  useResend2FACodeMutation,
  useLogoutMutation,
  useGetCurrentUserQuery,
} = authApi;

import { baseApi } from "./api";
import {
  AuthResponse,
  LoginCredentials,
  RegisterData,
  UserProfile,
  ChildProfile,
} from "@/lib/api/types";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginCredentials>({
      query: (credentials) => ({
        url: "/auth/login/",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["User"],
    }),
    register: builder.mutation<AuthResponse, RegisterData>({
      query: (data) => ({
        url: "/auth/register/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: "/auth/logout/",
        method: "POST",
      }),
      invalidatesTags: ["User"],
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          // Optionally reset state here
          dispatch(baseApi.util.resetApiState());
        } catch {
          // Ignore errors
        }
      },
    }),
    getCurrentUser: builder.query<UserProfile, void>({
      query: () => "/auth/users/me/",
      providesTags: ["User"],
    }),
    addChild: builder.mutation<ChildProfile, Partial<ChildProfile>>({
      query: (child) => ({
        url: "/users/children/",
        method: "POST",
        body: child,
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useGetCurrentUserQuery,
  useAddChildMutation,
} = authApi;

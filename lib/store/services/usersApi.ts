import { baseApi } from "./api";
import { components } from "@/lib/api/v1";

export type UserProfile = components["schemas"]["UserSerializer"];

export const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Endpoint to get the current user's profile
    getMe: builder.query<UserProfile, void>({
      query: () => "/api/v1/users/me/",
      providesTags: ["Me"],
    }),
    
    // Endpoint to update the current user's profile
    updateMe: builder.mutation<UserProfile, Partial<UserProfile>>({
      query: (body) => ({
        url: "/api/v1/users/me/",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Me"],
    }),
  }),
});

export const { useGetMeQuery, useUpdateMeMutation } = usersApi;

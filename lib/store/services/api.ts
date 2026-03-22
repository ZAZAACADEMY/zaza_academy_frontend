import { createApi, fetchBaseQuery, BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store";
import { tokenStore } from "@/lib/api/tokenStore";

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL || "https://api-zaza.promtimal.com/",
  prepareHeaders: (headers) => {
    const token = tokenStore.getToken();
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 403) {
    const refreshToken = tokenStore.getRefreshToken();
    if (refreshToken) {
      // try to get a new token
      const refreshResult = await baseQuery(
        {
          url: "/api/v1/auth/token/refresh/",
          method: "POST",
          body: { refresh: refreshToken },
        },
        api,
        extraOptions
      );

      if (refreshResult.data) {
        // store the new token
        const newAccessToken = (refreshResult.data as { access: string }).access;
        tokenStore.setToken(newAccessToken);
        // retry the initial query
        result = await baseQuery(args, api, extraOptions);
      } else {
        // Refresh failed - logout user
        tokenStore.removeTokens();
        // window.location.href = '/login'; // Optional: Redirect to login
      }
    } else {
      tokenStore.removeTokens();
    }
  }
  return result;
};

// Define a service using a base URL and expected endpoints
export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "User", 
    "Me",
    "Children", 
    "Plans", 
    "Subscriptions", 
    "Payments", 
    "Videos", 
    "Lives",
    "Stats"
  ],
  endpoints: () => ({}), // Endpoints are injected from other files
});

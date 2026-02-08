import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define a service using a base URL and expected endpoints
export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api",
    prepareHeaders: (headers) => {
      // Since we use HttpOnly cookies, the browser handles the token automatically.
      // We only need to set content-type if not already set.
      return headers;
    },
  }),
  tagTypes: ["User"],
  endpoints: () => ({}), // Code splitting: endpoints will be injected in feature files
});

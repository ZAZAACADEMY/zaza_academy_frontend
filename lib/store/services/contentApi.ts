import { baseApi } from "./api";
import { components } from "@/lib/api/v1";

type Video = components["schemas"]["VideoDetail"];
type PaginatedVideoList = components["schemas"]["PaginatedVideoListList"];
type Live = components["schemas"]["LiveDetail"];
type PaginatedLiveList = components["schemas"]["PaginatedLiveListList"];

export const contentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Video Endpoints
    getVideos: builder.query<PaginatedVideoList, void>({
      query: () => "/api/videos/published",
      providesTags: (result) =>
        result
          ? [
              ...result.results.map(({ id }) => ({ type: "Videos" as const, id })),
              { type: "Videos", id: "LIST" },
            ]
          : [{ type: "Videos", id: "LIST" }],
    }),
    getVideoById: builder.query<Video, string>({
      query: (id) => `/api/videos/${id}`,
      providesTags: (result, error, id) => [{ type: "Videos", id }],
    }),

    // Live Session Endpoints
    getLives: builder.query<PaginatedLiveList, void>({
        query: () => "/api/lives",
        providesTags: (result) =>
          result
            ? [
                ...result.results.map(({ id }) => ({ type: "Lives" as const, id })),
                { type: "Lives", id: "LIST" },
              ]
            : [{ type: "Lives", id: "LIST" }],
      }),
    getUpcomingLives: builder.query<PaginatedLiveList, void>({
      query: () => "/api/lives/upcoming",
      providesTags: [{ type: "Lives", id: "UPCOMING_LIST" }],
    }),
    getPastLives: builder.query<PaginatedLiveList, void>({
      query: () => "/api/lives/past",
      providesTags: [{ type: "Lives", id: "PAST_LIST" }],
    }),
    getLiveById: builder.query<Live, string>({
      query: (id) => `/api/lives/${id}`,
      providesTags: (result, error, id) => [{ type: "Lives", id }],
    }),
  }),
});

export const {
    useGetVideosQuery,
    useGetVideoByIdQuery,
    useGetLivesQuery,
    useGetUpcomingLivesQuery,
    useGetPastLivesQuery,
    useGetLiveByIdQuery,
} = contentApi;

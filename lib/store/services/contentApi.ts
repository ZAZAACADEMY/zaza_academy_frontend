import { baseApi } from "./api";
import { components } from "@/lib/api/v1";

type Video = components["schemas"]["VideoDetail"];
type VideoList = components["schemas"]["VideoList"];
type VideoCreateUpdate = components["schemas"]["VideoCreateUpdate"];
type PatchedVideoCreateUpdate = components["schemas"]["PatchedVideoCreateUpdate"];
type PaginatedVideoList = components["schemas"]["PaginatedVideoListList"];

type Live = components["schemas"]["LiveDetail"];
type LiveList = components["schemas"]["LiveList"];
type LiveCreateUpdate = components["schemas"]["LiveCreateUpdate"];
type PatchedLiveCreateUpdate = components["schemas"]["PatchedLiveCreateUpdate"];
type PaginatedLiveList = components["schemas"]["PaginatedLiveListList"];

export const contentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Video Endpoints
    getVideos: builder.query<PaginatedVideoList, { age_group?: string; category?: string; search?: string; page?: number } | void>({
      query: (params) => ({
        url: "/api/videos",
        params: params || {},
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.results.map(({ id }) => ({ type: "Videos" as const, id })),
              { type: "Videos", id: "LIST" },
            ]
          : [{ type: "Videos", id: "LIST" }],
    }),
    getPublishedVideos: builder.query<PaginatedVideoList, void>({
      query: () => "/api/videos/published",
      providesTags: [{ type: "Videos", id: "PUBLISHED_LIST" }],
    }),
    getVideoById: builder.query<Video, string>({
      query: (id) => `/api/videos/${id}`,
      providesTags: (result, error, id) => [{ type: "Videos", id }],
    }),
    createVideo: builder.mutation<Video, VideoCreateUpdate>({
      query: (body) => ({
        url: "/api/videos",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Videos", id: "LIST" }, { type: "Videos", id: "PUBLISHED_LIST" }],
    }),
    updateVideo: builder.mutation<Video, { id: string; body: VideoCreateUpdate }>({
      query: ({ id, body }) => ({
        url: `/api/videos/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Videos", id }, { type: "Videos", id: "LIST" }],
    }),
    partialUpdateVideo: builder.mutation<Video, { id: string; body: PatchedVideoCreateUpdate }>({
      query: ({ id, body }) => ({
        url: `/api/videos/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Videos", id }, { type: "Videos", id: "LIST" }],
    }),
    deleteVideo: builder.mutation<void, string>({
      query: (id) => ({
        url: `/api/videos/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Videos", id }, { type: "Videos", id: "LIST" }],
    }),

    // Live Session Endpoints
    getLives: builder.query<PaginatedLiveList, { age_group?: string; status?: string; search?: string; page?: number } | void>({
        query: (params) => ({
          url: "/api/lives",
          params: params || {},
        }),
        providesTags: (result) =>
          result
            ? [
                ...result.results.map(({ id }) => ({ type: "Lives" as const, id })),
                { type: "Lives", id: "LIST" },
              ]
            : [{ type: "Lives", id: "LIST" }],
      }),
    getCurrentLives: builder.query<PaginatedLiveList, void>({
      query: () => "/api/lives/current",
      providesTags: [{ type: "Lives", id: "CURRENT_LIST" }],
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
    createLive: builder.mutation<Live, LiveCreateUpdate>({
      query: (body) => ({
        url: "/api/lives",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Lives", id: "LIST" }, { type: "Lives", id: "UPCOMING_LIST" }],
    }),
    updateLive: builder.mutation<Live, { id: string; body: LiveCreateUpdate }>({
      query: ({ id, body }) => ({
        url: `/api/lives/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Lives", id }, { type: "Lives", id: "LIST" }],
    }),
    partialUpdateLive: builder.mutation<Live, { id: string; body: PatchedLiveCreateUpdate }>({
      query: ({ id, body }) => ({
        url: `/api/lives/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Lives", id }, { type: "Lives", id: "LIST" }],
    }),
    deleteLive: builder.mutation<void, string>({
      query: (id) => ({
        url: `/api/lives/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Lives", id }, { type: "Lives", id: "LIST" }],
    }),
  }),
});

export const {
    useGetVideosQuery,
    useGetPublishedVideosQuery,
    useGetVideoByIdQuery,
    useCreateVideoMutation,
    useUpdateVideoMutation,
    usePartialUpdateVideoMutation,
    useDeleteVideoMutation,
    useGetLivesQuery,
    useGetCurrentLivesQuery,
    useGetUpcomingLivesQuery,
    useGetPastLivesQuery,
    useGetLiveByIdQuery,
    useCreateLiveMutation,
    useUpdateLiveMutation,
    usePartialUpdateLiveMutation,
    useDeleteLiveMutation,
} = contentApi;

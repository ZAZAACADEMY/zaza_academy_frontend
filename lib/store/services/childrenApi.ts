import { baseApi } from "./api";
import { components } from "@/lib/api/v1";

export type Child = components["schemas"]["Child"];
export type PatchedChild = components["schemas"]["PatchedChild"];

export const childrenApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Endpoint to list all children for the current user
    listChildren: builder.query<Child[], void>({
      query: () => "/api/v1/children",
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Children" as const, id })),
              { type: "Children", id: "LIST" },
            ]
          : [{ type: "Children", id: "LIST" }],
    }),

    // Endpoint to get a single child profile
    getChildById: builder.query<Child, string>({
      query: (id) => `/api/v1/children/${id}`,
      providesTags: (result, error, id) => [{ type: "Children", id }],
    }),

    // Endpoint to add a new child
    addChild: builder.mutation<Child, Child>({
      query: (body) => ({
        url: "/api/v1/children",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Children", id: "LIST" }],
    }),

    // Endpoint to update a child (full update)
    updateChild: builder.mutation<Child, { id: string; body: Child }>({
      query: ({ id, body }) => ({
        url: `/api/v1/children/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Children", id },
        { type: "Children", id: "LIST" },
      ],
    }),

    // Endpoint to partially update a child
    partialUpdateChild: builder.mutation<
      Child,
      { id: string; body: PatchedChild }
    >({
      query: ({ id, body }) => ({
        url: `/api/v1/children/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Children", id },
        { type: "Children", id: "LIST" },
      ],
    }),

    // Endpoint to delete a child
    deleteChild: builder.mutation<void, string>({
      query: (id) => ({
        url: `/api/v1/children/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Children", id },
        { type: "Children", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useListChildrenQuery,
  useGetChildByIdQuery,
  useAddChildMutation,
  useUpdateChildMutation,
  usePartialUpdateChildMutation,
  useDeleteChildMutation,
} = childrenApi;

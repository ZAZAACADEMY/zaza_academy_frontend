import { baseApi } from "./api";
import { components } from "@/lib/api/v1";

type Child = components["schemas"]["ChildSerializer"];
type ChildCreate = components["schemas"]["ChildCreateSerializer"];

export const childrenApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Endpoint to list all children for the current user
    listChildren: builder.query<Child[], void>({
      query: () => "/api/v1/children/",
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Children" as const, id })),
              { type: "Children", id: "LIST" },
            ]
          : [{ type: "Children", id: "LIST" }],
    }),
    
    // Endpoint to add a new child
    addChild: builder.mutation<Child, ChildCreate>({
      query: (body) => ({
        url: "/api/v1/children/",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Children", id: "LIST" }],
    }),

    // Endpoint to update a child
    updateChild: builder.mutation<Child, { id: string; body: Partial<ChildCreate> }>({
      query: ({ id, body }) => ({
        url: `/api/v1/children/${id}/`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Children", id }],
    }),

    // Endpoint to delete a child
    deleteChild: builder.mutation<{ success: boolean; id: string }, string>({
        query: (id) => ({
            url: `/api/v1/children/${id}/`,
            method: 'DELETE',
        }),
        invalidatesTags: (result, error, id) => [{ type: 'Children', id }, { type: "Children", id: "LIST" }],
    }),
  }),
});

export const { 
    useListChildrenQuery,
    useAddChildMutation,
    useUpdateChildMutation,
    useDeleteChildMutation,
} = childrenApi;

import { baseApi } from "./api";
import { components } from "@/lib/api/v1";

type Plan = components["schemas"]["PlanDetail"];
type PlanList = components["schemas"]["PlanList"][];
type PlanCreateUpdate = components["schemas"]["PlanCreateUpdate"];
type PatchedPlanCreateUpdate = components["schemas"]["PatchedPlanCreateUpdate"];
type PaginatedPlanList = components["schemas"]["PaginatedPlanListList"];

export const plansApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Endpoint to get all subscription plans
    getPlans: builder.query<PaginatedPlanList, { status?: boolean; name?: string; page?: number } | void>({
      query: (params) => ({
        url: "/api/v1/plans",
        params: params || {},
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.results.map(({ id }) => ({ type: "Plans" as const, id })),
              { type: "Plans", id: "LIST" },
            ]
          : [{ type: "Plans", id: "LIST" }],
    }),

    // Endpoint to get only active subscription plans
    getActivePlans: builder.query<PlanList, void>({
      query: () => "/api/v1/plans/active_plans",
       providesTags: [{ type: "Plans", id: "ACTIVE_LIST" }],
    }),

    // Endpoint to get a single plan by ID
    getPlanById: builder.query<Plan, string>({
      query: (id) => `/api/v1/plans/${id}`,
      providesTags: (result, error, id) => [{ type: "Plans", id }],
    }),

    // Admin management endpoints
    createPlan: builder.mutation<Plan, PlanCreateUpdate>({
      query: (body) => ({
        url: "/api/v1/plans",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Plans", id: "LIST" }, { type: "Plans", id: "ACTIVE_LIST" }],
    }),
    updatePlan: builder.mutation<Plan, { id: string; body: PlanCreateUpdate }>({
      query: ({ id, body }) => ({
        url: `/api/v1/plans/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Plans", id }, { type: "Plans", id: "LIST" }],
    }),
    partialUpdatePlan: builder.mutation<Plan, { id: string; body: PatchedPlanCreateUpdate }>({
      query: ({ id, body }) => ({
        url: `/api/v1/plans/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Plans", id }, { type: "Plans", id: "LIST" }],
    }),
    deletePlan: builder.mutation<void, string>({
      query: (id) => ({
        url: `/api/v1/plans/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Plans", id }, { type: "Plans", id: "LIST" }],
    }),
  }),
});

export const { 
    useGetPlansQuery,
    useGetActivePlansQuery,
    useGetPlanByIdQuery,
    useCreatePlanMutation,
    useUpdatePlanMutation,
    usePartialUpdatePlanMutation,
    useDeletePlanMutation,
} = plansApi;

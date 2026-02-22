import { baseApi } from "./api";
import { components } from "@/lib/api/v1";

type Plan = components["schemas"]["PlanDetail"];
// type PaginatedPlanList = components["schemas"]["PaginatedPlanListList"];
type PlanList = Array<components["schemas"]["PlanDetail"]>;

export const plansApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Endpoint to get all subscription plans
    getPlans: builder.query<PlanList, void>({
      query: () => "/api/plans",
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Plans" as const, id })),
              { type: "Plans", id: "LIST" },
            ]
          : [{ type: "Plans", id: "LIST" }],
    }),

    // Endpoint to get only active subscription plans
    getActivePlans: builder.query<PlanList, void>({
      query: () => "/api/plans/active_plans",
       providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Plans" as const, id })),
              { type: "Plans", id: "LIST" },
            ]
          : [{ type: "Plans", id: "LIST" }],
    }),

    // Endpoint to get a single plan by ID
    getPlanById: builder.query<Plan, string>({
      query: (id) => `/api/plans/${id}`,
      providesTags: (result, error, id) => [{ type: "Plans", id }],
    }),
  }),
});

export const { 
    useGetPlansQuery,
    useGetActivePlansQuery,
    useGetPlanByIdQuery,
} = plansApi;

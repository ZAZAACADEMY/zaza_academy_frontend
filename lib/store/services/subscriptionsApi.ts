import { baseApi } from "./api";
import { components } from "@/lib/api/v1";

type Subscription = components["schemas"]["SubscriptionDetail"];
type SubscriptionList = components["schemas"]["SubscriptionList"];
type SubscriptionCreate = components["schemas"]["SubscriptionCreate"];
type PatchedSubscriptionDetail = components["schemas"]["PatchedSubscriptionDetail"];
type PaginatedSubscriptionList = components["schemas"]["PaginatedSubscriptionListList"];

export const subscriptionsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Endpoint to list all subscriptions (admin only)
    listSubscriptions: builder.query<PaginatedSubscriptionList, { status?: string; plan?: string; page?: number } | void>({
      query: (params) => ({
        url: "/api/subscriptions",
        params: params || {},
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.results.map(({ id }) => ({ type: "Subscriptions" as const, id })),
              { type: "Subscriptions", id: "LIST" },
            ]
          : [{ type: "Subscriptions", id: "LIST" }],
    }),

    // Endpoint to create a new subscription
    createSubscription: builder.mutation<Subscription, SubscriptionCreate>({
      query: (body) => ({
        url: "/api/subscriptions",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Subscriptions", id: "LIST" }, { type: "Subscriptions", id: "MY_LIST" }],
    }),

    // Endpoint to get the current user's subscriptions
    getMySubscriptions: builder.query<PaginatedSubscriptionList, void>({
      query: () => "/api/subscriptions/my_subscriptions",
      providesTags: [{ type: "Subscriptions", id: "MY_LIST" }],
    }),

    // Endpoint to get the current user's active subscriptions
    getMyActiveSubscriptions: builder.query<Subscription, void>({
      query: () => "/api/subscriptions/my_active_subscriptions",
      providesTags: [{ type: "Subscriptions", id: "MY_ACTIVE" }],
    }),

    // Endpoint to get a single subscription by ID
    getSubscriptionById: builder.query<Subscription, string>({
      query: (id) => `/api/subscriptions/${id}`,
      providesTags: (result, error, id) => [{ type: "Subscriptions", id }],
    }),

    // Management endpoints
    updateSubscription: builder.mutation<Subscription, { id: string; body: Subscription }>({
      query: ({ id, body }) => ({
        url: `/api/subscriptions/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Subscriptions", id }, { type: "Subscriptions", id: "LIST" }],
    }),
    partialUpdateSubscription: builder.mutation<Subscription, { id: string; body: PatchedSubscriptionDetail }>({
      query: ({ id, body }) => ({
        url: `/api/subscriptions/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Subscriptions", id }, { type: "Subscriptions", id: "LIST" }],
    }),
    deleteSubscription: builder.mutation<void, string>({
      query: (id) => ({
        url: `/api/subscriptions/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Subscriptions", id }, { type: "Subscriptions", id: "LIST" }],
    }),
  }),
});

export const {
    useListSubscriptionsQuery,
    useCreateSubscriptionMutation,
    useGetMySubscriptionsQuery,
    useGetMyActiveSubscriptionsQuery,
    useGetSubscriptionByIdQuery,
    useUpdateSubscriptionMutation,
    usePartialUpdateSubscriptionMutation,
    useDeleteSubscriptionMutation,
} = subscriptionsApi;

import { baseApi } from "./api";
import { components } from "@/lib/api/v1";

type Subscription = components["schemas"]["SubscriptionDetail"];
type SubscriptionCreate = components["schemas"]["SubscriptionCreate"];
type PaginatedSubscriptionList = components["schemas"]["PaginatedSubscriptionListList"];

export const subscriptionsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Endpoint to create a new subscription
    createSubscription: builder.mutation<Subscription, SubscriptionCreate>({
      query: (body) => ({
        url: "/api/subscriptions",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Subscriptions", id: "LIST" }],
    }),

    // Endpoint to get the current user's subscriptions
    getMySubscriptions: builder.query<PaginatedSubscriptionList, void>({
      query: () => "/api/subscriptions/my_subscriptions",
      providesTags: (result) =>
        result
          ? [
              ...result.results.map(({ id }) => ({ type: "Subscriptions" as const, id })),
              { type: "Subscriptions", id: "LIST" },
            ]
          : [{ type: "Subscriptions", id: "LIST" }],
    }),

    // Endpoint to get a single subscription by ID
    getSubscriptionById: builder.query<Subscription, string>({
      query: (id) => `/api/subscriptions/${id}`,
      providesTags: (result, error, id) => [{ type: "Subscriptions", id }],
    }),
  }),
});

export const {
    useCreateSubscriptionMutation,
    useGetMySubscriptionsQuery,
    useGetSubscriptionByIdQuery,
} = subscriptionsApi;

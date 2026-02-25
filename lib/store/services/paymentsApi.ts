import { baseApi } from "./api";
import { components } from "@/lib/api/v1";

type Payment = components["schemas"]["PaymentDetail"];
type PaymentList = components["schemas"]["PaymentList"];
type PaymentInitiate = components["schemas"]["PaymentInitiate"];
type PaginatedPaymentList = components["schemas"]["PaginatedPaymentListList"];

export interface InitiatePaymentResponse extends Payment {
  payment_data?: {
    checkout_url: string;
    session_id: string;
    payment_method: string;
  };
}

export const paymentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Endpoint to list all payments (admin only)
    listPayments: builder.query<PaginatedPaymentList, { status?: string; method?: string; page?: number } | void>({
      query: (params) => ({
        url: "/api/payments",
        params: params || {},
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.results.map(({ id }) => ({ type: "Payments" as const, id })),
              { type: "Payments", id: "LIST" },
            ]
          : [{ type: "Payments", id: "LIST" }],
    }),

    // Endpoint to initiate a new payment
    initiatePayment: builder.mutation<InitiatePaymentResponse, PaymentInitiate>({
      query: (body) => ({
        url: "/api/payments/initiate",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Payments", id: "LIST" }],
    }),

    // Endpoint to get the current user's payment history
    getMyPayments: builder.query<PaginatedPaymentList, void>({
      query: () => "/api/payments/my_payments",
      providesTags: (result) =>
        result
          ? [
              ...result.results.map(({ id }) => ({ type: "Payments" as const, id })),
              { type: "Payments", id: "MY_LIST" },
            ]
          : [{ type: "Payments", id: "MY_LIST" }],
    }),

    // Endpoint to get a single payment by ID
    getPaymentById: builder.query<Payment, string>({
      query: (id) => `/api/payments/${id}`,
      providesTags: (result, error, id) => [{ type: "Payments", id }],
    }),
  }),
});

export const {
    useListPaymentsQuery,
    useInitiatePaymentMutation,
    useGetMyPaymentsQuery,
    useGetPaymentByIdQuery,
} = paymentsApi;

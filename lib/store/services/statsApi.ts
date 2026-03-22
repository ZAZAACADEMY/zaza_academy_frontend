import { baseApi } from "./api";

export interface KpiParams {
  age_group?: string;
  country_code?: string;
  start_date?: string;
  end_date?: string;
  period?: "day" | "week" | "month" | "year";
  plan_id?: string;
}

export const statsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAgeRangeStats: builder.query<any[], KpiParams | void>({
      query: (params) => ({
        url: "/api/v1/kpi/dashboard/age-range-stats/",
        params: params || {},
      }),
      providesTags: ["Stats"],
    }),
    getGrowthMetrics: builder.query<any, { compare_period?: "week" | "month" | "year" } | void>({
      query: (params) => ({
        url: "/api/v1/kpi/dashboard/growth-metrics/",
        params: params || {},
      }),
      providesTags: ["Stats"],
    }),
    getRegistrationStats: builder.query<any[], KpiParams | void>({
      query: (params) => ({
        url: "/api/v1/kpi/dashboard/registration-stats/",
        params: params || {},
      }),
      providesTags: ["Stats"],
    }),
    getRevenueStats: builder.query<any[], KpiParams | void>({
      query: (params) => ({
        url: "/api/v1/kpi/dashboard/revenue-stats/",
        params: params || {},
      }),
      providesTags: ["Stats"],
    }),
    getGlobalStats: builder.query<any, { period?: "week" | "month" | "year" } | void>({
      query: (params) => ({
        url: "/api/v1/kpi/dashboard/stats/",
        params: params || {},
      }),
      providesTags: ["Stats"],
    }),
    getTopCountries: builder.query<any[], KpiParams | void>({
      query: (params) => ({
        url: "/api/v1/kpi/dashboard/top-countries/",
        params: params || {},
      }),
      providesTags: ["Stats"],
    }),
    getLiveStats: builder.query<any, void>({
      query: () => "/api/v1/kpi/lives/stats/",
      providesTags: ["Stats"],
    }),
    getPaymentAnalytics: builder.query<any[], KpiParams | void>({
      query: (params) => ({
        url: "/api/v1/kpi/payments/analytics/",
        params: params || {},
      }),
      providesTags: ["Stats"],
    }),
    getPaymentMethodStats: builder.query<any[], KpiParams | void>({
      query: (params) => ({
        url: "/api/v1/kpi/payments/method-stats/",
        params: params || {},
      }),
      providesTags: ["Stats"],
    }),
    getSubscriptionStats: builder.query<any, void>({
      query: () => "/api/v1/kpi/subscriptions/stats/",
      providesTags: ["Stats"],
    }),
    getVideoStats: builder.query<any, void>({
      query: () => "/api/v1/kpi/videos/stats/",
      providesTags: ["Stats"],
    }),
  }),
});

export const {
  useGetAgeRangeStatsQuery,
  useGetGrowthMetricsQuery,
  useGetRegistrationStatsQuery,
  useGetRevenueStatsQuery,
  useGetGlobalStatsQuery,
  useGetTopCountriesQuery,
  useGetLiveStatsQuery,
  useGetPaymentAnalyticsQuery,
  useGetPaymentMethodStatsQuery,
  useGetSubscriptionStatsQuery,
  useGetVideoStatsQuery,
} = statsApi;

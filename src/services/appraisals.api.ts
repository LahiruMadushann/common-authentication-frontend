import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const appraisalsApi = createApi({
  reducerPath: "appraisalsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_ENDPOINT}`,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Appraisals", "Shops","FilterAppraisals"],
  endpoints: (builder) => ({
    getAppraisals: builder.query({
      query: (appraisalsQueryParams) => ({
        url: `/appraisal`,
        method: "GET",
        params: {
            ...appraisalsQueryParams
        },
      }),
      providesTags: [{ type: "Appraisals" }],
    }),
    getAllShops: builder.query({
      query: () => ({
        url: `/shop`,
        method: "GET",
      }),
      providesTags: [{ type: "Shops" }],
    }),
    getFilterAppraisals: builder.query({
      query: (appraisalsQueryParams) => ({
        url: `/appraisal/filter`,
        method: "GET",
        params: {
            ...appraisalsQueryParams
        },
      }),
      providesTags: [{ type: "FilterAppraisals" }],
    }),
  }),
});

export const { useGetAppraisalsQuery, useLazyGetAppraisalsQuery, useGetAllShopsQuery, useLazyGetFilterAppraisalsQuery } =
  appraisalsApi;

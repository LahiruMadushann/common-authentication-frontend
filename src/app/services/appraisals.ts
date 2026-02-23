import { AppraisalListResponse } from '@/src/types/aprisialsFilterTypes';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const appraisalsApi = createApi({
  reducerPath: 'appraisalsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_ENDPOINT}`,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    }
  }),
  tagTypes: ['Appraisals', 'Shops'],
  endpoints: (builder) => ({
    //Todo : this should change after backend completed
    getAppraisals: builder.query<AppraisalListResponse, any>({
      query: (appraisalsQueryParams) => ({
        url: `/appraisal`,
        method: 'GET',
        params: {
          ...appraisalsQueryParams
        }
      }),
      providesTags: [{ type: 'Appraisals' }]
    }),
    getAllShops: builder.query<any, any>({
      query: () => ({
        url: `/shop`,
        method: 'GET'
      }),
      providesTags: [{ type: 'Shops' }]
    })
  })
});

export const { useGetAppraisalsQuery, useLazyGetAppraisalsQuery, useGetAllShopsQuery } =
  appraisalsApi;

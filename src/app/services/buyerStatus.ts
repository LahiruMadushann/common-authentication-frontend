import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

type BuyerStatusResponse = {
  status: 'success' | 'error';
  message: string;
  updatedCount?: number;
  updatedEntries?: any[];
  error?: string;
};

export const buyerStatusApi = createApi({
  reducerPath: 'buyerStatusApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_ENDPOINT_V2}`,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    }
  }),
  endpoints: (builder) => ({
    updateBuyerStatus: builder.mutation<
      BuyerStatusResponse,
      { userId: number; appraisalId: number; status: string }
    >({
      query: ({ userId, appraisalId, status }) => ({
        url: '/buyer/status/update',
        method: 'PUT',
        params: { userId, appraisalId, status },
      }),
    }),
  }),
});

export const { useUpdateBuyerStatusMutation } = buyerStatusApi;
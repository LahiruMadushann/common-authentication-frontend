import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface Memo {
  id?: number;
  memoText: string;
}
const isUserId = true;

export interface AssessedData {
  appraisalid: number;
  shopid: number;
  email_sent_time: string | null;
  draft_email_sent_time: string | null;
  is_rejected_by_shop: boolean;
  assessedEx: string;
  updatedAt: string;
  status: string;
  value: number | null;
  supplementary: string | null;
  memos: Memo[];
}

export const memoApi = createApi({
  reducerPath: 'memoApi',
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
  tagTypes: ['Memo'],
  endpoints: (builder) => ({
    getMemos: builder.query<AssessedData, { appraisalId: number; userId: number }>({
        query: ({ appraisalId, userId }) => ({
          url: `/assessed/`,
          params: {
            appraisalId,
            userId,
          },
        }),
        providesTags: ['Memo'],
      }),
      
    createMemo: builder.mutation<Memo, { appraisalId: number; shopId: number; memoText: string }>({
      query: ({ appraisalId, shopId, memoText }) => ({
        url: `/assessed/memo/${appraisalId}/${shopId}`,
        method: 'POST',
        params: {
          isUserId,
        },
        body: { memoText },
      }),
      invalidatesTags: ['Memo'],
    }),
    updateMemo: builder.mutation<Memo, { appraisalId: number; shopId: number; memoId: string; memoText: string; id: number }>({
      query: ({ appraisalId, shopId, memoId, memoText, id }) => ({
        url: `/assessed/memo/${appraisalId}/${shopId}/${memoId}`,
        method: 'PUT',
        params: {
          isUserId,
        },
        body: { id, memoText },
      }),
      invalidatesTags: ['Memo'],
    }),
    deleteMemo: builder.mutation<void, { appraisalId: number; shopId: number; memoId: string }>({
      query: ({ appraisalId, shopId, memoId }) => ({
        url: `/assessed/memo/${appraisalId}/${shopId}/${memoId}`,
        method: 'DELETE',
        params: {
          isUserId,
        },
      }),
      invalidatesTags: ['Memo'],
    }),
  }),
});

export const {
  useGetMemosQuery,
  useCreateMemoMutation,
  useUpdateMemoMutation,
  useDeleteMemoMutation,
} = memoApi;
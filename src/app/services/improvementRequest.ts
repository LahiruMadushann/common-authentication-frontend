import { improvementRequestGetModel } from '@/src/types/ImprovementRequestGetModel';
import { improvementRequestPostModel } from '@/src/types/improvementRequestPostModel';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const improvementRequestApi = createApi({
  reducerPath: 'improvementRequestApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_ENDPOINT_V2,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    }
  }),
  tagTypes: ['ImprovementRequest'],
  endpoints: (builder) => ({
    createImprovementRequest: builder.mutation<improvementRequestGetModel, improvementRequestPostModel>(
      {
        query: (improvementRequestPostDTO) => ({
          url: '/improvementRequest',
          method: 'POST',
          body: improvementRequestPostDTO
        }),
        invalidatesTags: ['ImprovementRequest']
      }
    ),

    getImprovementRequestById: builder.query<improvementRequestGetModel, number>({
      query: (id) => `/improvementRequest/${id}`,
      providesTags: ['ImprovementRequest']
    }),

    deleteImprovementRequest: builder.mutation<void, number>({
      query: (id) => ({
        url: `/improvementRequest/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['ImprovementRequest']
    })
  })
});

export const {
  useCreateImprovementRequestMutation,
  useGetImprovementRequestByIdQuery,
  useDeleteImprovementRequestMutation
} = improvementRequestApi;

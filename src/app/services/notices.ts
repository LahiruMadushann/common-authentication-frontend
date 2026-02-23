import { NoticeParamsType, NoticesResponseType, NoticeType } from '@/src/types/notice.type';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const noticesApi = createApi({
  reducerPath: 'noticesApi',
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
  tagTypes: ['Notices', 'NoticesById'],
  endpoints: (builder) => ({
    getNotices: builder.query<NoticesResponseType, NoticeParamsType>({
      query: (params) => ({
        url: `/notice`,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        params: {
          ...params
        }
      }),
      providesTags: [{ type: 'Notices' }]
    }),
    getNoticeById: builder.query<NoticeType, NoticeType>({
      query: ({ id }) => ({
        url: `/notice/${id}`,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }),
      providesTags: [{ type: 'NoticesById' }]
    })
  })
});

export const { useGetNoticesQuery, useLazyGetNoticesQuery, useLazyGetNoticeByIdQuery } = noticesApi;

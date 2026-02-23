import { MessageRequest, MessageRequestType } from '@/src/types/messageType';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const messageApi = createApi({
  reducerPath: 'messageApi',
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
  tagTypes: ['GetMessage', 'SendMessage','GetBuyer', 'GetSeller'],
  endpoints: (builder) => ({
    getMessage: builder.query<MessageRequest[], number>({
      query: (id) => ({
        url: `/message/receiver/${id}`,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }),
      providesTags: [{ type: 'GetMessage' }]
    }),
    sendMessage: builder.query<MessageRequest[], MessageRequestType>({
      query: ({ senderId, receiverId, content, fileUrl, fileName, fileType }) => ({
        url: `/message/send`,
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: {
          senderId: senderId,
          receiverId: receiverId,
          content: content,
          fileUrl: fileUrl,
          fileName: fileName,
          fileType: fileType
        }
      }),
      providesTags: [{ type: 'SendMessage' }]
    }),
    getBuyer: builder.query<number, number>({
      query: (shopid) => ({
        url: `/message/buyer`,
        method: 'GET',
        params: { shopid },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }),
      providesTags: [{ type: 'GetBuyer' }]
    }),
    getSeller: builder.query<number, number>({
      query: (appraisalId) => ({
        url: `/message/seller`,
        method: 'GET',
        params: { appraisalId },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }),
      providesTags: [{ type: 'GetSeller' }]
    })
  })
});

export const { useLazyGetMessageQuery, useLazySendMessageQuery, useGetBuyerQuery, useGetSellerQuery } = messageApi;

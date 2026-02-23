import { UpdateResponse } from '@/src/layouts/user/assestment-request';
import { AppraisalRequestInformation } from '@/src/types/appraisal';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const appraisalApi = createApi({
  reducerPath: 'appraisalApi',
  baseQuery: fetchBaseQuery({ baseUrl: process.env.REACT_APP_ENDPOINT }),
  tagTypes: ['GetAppraisal'],
  endpoints: (builder) => ({
    getAppraisal: builder.query<AppraisalRequestInformation[], number>({
      query: (userId) => ({
        url: `/appraisal/information`,
        method: 'GET',
        params: {
          userId: userId
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }),
      providesTags: [{ type: 'GetAppraisal' }]
    }),
    updateAppraisal: builder.mutation<UpdateResponse, AppraisalRequestInformation>({
      query: (appraisalRequest) => ({
        url: `/appraisal/information/update`,
        method: 'PUT',
        body: appraisalRequest,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
    })
  })
});

export const { useLazyGetAppraisalQuery ,useUpdateAppraisalMutation } = appraisalApi;

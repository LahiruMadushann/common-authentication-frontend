import { AppraisalStatus } from '@/src/types/appraisalStatus';
import { AssessedModel } from '@/src/types/assessedModel';
import { UserRejectBodyDto } from '@/src/types/userReject';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const rejectAppraisalApi = createApi({
  reducerPath: 'rejectAppraisalApi',
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
  tagTypes: ['RejectAppraisal'],
  endpoints: (builder) => ({
    updateRejectAssessedStatus: builder.mutation<
      AssessedModel[],
      {
        userRejectBody: UserRejectBodyDto;
        appraisalId: number;
        userId: number;
        status: AppraisalStatus;
      }
    >({
      query: ({ userRejectBody, appraisalId, userId, status }) => ({
        url: `/reject/appraisal/user/${appraisalId}/${userId}`,
        method: 'PUT',
        body: userRejectBody,
        params: { status }
      }),
      invalidatesTags: ['RejectAppraisal']
    }),
    getRejectAssessedStatus: builder.query<
      AssessedModel[],
      { appraisalId: number; userId: number }
    >({
      query: ({ appraisalId, userId }) => `/reject/appraisal/user/${appraisalId}/${userId}`,
      providesTags: ['RejectAppraisal']
    })
  })
});

export const { 
  useUpdateRejectAssessedStatusMutation, 
  useGetRejectAssessedStatusQuery 
} = rejectAppraisalApi;
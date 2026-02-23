import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

type AssessedPreviewDto = {
  appraisalid: number;
  userId: number;
  shopId: number;
  email_sent_time: string | null;
  draft_email_sent_time: string;
  is_rejected_by_shop: boolean;
  assessedEx: string;
  updatedAt: string;
  status: string | null;
  value: number | null;
  reasonForEditPriceBuyer: string | null;
  reasonForEditPriceSeller: string | null;
  supplementary: string | null;
  memos: { memoText: string }[];
  starValue: number;
  starSupport: number;
  starRecommendation: number;
  soldToBuyer: boolean | null;
  review: string | null;
  finalOffer?: number;
  torePurchaseDateTime?: string | null;
  storePurchaseDateTime?: string | null;
  userPurchaseDateTime?: string | null;
};

type UpdateAssessedRequest = {
  appraisalId: number;
  userId?: number;
  shopId?: number;
  value?: number;
  supplementary?: string;
  is_rejected_by_shop?: boolean;
  reasonForEditPriceBuyer?: string;
  storePurchaseDateTime?: string;
  patch?: {
    starValue: number;
    starSupport: number;
    starRecommendation: number;
    finalOffer?: number;
    soldToBuyer: boolean;
    review: string;
    reasonForEditPriceSeller?: string;
  };
};

export const assessedApi = createApi({
  reducerPath: 'assessedApi',
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
    getAssessed: builder.query<AssessedPreviewDto, { appraisalId: number; userId: number }>({
      query: ({ appraisalId, userId }) => ({
        url: '/assessed/',
        params: { appraisalId, userId }
      })
    }),
    getAssessedByUser: builder.query<AssessedPreviewDto, { appraisalId: number; shopId: number }>({
      query: ({ appraisalId, shopId }) => ({
        url: '/assessed/',
        params: { appraisalId, shopId }
      })
    }),
    updateAssessed: builder.mutation<AssessedPreviewDto, UpdateAssessedRequest>({
      query: ({ appraisalId, userId, shopId, ...patch }) => ({
        url: '/assessed/',
        method: 'PATCH',
        params: userId ? { appraisalId, userId } : { appraisalId, shopId },
        body: patch
      })
    }),
    updateReviewAssessed: builder.mutation<AssessedPreviewDto, UpdateAssessedRequest>({
      query: ({ appraisalId, shopId, patch }) => ({
        url: '/assessed/',
        method: 'PATCH',
        params: { appraisalId, shopId },
        body: patch
      })
    })
  })
});

export const {
  useGetAssessedQuery,
  useGetAssessedByUserQuery,
  useUpdateAssessedMutation,
  useUpdateReviewAssessedMutation
} = assessedApi;
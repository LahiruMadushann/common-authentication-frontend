import { AppraisalRequestInformation } from '@/src/types/appraisal';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface InvoiceData {
  id: number;
  companyName: string;
  name: string;
  shopTypeEnum: string;
  amount: number;

  
}

export const shopsApi = createApi({
  reducerPath: 'shopsApi',
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
  tagTypes: ['GetShops'],
  endpoints: (builder) => ({
    getShops: builder.query<AppraisalRequestInformation[], number>({
      query: (userId) => ({
        url: `/matching/appraisals/shops`,
        method: 'GET',
        params: {
          userId: userId
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }),
      providesTags: [{ type: 'GetShops' }]
    })
  })
});

export const {
  useLazyGetShopsQuery
} = shopsApi;

export const shopDetailsApi = createApi({
  reducerPath: 'shopDetailsApi',
  baseQuery: fetchBaseQuery({ baseUrl: process.env.REACT_APP_ENDPOINT_V2 }),
  tagTypes: ['GetShopDetails'],
  endpoints: (builder) => ({
    getShopDetails: builder.query<AppraisalRequestInformation[], number>({
      query: (shopId) => ({
        url: `/shop/detail`,
        method: 'GET',
        params: {
          id: shopId
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }),
      providesTags: [{ type: 'GetShopDetails' }]
    })
  })
});

export const {
  useLazyGetShopDetailsQuery
} = shopDetailsApi;

export const shopUploadApi = createApi({
  reducerPath: 'shopUploadApi',
  baseQuery: fetchBaseQuery({ baseUrl: process.env.REACT_APP_ENDPOINT_V1 }),
  tagTypes: ['UploadShopCsv'],
  endpoints: (builder) => ({
    uploadCsv: builder.mutation<void, FormData>({
      query: (formData) => ({
        url: `/shop/csv/upload`,
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }),
      invalidatesTags: [{ type: 'UploadShopCsv' }] 
    })
  })
});

export const {
  useUploadCsvMutation
} = shopUploadApi;

export const storeDetailsApi = createApi({
  reducerPath: 'storeDetailsApi',
  baseQuery: fetchBaseQuery({ baseUrl: process.env.REACT_APP_ENDPOINT_V2 }),
  tagTypes: ['GetStoreDetails'],
  endpoints: (builder) => ({
    getStoreDetails: builder.query<AppraisalRequestInformation[], { search?: string, page?: number,size?: number }>({
      query: (params) => ({
        url: `/shop/all`,
        method: 'GET',
        params: {
          ...(params.search ? { search: params.search } : {}),
          page: params.page || 0,
          size: params.size || 10
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }),
      providesTags: [{ type: 'GetStoreDetails' }]
    })
  })
});

export const {
  useLazyGetStoreDetailsQuery
} = storeDetailsApi;

export const shopInvoiceApi = createApi({
  reducerPath: 'shopInvoiceApi',
  baseQuery: fetchBaseQuery({ baseUrl: process.env.REACT_APP_ENDPOINT }),
  tagTypes: ['GetShopInvoices'],
  endpoints: (builder) => ({
    getInvoicesByYearAndMonth: builder.query<InvoiceData[], { id: number; year: number; month: number }>({
      query: ({ id, year, month }) => ({
        url: `/invoice/year/${id}`,  
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Year': year.toString(),  
          'Month': month.toString() 
        }
      }),
      providesTags: [{ type: 'GetShopInvoices' }]
    })
  })
});

export const { useGetInvoicesByYearAndMonthQuery } = shopInvoiceApi;

import { AppraisalType, InvoiceForPDFType, InvoiceType, UserShopInvoiceRequestType } from '@/src/types/invoice.type';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const invoiceApi = createApi({
  reducerPath: 'invoiceApi',
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
  tagTypes: ['Invoices', 'UserShopInvoices', 'InvoiceForPDF'],
  endpoints: (builder) => ({
    getUserInvoices: builder.query<InvoiceType[], string>({
      query: (year) => ({
        url: `/invoice/year/user`,
        method: 'GET',
        headers: {
          year: year,
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }),
      providesTags: [{ type: 'Invoices' }]
    }),
    getUserShopInvoices: builder.query<AppraisalType[], UserShopInvoiceRequestType>({
      query: ({ shopId, year, month }) => ({
        url: `/invoice/user/detail/${shopId}`,
        method: 'GET',
        headers: {
          year: year,
          month: month,
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }),
      providesTags: [{ type: 'UserShopInvoices' }]
    }),
    generateInvoiceBill: builder.query<InvoiceForPDFType, UserShopInvoiceRequestType>({
      query: ({ shopId, year, month }) => ({
        url: `/invoice/${shopId}/${year}/${month}`,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }),
      providesTags: [{ type: 'InvoiceForPDF' }]
    })
  })
});

export const {
  useGetUserInvoicesQuery,
  useLazyGetUserInvoicesQuery,
  useGetUserShopInvoicesQuery,
  useLazyGetUserShopInvoicesQuery,
  useGenerateInvoiceBillQuery,
  useLazyGenerateInvoiceBillQuery
} = invoiceApi;

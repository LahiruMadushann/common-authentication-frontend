import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface ResetPasswordRequest {
  token: string;
  userId: string;
  password: string;
}

export const passwordApi = createApi({
  reducerPath: 'passwordApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_ENDPOINT_V1}`,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    }
  }),
  
  endpoints: (builder) => ({
    forgetPassword: builder.mutation({
      query: (data: { email: string }) => {
        const formData = new FormData();
        formData.append('email', data.email);  

        return {
          url: '/accounts/forget-password',
          method: 'POST',
          body: formData, 
        };
      },
    }),
    resetPassword: builder.mutation<void, ResetPasswordRequest>({
      query: ({ token, userId, password }) => {
        const formData = new FormData();
        formData.append('token', token);
        formData.append('userId', userId);
        formData.append('password', password);

        return {
          url: `/accounts/password-reset`,
          method: 'POST',
          body: formData, 
        };
      },
    }),
  }),
});

export const { useForgetPasswordMutation, useResetPasswordMutation  } = passwordApi;

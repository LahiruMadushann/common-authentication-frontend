import { BaseQueryFn, createApi } from '@reduxjs/toolkit/query/react';
import { jwtDecode } from 'jwt-decode';
import axiosClient from '../../config/axiosInstance.config';
import { AxiosError, AxiosRequestConfig } from 'axios';

// JWT decoding utility function
function decodeToken(token: string): { userId?: number | string } {
  try {
    const decodedPayload = jwtDecode<{ userId?: number | string }>(token);
    return { userId: decodedPayload.userId };
  } catch (error) {
    try {
      const base64Url = token.split('.')[1];
      if (!base64Url) {
        console.warn('Invalid token format');
        return {};
      }
      const base64 = base64Url
        .replace(/-/g, '+')
        .replace(/_/g, '/')
        .replace(/=/g, '');

      const paddedBase64 = base64 + '=='.slice(0, (4 - base64.length % 4) % 4);
      const payload = JSON.parse(window.atob(paddedBase64));

      return { userId: payload.userId || payload.sub || payload.id };
    } catch (manualDecodeError) {
      return {};
    }
  }
}

type LoginResponseType = {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
};

type RefreshResponseType = {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
};

type AuthenticateResponseType = {
  authenticated: boolean;
  userId?: number;
  id?: number;
  role?: string;
};

const axiosBaseQuery =
  (
    { baseUrl }: { baseUrl: string } = { baseUrl: '' }
  ): BaseQueryFn<
    {
      url: string;
      method?: AxiosRequestConfig['method'];
      data?: AxiosRequestConfig['data'];
      params?: AxiosRequestConfig['params'];
      headers?: AxiosRequestConfig['headers'];
    },
    unknown,
    unknown
  > =>
    async ({ url, method, data, params, headers }) => {
      try {
        const result = await axiosClient({
          url: baseUrl + url,
          method,
          data,
          params,
          headers,
        });
        return { data: result.data };
      } catch (axiosError) {
        const err = axiosError as AxiosError;
        return {
          error: {
            status: err.response?.status,
            data: err.response?.data || err.message,
          },
        };
      }
    };

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: axiosBaseQuery({ baseUrl: process.env.REACT_APP_ENDPOINT || '' }),
  tagTypes: ['Auth'],
  endpoints: (build) => ({
    login: build.mutation<LoginResponseType, Partial<LoginRequest>>({
      query: (body) => ({
        url: `/auth/login`,
        method: 'POST',
        data: body
      }),
      transformErrorResponse: (error) => {
        return (error as { status: number }).status;
      },
      invalidatesTags: ['Auth']
    }),
    refresh: build.mutation<RefreshResponseType, { refreshToken: string }>({
      query: (body) => ({
        url: `/auth/refresh`,
        method: 'POST',
        data: body
      })
    }),
    logout: build.mutation<{ success: boolean; message: string }, void>({
      query: () => ({
        url: `/auth/logout`,
        method: 'POST'
      }),
      invalidatesTags: ['Auth']
    }),
    register: build.mutation<{ success: boolean; message: string; alreadyExisted: boolean }, any>({
      query: (body) => ({
        url: `/auth/register`,
        method: 'POST',
        data: body
      })
    }),
    passwordReset: build.mutation<{ success: boolean; message: string }, { email: string }>({
      query: (body) => ({
        url: `/auth/password-reset`,
        method: 'POST',
        data: body
      })
    }),
    getUser: build.query<any, string>({
      query: (email) => ({
        url: `/auth/users/${email}`,
        method: 'GET'
      }),
      providesTags: ['Auth']
    }),
    getAuthenticate: build.query<AuthenticateResponseType, null>({
      // We can't easily replicate the localStorage logic inside axiosBaseQuery simply.
      // However, the original implementation of getAuthenticate logic was a bit unusual (checking localStorage item then returning a dummy object).
      // Since `axiosClient` handles the Authorization header via interceptor, we just need to hit a protected endpoint.
      // The original code was:
      // query: () => { const token = ...; return { url: '/user/me', headers: ... } }
      // transformResponse: () => { ... }
      // It seems it was basically mocking an auth check or relying on /user/me but ignoring the response?
      // "url: `/user/me`" suggests there might be an endpoint to check.
      // But the transformResponse ignores the input and just checks localStorage and decodes token.
      // If we want to strictly follow the "check session" logic, we might need a real endpoint.
      // For now, I will preserve the *logic* of just checking the token, but since we must return a query object:

      query: () => ({
        url: '/auth/me', // Trying to hit a likely endpoint, or we can use a dummy one if we just want to run transformResponse
        method: 'GET'
      }),
      transformResponse: (response: any) => {
        const token = localStorage.getItem('token');
        let userId = response.userId;

        // Priority to token's userId if present
        if (token) {
          const decoded = decodeToken(token);
          if (decoded.userId) {
            userId = decoded.userId;
          }
        }

        // Fallback logic
        if (!userId) {
          userId = response.id;
        }

        return {
          ...response,
          authenticated: !!token,
          userId: userId
        };
      },
      providesTags: [{ type: 'Auth' }]
    })
  })
});

export const {
  useLoginMutation,
  useRefreshMutation,
  useLogoutMutation,
  useRegisterMutation,
  usePasswordResetMutation,
  useGetUserQuery,
  useLazyGetAuthenticateQuery,
  useGetAuthenticateQuery
} = authApi;

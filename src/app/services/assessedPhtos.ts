import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const assessedPhotosApi = createApi({
  reducerPath: 'assessedPhotosApi',
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
  tagTypes: ['Photos'],
  endpoints: (builder) => ({
    getPresignedUrl: builder.mutation<{ url: string }, { bucketName: string; keyName: string }>({
      query: (fileData) => ({
        url: '/file/presigned',
        method: 'POST',
        body: fileData,
        credentials: 'include'
      })
    }),
    getPhotos: builder.query<any[], { appraisalId: number; shopId: number; category: string }>({
      query: ({ appraisalId, shopId, category }) => ({
        url: `/assessed/photos?appraisalId=${appraisalId}&shopId=${shopId}&category=${category}`,
        credentials: 'include'
      }),
      providesTags: ['Photos']
    }),
    uploadFile: builder.mutation<void, { url: string; file: File }>({
      queryFn: async ({ url, file }) => {
        try {
          const response = await fetch(url, {
            method: 'PUT',
            body: file,
            headers: {
              'Content-Type': file.type,
              'Content-Disposition': `attachment; filename=${file.name}`
            }
          });

          if (!response.ok) {
            throw new Error('Failed to upload file');
          }

          return { data: undefined };
        } catch (error) {
          return { error: { status: 'FETCH_ERROR', error: String(error) } };
        }
      }
    }),
    uploadPhoto: builder.mutation<
      void,
      { shopId: number; appraisalId: number; link: string; category: string }
    >({
      query: (photoData) => ({
        url: '/assessed/photos',
        method: 'POST',
        body: photoData,
        credentials: 'include'
      }),
      invalidatesTags: ['Photos']
    }),
    deletePhoto: builder.mutation<void, { photoId: number }>({
      query: ({ photoId }) => ({
        url: `/assessed/photos?photoId=${photoId}`,
        method: 'DELETE',
        credentials: 'include'
      }),
      invalidatesTags: ['Photos']
    })
  })
});

export const {
  useGetPresignedUrlMutation,
  useUploadFileMutation,
  useUploadPhotoMutation,
  useGetPhotosQuery,
  useDeletePhotoMutation
} = assessedPhotosApi;
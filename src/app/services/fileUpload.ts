import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const fileUploadApi = createApi({
  reducerPath: 'fileUploadApi',
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
    getPresignedUrl: builder.mutation<{ url: string }, { bucketName: string; keyName: string }>({
      query: (fileData) => ({
        url: '/file/presigned',
        method: 'POST',
        body: fileData,
        credentials: 'include'
      })
    }),
    updateAppraisalPhotos: builder.mutation<
      void,
      { id: number; photoBefore: string; photoAfter: string; inspectionCertPhoto: string }
    >({
      query: ({ id, photoBefore, photoAfter, inspectionCertPhoto }) => ({
        url: `/appraisals/${id}/photos`,
        method: 'PATCH',
        body: { photoBefore, photoAfter, inspectionCertPhoto },
        credentials: 'include'
      })
    }),
    uploadFile: builder.mutation<void, { url: string; file: File }>({
      queryFn: async ({ url, file }) => {
        try {
          // Properly encode filename for Content-Disposition header to handle Japanese characters
          const encodedFilename = encodeURIComponent(file.name);
          const contentDisposition = `attachment; filename*=UTF-8''${encodedFilename}`;
          
          const response = await fetch(url, {
            method: 'PUT',
            body: file,
            headers: {
              'Content-Type': file.type,
              'Content-Disposition': contentDisposition
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
      })
    })
  })
});

export const {
  useGetPresignedUrlMutation,
  useUpdateAppraisalPhotosMutation,
  useUploadFileMutation,
  useUploadPhotoMutation
} = fileUploadApi;

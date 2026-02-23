interface AppraisalsQueryParams {
    [key: string]: any;
  }
  
  interface CSVAppraisalResponse {
    url: string;
  }
  
  import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
  
  export const fileControllsApi = createApi({
    reducerPath: "fileControllsApi",
    baseQuery: fetchBaseQuery({
      baseUrl: `${process.env.REACT_APP_ENDPOINT_V2}`,
      prepareHeaders: (headers) => {
        const token = localStorage.getItem("token");
        if (token) {
          headers.set("Authorization", `Bearer ${token}`);
        }
        return headers;
      },
    }),
    tagTypes: ["Appraisals"],
    endpoints: (builder) => ({
      getFilterCSVAppraisals: builder.query<CSVAppraisalResponse, AppraisalsQueryParams>({
        query: (appraisalsQueryParams) => ({
          url: `/file/presigned/filteredAssessedAppraisal/csv`,
          method: "GET",
          params: {
            ...appraisalsQueryParams,
          },
        }),
        providesTags: [{ type: "Appraisals" }],
      }),
    }),
  });
  
  export const { useLazyGetFilterCSVAppraisalsQuery } = fileControllsApi;
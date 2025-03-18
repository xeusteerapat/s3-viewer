import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BucketsResponse, ObjectsResponse } from '../types/s3Type';

export const s3Api = createApi({
  reducerPath: 's3Api',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://127.0.0.1:3009/api/' }),
  endpoints: (builder) => ({
    getBuckets: builder.query<BucketsResponse, void>({
      query: () => 'buckets',
    }),
    getObjects: builder.query<ObjectsResponse, string>({
      query: (bucketName) => `buckets/${bucketName}/objects`,
    }),
    viewObject: builder.query<Blob, { bucketName: string; objectKey: string }>({
      query: ({ bucketName, objectKey }) => ({
        url: `buckets/${bucketName}/objects/${objectKey}`,
        params: { download: false },
        responseHandler: (response) => response.blob(),
      }),
    }),
  }),
});

export const { useGetBucketsQuery, useGetObjectsQuery, useViewObjectQuery } =
  s3Api;

export const downloadObject = (bucketName: string, objectKey: string) => {
  const link = document.createElement('a');
  link.href = `/api/buckets/${bucketName}/objects/${objectKey}?download=true`;
  link.download = objectKey;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export type Bucket = {
  name: string;
  creationDate: string;
};

export type S3Object = {
  key: string;
  size: number;
  lastModified: string;
  eTag: string;
  storageClass: string;
};

export type BucketsResponse = {
  success: boolean;
  count: number;
  buckets: Bucket[];
};

export type ObjectsResponse = {
  success: boolean;
  bucket: string;
  prefix: string | null;
  isTruncated: boolean;
  count: number;
  objects: S3Object[];
};

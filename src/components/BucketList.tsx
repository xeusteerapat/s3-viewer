import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Folder } from 'lucide-react';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useGetBucketsQuery } from '../api/s3Api';
import { selectBucket } from '../features/s3Slice';
import { RootState } from '../features/store';

const BucketsList: React.FC = () => {
  const { data, error, isLoading } = useGetBucketsQuery();
  const dispatch = useDispatch();
  const selectedBucket = useSelector(
    (state: RootState) => state.s3.selectedBucket
  );

  if (isLoading)
    return (
      <div className='flex items-center justify-center p-4'>
        Loading buckets...
      </div>
    );
  if (error)
    return <div className='text-destructive p-4'>Error loading buckets</div>;
  if (!data || data.count === 0)
    return <div className='text-muted-foreground p-4'>No buckets found</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-lg'>S3 Buckets</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='space-y-2'>
          {data.buckets.map((bucket) => (
            <div
              key={bucket.name}
              className={`p-3 rounded-md border cursor-pointer transition-colors ${
                selectedBucket === bucket.name
                  ? 'bg-primary/10 border-primary'
                  : 'bg-card hover:bg-accent/50'
              }`}
              onClick={() => dispatch(selectBucket(bucket.name))}
            >
              <div className='flex items-center gap-2'>
                <Folder
                  size={18}
                  className={
                    selectedBucket === bucket.name
                      ? 'text-primary'
                      : 'text-muted-foreground'
                  }
                />
                <span className='font-medium'>{bucket.name}</span>
              </div>
              <div className='text-xs text-muted-foreground mt-1'>
                Created: {new Date(bucket.creationDate).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default BucketsList;

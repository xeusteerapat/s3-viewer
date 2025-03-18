import React from 'react';
import { useGetObjectsQuery, downloadObject } from '../api/s3Api';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../features/store';
import { selectObject } from '../features/s3Slice';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Eye, Download, FileIcon } from 'lucide-react';

const ObjectsList: React.FC = () => {
  const selectedBucket = useSelector(
    (state: RootState) => state.s3.selectedBucket
  );
  const selectedObject = useSelector(
    (state: RootState) => state.s3.selectedObject
  );
  const dispatch = useDispatch();

  const { data, error, isLoading } = useGetObjectsQuery(selectedBucket!, {
    skip: !selectedBucket,
  });

  if (!selectedBucket)
    return (
      <Card className='mt-4'>
        <CardContent className='py-8 text-center text-muted-foreground'>
          Select a bucket to view objects
        </CardContent>
      </Card>
    );

  if (isLoading)
    return (
      <Card className='mt-4'>
        <CardContent className='py-8 text-center'>
          Loading objects...
        </CardContent>
      </Card>
    );

  if (error)
    return (
      <Card className='mt-4'>
        <CardContent className='py-8 text-center text-destructive'>
          Error loading objects
        </CardContent>
      </Card>
    );

  if (!data || data.count === 0)
    return (
      <Card className='mt-4'>
        <CardContent className='py-8 text-center text-muted-foreground'>
          No objects found in bucket
        </CardContent>
      </Card>
    );

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Card className='mt-4'>
      <CardHeader>
        <CardTitle className='text-lg'>Objects in {selectedBucket}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Key</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Last Modified</TableHead>
              <TableHead>Storage Class</TableHead>
              <TableHead className='text-right'>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.objects.map((object) => (
              <TableRow
                key={object.key}
                className={selectedObject === object.key ? 'bg-primary/10' : ''}
                onClick={() => dispatch(selectObject(object.key))}
              >
                <TableCell className='flex items-center gap-2'>
                  <FileIcon size={16} className='text-muted-foreground' />
                  {object.key}
                </TableCell>
                <TableCell>{formatBytes(object.size)}</TableCell>
                <TableCell>
                  {new Date(object.lastModified).toLocaleString()}
                </TableCell>
                <TableCell>{object.storageClass}</TableCell>
                <TableCell className='text-right'>
                  <Button
                    variant='outline'
                    size='sm'
                    className='mr-2'
                    onClick={(e) => {
                      e.stopPropagation();
                      dispatch(selectObject(object.key));
                    }}
                  >
                    <Eye size={16} className='mr-1' /> View
                  </Button>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={(e) => {
                      e.stopPropagation();
                      downloadObject(selectedBucket, object.key);
                    }}
                  >
                    <Download size={16} className='mr-1' /> Download
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ObjectsList;

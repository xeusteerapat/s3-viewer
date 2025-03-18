import React from 'react';
import { downloadObject, useViewObjectQuery } from '../api/s3Api';
import { useSelector } from 'react-redux';
import { RootState } from '../features/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileIcon } from 'lucide-react';

const ObjectViewer: React.FC = () => {
  const selectedBucket = useSelector(
    (state: RootState) => state.s3.selectedBucket
  );
  const selectedObject = useSelector(
    (state: RootState) => state.s3.selectedObject
  );

  const {
    data: objectBlob,
    error,
    isLoading,
  } = useViewObjectQuery(
    { bucketName: selectedBucket!, objectKey: selectedObject! },
    { skip: !selectedBucket || !selectedObject }
  );

  if (!selectedBucket || !selectedObject) return null;

  if (isLoading)
    return (
      <Card className='mt-4'>
        <CardContent className='py-8 text-center'>
          Loading object content...
        </CardContent>
      </Card>
    );

  if (error)
    return (
      <Card className='mt-4'>
        <CardContent className='py-8 text-center text-destructive'>
          Error loading object content
        </CardContent>
      </Card>
    );

  if (!objectBlob)
    return (
      <Card className='mt-4'>
        <CardContent className='py-8 text-center text-muted-foreground'>
          No content available
        </CardContent>
      </Card>
    );

  // Determine object type for viewing
  const objectURL = URL.createObjectURL(objectBlob);
  const fileExtension = selectedObject.split('.').pop()?.toLowerCase();
  const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(
    fileExtension || ''
  );
  const isPdf = fileExtension === 'pdf';
  const isText = ['txt', 'json', 'xml', 'html', 'css', 'js', 'ts'].includes(
    fileExtension || ''
  );

  let content;
  if (isImage) {
    content = (
      <div className='flex justify-center p-4 bg-muted/30 rounded-md'>
        <img
          src={objectURL}
          alt={selectedObject}
          className='max-w-full max-h-[600px] object-contain'
        />
      </div>
    );
  } else if (isPdf) {
    content = (
      <iframe
        src={objectURL}
        title={selectedObject}
        className='w-full h-[600px] border rounded-md'
      />
    );
  } else if (isText) {
    // For text files, we need to read the blob as text
    content = <TextViewer blob={objectBlob} />;
  } else {
    content = (
      <div className='flex flex-col items-center justify-center py-8 bg-muted/30 rounded-md'>
        <FileIcon size={48} className='text-muted-foreground mb-4' />
        <p className='mb-4 text-muted-foreground'>
          Preview not available for this file type.
        </p>
        <Button onClick={() => window.open(objectURL, '_blank')}>
          <Download size={16} className='mr-2' /> Download {selectedObject}
        </Button>
      </div>
    );
  }

  return (
    <Card className='mt-4'>
      <CardHeader className='flex flex-row items-start justify-between'>
        <CardTitle className='text-lg'>Viewing: {selectedObject}</CardTitle>
        <Button
          variant='outline'
          size='sm'
          onClick={() => downloadObject(selectedBucket, selectedObject)}
        >
          <Download size={16} className='mr-2' /> Download
        </Button>
      </CardHeader>
      <CardContent>{content}</CardContent>
    </Card>
  );
};

// Helper component to display text content
const TextViewer: React.FC<{ blob: Blob }> = ({ blob }) => {
  const [text, setText] = React.useState<string | null>(null);

  React.useEffect(() => {
    const reader = new FileReader();
    reader.onload = () => {
      setText(reader.result as string);
    };
    reader.readAsText(blob);
  }, [blob]);

  if (text === null)
    return <div className='p-4 text-center'>Loading text content...</div>;

  return (
    <pre className='p-4 bg-muted/30 rounded-md overflow-auto whitespace-pre-wrap max-h-[600px] text-sm'>
      {text}
    </pre>
  );
};

export default ObjectViewer;

import React from 'react';
import { Provider } from 'react-redux';
import { store } from './features/store';
import BucketsList from './components/BucketList';
import ObjectsList from './components/ObjectList';
import ObjectViewer from './components/ObjectViewer';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <div className='min-h-screen bg-background'>
        <header className='bg-primary text-primary-foreground py-4 px-6 shadow-md'>
          <h1 className='text-xl font-bold'>AWS S3 Browser</h1>
        </header>
        <main className='container mx-auto py-6 px-4 md:flex gap-6'>
          <div className='md:w-1/3 lg:w-1/4 mb-6 md:mb-0'>
            <BucketsList />
          </div>
          <div className='md:w-2/3 lg:w-3/4 space-y-6'>
            <ObjectsList />
            <ObjectViewer />
          </div>
        </main>
      </div>
    </Provider>
  );
};

export default App;

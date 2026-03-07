import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { RouterProvider } from 'react-router-dom';

import ReactQueryProvider from './providers/ReactQueryProvider/ReactQuery.provider.tsx';
import { ThemeProvider } from './providers/ThemeProvider/Theme.provider.tsx';

import { router } from './routes/routes.config.tsx';

import { Toaster } from './components/ui/sonner.tsx';

import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ReactQueryProvider>
      <ThemeProvider>
        <RouterProvider router={router} />
        <Toaster
          richColors
          closeButton
          position="top-center"
          swipeDirections={['left', 'right', 'top']}
        />
        {/* {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />} */}
      </ThemeProvider>
    </ReactQueryProvider>
  </StrictMode>,
);

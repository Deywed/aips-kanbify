import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { RouterProvider } from 'react-router-dom';
import { Toaster } from 'sonner';

import ReactQueryProvider from './providers/ReactQueryProvider/ReactQuery.provider.tsx';
import { ThemeProvider } from './providers/ThemeProvider/Theme.provider.tsx';
import { router } from './routes/routes.config.tsx';

import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ReactQueryProvider>
      <ThemeProvider>
        <RouterProvider router={router} />
        <Toaster richColors closeButton position="top-right" />
        {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
      </ThemeProvider>
    </ReactQueryProvider>
  </StrictMode>,
);

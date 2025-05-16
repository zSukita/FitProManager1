import { QueryClient } from '@tanstack/react-query-core';
  import { QueryClientProvider } from '@tanstack/react-query-react';

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 minutes
        cacheTime: 1000 * 60 * 15, // 15 minutes
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  });

  export const ReactQueryProvider = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );

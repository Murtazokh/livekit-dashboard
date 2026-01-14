import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import App from './App.tsx'
import { ApiClientProvider } from './presentation/providers/ApiClientProvider.tsx'
import { ThemeProvider } from './presentation/providers/ThemeProvider.tsx'

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Global defaults for all queries
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="system">
      <QueryClientProvider client={queryClient}>
        <ApiClientProvider>
          <App />
        </ApiClientProvider>
      </QueryClientProvider>
    </ThemeProvider>
  </StrictMode>,
)

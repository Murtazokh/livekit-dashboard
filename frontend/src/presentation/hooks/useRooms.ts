import { useQuery } from '@tanstack/react-query';
import { ApiClient } from '@/infrastructure/api/ApiClient';
import { GetRooms } from '@/core/usecases/GetRooms';
import { useSettings } from './useSettings';

/**
 * Query key factory for rooms
 */
export const roomsQueryKeys = {
  all: ['rooms'] as const,
  lists: () => [...roomsQueryKeys.all, 'list'] as const,
  list: (filters?: any) => [...roomsQueryKeys.lists(), filters] as const,
};

/**
 * Custom hook for fetching rooms data
 * Uses React Query for caching, background updates, and error handling
 */
export const useRooms = (filters?: any) => {
  const { isConfigComplete } = useSettings();

  // Initialize services
  const apiClient = new ApiClient();
  const getRooms = new GetRooms(apiClient);

  return useQuery({
    queryKey: roomsQueryKeys.list(filters),
    queryFn: async () => {
      if (filters) {
        return getRooms.executeWithFilters(filters);
      }
      return getRooms.execute();
    },
    enabled: isConfigComplete(), // Only run query if configuration is complete
    staleTime: 30000, // Consider data fresh for 30 seconds
    gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
    refetchOnWindowFocus: true, // Refetch when window regains focus
    refetchInterval: 60000, // Refetch every minute for real-time feel
    retry: (failureCount, error) => {
      // Don't retry on 4xx errors (client errors)
      if (error instanceof Error && error.message.includes('4')) {
        return false;
      }
      // Retry up to 3 times for other errors
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
  });
};
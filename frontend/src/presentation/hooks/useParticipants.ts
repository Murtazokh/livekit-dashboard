import { useQuery } from '@tanstack/react-query';
import { ApiClient } from '@/infrastructure/api/ApiClient';
import { GetParticipants } from '@/core/usecases/GetParticipants';
import { useSettings } from './useSettings';

/**
 * Query key factory for participants
 */
export const participantsQueryKeys = {
  all: ['participants'] as const,
  lists: () => [...participantsQueryKeys.all, 'list'] as const,
  list: (roomName: string, filters?: any) => [...participantsQueryKeys.lists(), roomName, filters] as const,
};

/**
 * Custom hook for fetching participants data for a specific room
 * Uses React Query for caching, background updates, and error handling
 */
export const useParticipants = (roomName: string, filters?: any) => {
  const { isConfigComplete } = useSettings();

  // Initialize services
  const apiClient = new ApiClient();
  const getParticipants = new GetParticipants(apiClient);

  return useQuery({
    queryKey: participantsQueryKeys.list(roomName, filters),
    queryFn: async () => {
      if (filters) {
        return getParticipants.executeWithFilters(roomName, filters);
      }
      return getParticipants.execute(roomName);
    },
    enabled: isConfigComplete() && !!roomName, // Only run query if config is complete and roomName is provided
    staleTime: 15000, // Consider data fresh for 15 seconds (participants change more frequently)
    gcTime: 2 * 60 * 1000, // Keep in cache for 2 minutes
    refetchOnWindowFocus: true,
    refetchInterval: 30000, // Refetch every 30 seconds for real-time feel
    retry: (failureCount, error) => {
      // Don't retry on 4xx errors (client errors like room not found)
      if (error instanceof Error && error.message.includes('4')) {
        return false;
      }
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useApiClient } from '../providers/ApiClientProvider';
import { GetAllAgents } from '@/core/usecases/GetAgents';
import type { Agent } from '@/core/domain/Agent';

/**
 * Hook to check if LiveKit configuration is complete
 */
const useConfigComplete = () => {
  const config = localStorage.getItem('livekit-config');
  if (!config) return false;

  try {
    const parsed = JSON.parse(config);
    return !!(parsed.serverUrl && parsed.apiKey && parsed.apiSecret);
  } catch {
    return false;
  }
};

/**
 * Hook to fetch all agent dispatches across all rooms
 */
export const useAgents = () => {
  const { apiClient, isInitialized } = useApiClient();
  const isConfigComplete = useConfigComplete();

  return useQuery<Agent[], Error>({
    queryKey: ['agents', 'all'],
    queryFn: async () => {
      const useCase = new GetAllAgents(apiClient);
      return useCase.execute();
    },
    enabled: isConfigComplete && isInitialized,
    staleTime: 30000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
    refetchInterval: 60000, // Refetch every minute for real-time updates
    retry: (failureCount, error) => {
      // Don't retry on client errors (4xx)
      if (error.message.includes('400') || error.message.includes('401') ||
          error.message.includes('403') || error.message.includes('404')) {
        return false;
      }
      // Retry other errors up to 3 times
      return failureCount < 3;
    },
  });
};

/**
 * Hook to create a new agent dispatch
 */
export const useCreateAgentDispatch = () => {
  const { apiClient } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      roomName,
      agentName,
      metadata,
    }: {
      roomName: string;
      agentName: string;
      metadata?: string;
    }) => {
      return apiClient.createAgentDispatch(roomName, agentName, metadata);
    },
    onSuccess: () => {
      // Invalidate agents query to refetch the list
      queryClient.invalidateQueries({ queryKey: ['agents'] });
      // Also invalidate rooms query as agent dispatch affects room state
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
    },
  });
};

/**
 * Hook to delete an agent dispatch
 */
export const useDeleteAgentDispatch = () => {
  const { apiClient } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      dispatchId,
      roomName,
    }: {
      dispatchId: string;
      roomName: string;
    }) => {
      return apiClient.deleteAgentDispatch(dispatchId, roomName);
    },
    onSuccess: () => {
      // Invalidate agents query to refetch the list
      queryClient.invalidateQueries({ queryKey: ['agents'] });
      // Also invalidate rooms query as removing agent affects room state
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
    },
  });
};

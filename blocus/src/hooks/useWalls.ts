import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryClient';
import { getWallsByGymId } from '@/services/api/walls';

export function useWallsByGym(gymId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.walls.byGym(gymId ?? ''),
    queryFn: () => getWallsByGymId(gymId!),
    enabled: !!gymId,
  });
}

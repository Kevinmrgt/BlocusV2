import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryClient';
import { getBouldersByWallId } from '@/services/api/boulders';

export function useBouldersByWall(wallId: string) {
  return useQuery({
    queryKey: queryKeys.boulders.byWall(wallId),
    queryFn: () => getBouldersByWallId(wallId),
    enabled: !!wallId,
  });
}

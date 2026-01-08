import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryClient';
import { getBouldersByWallId, getBoulderById } from '@/services/api/boulders';

export function useBouldersByWall(wallId: string) {
  return useQuery({
    queryKey: queryKeys.boulders.byWall(wallId),
    queryFn: () => getBouldersByWallId(wallId),
    enabled: !!wallId,
  });
}

export function useBoulderById(boulderId: string) {
  return useQuery({
    queryKey: queryKeys.boulders.detail(boulderId),
    queryFn: () => getBoulderById(boulderId),
    enabled: !!boulderId,
  });
}

import { useQuery } from '@tanstack/react-query';
import { getGyms } from '@/services/api/gyms';

export function useGyms() {
  return useQuery({
    queryKey: ['gyms'],
    queryFn: getGyms,
  });
}

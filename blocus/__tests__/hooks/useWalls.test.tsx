import { renderHook, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useWallsByGym } from '@/hooks/useWalls';
import * as wallsApi from '@/services/api/walls';
import type { Tables } from '@/types/database';

jest.mock('@/services/api/walls');

const mockWalls: Tables<'walls'>[] = [
  {
    id: 'wall-1',
    gym_id: 'gym-1',
    name: 'Wall 1',
    description: null,
    order_index: 0,
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
  },
];

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
}

describe('useWallsByGym', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches walls for a gym', async () => {
    jest.spyOn(wallsApi, 'getWallsByGymId').mockResolvedValue(mockWalls);

    const { result } = renderHook(() => useWallsByGym('gym-1'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(wallsApi.getWallsByGymId).toHaveBeenCalledWith('gym-1');
    expect(result.current.data).toEqual(mockWalls);
  });

  it('does not fetch when gymId is undefined', () => {
    const { result } = renderHook(() => useWallsByGym(undefined), {
      wrapper: createWrapper(),
    });

    expect(result.current.fetchStatus).toBe('idle');
    expect(wallsApi.getWallsByGymId).not.toHaveBeenCalled();
  });

  it('handles fetch error', async () => {
    const error = new Error('Fetch failed');
    jest.spyOn(wallsApi, 'getWallsByGymId').mockRejectedValue(error);

    const { result } = renderHook(() => useWallsByGym('gym-1'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBe(error);
  });
});

import { renderHook, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useBouldersByWall, useBoulderById } from '@/hooks/useBoulders';
import * as bouldersApi from '@/services/api/boulders';
import type { BoulderWithPhotos } from '@/services/api/boulders';

jest.mock('@/services/api/boulders');

const mockBoulders: BoulderWithPhotos[] = [
  {
    id: 'boulder-1',
    wall_id: 'wall-1',
    title: 'Boulder 1',
    difficulty: 5,
    description: null,
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
    boulder_photos: [],
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

describe('useBouldersByWall', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches boulders for a wall', async () => {
    jest.spyOn(bouldersApi, 'getBouldersByWallId').mockResolvedValue(mockBoulders);

    const { result } = renderHook(() => useBouldersByWall('wall-1'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(bouldersApi.getBouldersByWallId).toHaveBeenCalledWith('wall-1');
    expect(result.current.data).toEqual(mockBoulders);
  });

  it('does not fetch when wallId is empty', () => {
    const { result } = renderHook(() => useBouldersByWall(''), {
      wrapper: createWrapper(),
    });

    expect(result.current.fetchStatus).toBe('idle');
    expect(bouldersApi.getBouldersByWallId).not.toHaveBeenCalled();
  });

  it('handles fetch error', async () => {
    const error = new Error('Fetch failed');
    jest.spyOn(bouldersApi, 'getBouldersByWallId').mockRejectedValue(error);

    const { result } = renderHook(() => useBouldersByWall('wall-1'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBe(error);
  });
});

const mockBoulder: BoulderWithPhotos = {
  id: 'boulder-1',
  wall_id: 'wall-1',
  title: 'Test Boulder',
  difficulty: 7,
  description: 'A challenging boulder',
  created_at: '2024-01-01',
  updated_at: '2024-01-01',
  boulder_photos: [
    {
      id: 'photo-1',
      boulder_id: 'boulder-1',
      url: 'http://photo.jpg',
      order_index: 0,
      created_at: '2024-01-01',
    },
  ],
};

describe('useBoulderById', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches a single boulder by id', async () => {
    jest.spyOn(bouldersApi, 'getBoulderById').mockResolvedValue(mockBoulder);

    const { result } = renderHook(() => useBoulderById('boulder-1'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(bouldersApi.getBoulderById).toHaveBeenCalledWith('boulder-1');
    expect(result.current.data).toEqual(mockBoulder);
  });

  it('does not fetch when boulderId is empty', () => {
    const { result } = renderHook(() => useBoulderById(''), {
      wrapper: createWrapper(),
    });

    expect(result.current.fetchStatus).toBe('idle');
    expect(bouldersApi.getBoulderById).not.toHaveBeenCalled();
  });

  it('handles fetch error', async () => {
    const error = new Error('Boulder not found');
    jest.spyOn(bouldersApi, 'getBoulderById').mockRejectedValue(error);

    const { result } = renderHook(() => useBoulderById('boulder-1'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBe(error);
  });
});

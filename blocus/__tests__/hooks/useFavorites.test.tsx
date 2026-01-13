import React from 'react';
import { renderHook, waitFor, act } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFavorites, useIsFavorited, useToggleFavorite } from '@/hooks/useFavorites';
import * as favoritesApi from '@/services/api/favorites';
import type { BoulderWithDetails } from '@/types/models/boulder';

jest.mock('@/services/api/favorites');
jest.mock('@/providers/AuthProvider', () => ({
  useAuth: () => ({
    user: { id: 'user-123' },
    isAuthenticated: true,
  }),
}));

const mockFavorites: BoulderWithDetails[] = [
  {
    id: 'boulder-1',
    wall_id: 'wall-1',
    title: 'Test Boulder',
    difficulty: 5,
    description: 'A test boulder',
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
    photos: [
      {
        id: 'photo-1',
        boulder_id: 'boulder-1',
        url: 'http://test.jpg',
        order_index: 0,
        created_at: '2024-01-01',
      },
    ],
    validations_count: 0,
    comments_count: 0,
    is_favorited: true,
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

describe('useFavorites', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches user favorites', async () => {
    jest.spyOn(favoritesApi, 'getFavorites').mockResolvedValue(mockFavorites);

    const { result } = renderHook(() => useFavorites(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(favoritesApi.getFavorites).toHaveBeenCalledWith('user-123');
    expect(result.current.data).toEqual(mockFavorites);
  });

  it('handles fetch error', async () => {
    const error = new Error('Fetch failed');
    jest.spyOn(favoritesApi, 'getFavorites').mockRejectedValue(error);

    const { result } = renderHook(() => useFavorites(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBe(error);
  });
});

describe('useIsFavorited', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('checks if boulder is favorited', async () => {
    jest.spyOn(favoritesApi, 'checkIsFavorited').mockResolvedValue(true);

    const { result } = renderHook(() => useIsFavorited('boulder-1'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(favoritesApi.checkIsFavorited).toHaveBeenCalledWith('user-123', 'boulder-1');
    expect(result.current.data).toBe(true);
  });

  it('returns false when not favorited', async () => {
    jest.spyOn(favoritesApi, 'checkIsFavorited').mockResolvedValue(false);

    const { result } = renderHook(() => useIsFavorited('boulder-2'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toBe(false);
  });

  it('does not fetch when boulderId is empty', () => {
    const { result } = renderHook(() => useIsFavorited(''), {
      wrapper: createWrapper(),
    });

    expect(result.current.fetchStatus).toBe('idle');
    expect(favoritesApi.checkIsFavorited).not.toHaveBeenCalled();
  });
});

describe('useToggleFavorite', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('removes favorite when currently favorited', async () => {
    jest.spyOn(favoritesApi, 'removeFavorite').mockResolvedValue(undefined);

    const { result } = renderHook(() => useToggleFavorite(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      result.current.mutate({ boulderId: 'boulder-1', isFavorited: true });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(favoritesApi.removeFavorite).toHaveBeenCalledWith('user-123', 'boulder-1');
    expect(favoritesApi.addFavorite).not.toHaveBeenCalled();
  });

  it('adds favorite when not currently favorited', async () => {
    jest.spyOn(favoritesApi, 'addFavorite').mockResolvedValue(undefined);

    const { result } = renderHook(() => useToggleFavorite(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      result.current.mutate({ boulderId: 'boulder-1', isFavorited: false });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(favoritesApi.addFavorite).toHaveBeenCalledWith('user-123', 'boulder-1');
    expect(favoritesApi.removeFavorite).not.toHaveBeenCalled();
  });

  it('handles mutation error', async () => {
    const error = new Error('Toggle failed');
    jest.spyOn(favoritesApi, 'addFavorite').mockRejectedValue(error);

    const { result } = renderHook(() => useToggleFavorite(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      result.current.mutate({ boulderId: 'boulder-1', isFavorited: false });
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBe(error);
  });
});

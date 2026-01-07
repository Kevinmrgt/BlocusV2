import { renderHook, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useGyms } from '@/hooks/useGyms';
import * as gymsService from '@/services/api/gyms';

jest.mock('@/services/api/gyms');

function TestWrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useGyms', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns empty array when no gyms', async () => {
    (gymsService.getGyms as jest.Mock).mockResolvedValueOnce([]);

    const { result } = renderHook(() => useGyms(), {
      wrapper: TestWrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual([]);
  });

  it('returns gyms data when available', async () => {
    const mockGyms = [
      { id: '1', name: 'Gym 1' },
      { id: '2', name: 'Gym 2' },
    ];
    (gymsService.getGyms as jest.Mock).mockResolvedValueOnce(mockGyms);

    const { result } = renderHook(() => useGyms(), {
      wrapper: TestWrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockGyms);
  });

  it('handles error state', async () => {
    const error = new Error('Failed to fetch');
    (gymsService.getGyms as jest.Mock).mockRejectedValueOnce(error);

    const { result } = renderHook(() => useGyms(), {
      wrapper: TestWrapper,
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toEqual(error);
  });
});

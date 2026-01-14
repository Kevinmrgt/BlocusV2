import React from 'react';
import { renderHook, waitFor, act } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useIsValidated, useUserValidations, useValidateBoulder } from '@/hooks/useValidations';
import * as validationsApi from '@/services/api/validations';
import type { Validation } from '@/types/models/boulder';

jest.mock('@/services/api/validations');
jest.mock('@/providers/AuthProvider', () => ({
  useAuth: () => ({
    user: { id: 'user-123' },
    isAuthenticated: true,
  }),
}));

const mockValidation: Validation = {
  id: 'validation-1',
  user_id: 'user-123',
  boulder_id: 'boulder-1',
  points_earned: 50,
  validated_at: '2024-01-01T12:00:00Z',
};

const mockValidations: Validation[] = [
  mockValidation,
  {
    id: 'validation-2',
    user_id: 'user-123',
    boulder_id: 'boulder-2',
    points_earned: 70,
    validated_at: '2024-01-02T12:00:00Z',
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

describe('useIsValidated', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('checks if boulder is validated', async () => {
    jest.spyOn(validationsApi, 'checkIsValidated').mockResolvedValue(true);

    const { result } = renderHook(() => useIsValidated('boulder-1'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(validationsApi.checkIsValidated).toHaveBeenCalledWith('user-123', 'boulder-1');
    expect(result.current.data).toBe(true);
  });

  it('returns false when not validated', async () => {
    jest.spyOn(validationsApi, 'checkIsValidated').mockResolvedValue(false);

    const { result } = renderHook(() => useIsValidated('boulder-2'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toBe(false);
  });

  it('does not fetch when boulderId is empty', () => {
    const { result } = renderHook(() => useIsValidated(''), {
      wrapper: createWrapper(),
    });

    expect(result.current.fetchStatus).toBe('idle');
    expect(validationsApi.checkIsValidated).not.toHaveBeenCalled();
  });

  it('handles fetch error', async () => {
    const error = new Error('Fetch failed');
    jest.spyOn(validationsApi, 'checkIsValidated').mockRejectedValue(error);

    const { result } = renderHook(() => useIsValidated('boulder-1'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBe(error);
  });
});

describe('useUserValidations', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches user validation history', async () => {
    jest.spyOn(validationsApi, 'getValidationsByUser').mockResolvedValue(mockValidations);

    const { result } = renderHook(() => useUserValidations(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(validationsApi.getValidationsByUser).toHaveBeenCalledWith('user-123');
    expect(result.current.data).toEqual(mockValidations);
  });

  it('handles fetch error', async () => {
    const error = new Error('Fetch failed');
    jest.spyOn(validationsApi, 'getValidationsByUser').mockRejectedValue(error);

    const { result } = renderHook(() => useUserValidations(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBe(error);
  });
});

describe('useValidateBoulder', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('validates a boulder successfully', async () => {
    jest.spyOn(validationsApi, 'createValidation').mockResolvedValue(mockValidation);

    const { result } = renderHook(() => useValidateBoulder(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      result.current.mutate({ boulderId: 'boulder-1', difficulty: 5 });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(validationsApi.createValidation).toHaveBeenCalledWith('user-123', 'boulder-1', 5);
    expect(result.current.data).toEqual(mockValidation);
  });

  it('handles validation error', async () => {
    const error = new Error('Validation failed');
    jest.spyOn(validationsApi, 'createValidation').mockRejectedValue(error);

    const { result } = renderHook(() => useValidateBoulder(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      result.current.mutate({ boulderId: 'boulder-1', difficulty: 5 });
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBe(error);
  });

  it('handles already validated error', async () => {
    const error = new Error('Boulder already validated');
    jest.spyOn(validationsApi, 'createValidation').mockRejectedValue(error);

    const { result } = renderHook(() => useValidateBoulder(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      result.current.mutate({ boulderId: 'boulder-1', difficulty: 5 });
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error?.message).toBe('Boulder already validated');
  });

  it('calculates points based on difficulty', async () => {
    const expectedPoints = 70; // difficulty 7 * 10
    const responseValidation = { ...mockValidation, points_earned: expectedPoints };
    jest.spyOn(validationsApi, 'createValidation').mockResolvedValue(responseValidation);

    const { result } = renderHook(() => useValidateBoulder(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      result.current.mutate({ boulderId: 'boulder-1', difficulty: 7 });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(validationsApi.createValidation).toHaveBeenCalledWith('user-123', 'boulder-1', 7);
    expect(result.current.data?.points_earned).toBe(70);
  });
});

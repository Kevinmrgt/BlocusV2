import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NavigationContainer } from '@react-navigation/native';
import { BoulderDetailScreen } from '@/screens/explore/BoulderDetailScreen';
import * as useBoulders from '@/hooks/useBoulders';
import type { BoulderWithPhotos } from '@/services/api/boulders';

jest.mock('@/hooks/useBoulders');

// Mock Auth
jest.mock('@/providers/AuthProvider', () => ({
  useAuth: () => ({
    isAuthenticated: false,
    user: null,
  }),
}));

// Mock useFavorites hooks
jest.mock('@/hooks/useFavorites', () => ({
  useIsFavorited: () => ({ data: false, isLoading: false }),
  useToggleFavorite: () => ({ mutate: jest.fn(), isPending: false }),
}));

// Mock useValidations hooks
jest.mock('@/hooks/useValidations', () => ({
  useIsValidated: () => ({ data: false, isLoading: false }),
  useValidateBoulder: () => ({ mutate: jest.fn(), isPending: false }),
}));

// Mock navigation
const mockGoBack = jest.fn();
jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({
      goBack: mockGoBack,
    }),
    useRoute: () => ({
      params: { boulderId: 'boulder-1' },
    }),
  };
});

const mockBoulder: BoulderWithPhotos = {
  id: 'boulder-1',
  wall_id: 'wall-1',
  title: 'Le Dévers Rouge',
  difficulty: 7,
  description: 'Un bloc technique avec un dévers exigeant.',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
  boulder_photos: [
    {
      id: 'photo-1',
      boulder_id: 'boulder-1',
      url: 'https://example.com/photo1.jpg',
      order_index: 0,
      created_at: '2024-01-01T00:00:00Z',
    },
  ],
};

const mockBoulderNoPhoto: BoulderWithPhotos = {
  ...mockBoulder,
  boulder_photos: [],
};

const mockBoulderNoDescription: BoulderWithPhotos = {
  ...mockBoulder,
  description: null,
};

const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

const renderWithProviders = (component: React.ReactElement) => {
  const queryClient = createQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>{component}</NavigationContainer>
    </QueryClientProvider>
  );
};

describe('BoulderDetailScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state', () => {
    jest.spyOn(useBoulders, 'useBoulderById').mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
      refetch: jest.fn(),
    } as unknown as ReturnType<typeof useBoulders.useBoulderById>);

    const { getByText, getByTestId } = renderWithProviders(<BoulderDetailScreen />);

    expect(getByTestId('boulder-detail-screen')).toBeTruthy();
    expect(getByText('Chargement du boulder...')).toBeTruthy();
  });

  it('renders error state', () => {
    jest.spyOn(useBoulders, 'useBoulderById').mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error('Failed to fetch'),
      refetch: jest.fn(),
    } as unknown as ReturnType<typeof useBoulders.useBoulderById>);

    const { getByText, getByTestId } = renderWithProviders(<BoulderDetailScreen />);

    expect(getByTestId('boulder-detail-screen')).toBeTruthy();
    expect(getByText('Impossible de charger le boulder')).toBeTruthy();
  });

  it('renders boulder with photo', () => {
    jest.spyOn(useBoulders, 'useBoulderById').mockReturnValue({
      data: mockBoulder,
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    } as unknown as ReturnType<typeof useBoulders.useBoulderById>);

    const { getByText, getByTestId, getAllByText } = renderWithProviders(<BoulderDetailScreen />);

    expect(getByTestId('boulder-detail-screen')).toBeTruthy();
    // Title appears in both header and info section
    expect(getAllByText('Le Dévers Rouge').length).toBeGreaterThanOrEqual(2);
    expect(getByText('Un bloc technique avec un dévers exigeant.')).toBeTruthy();
    expect(getByTestId('boulder-image')).toBeTruthy();
  });

  it('renders boulder without photo', () => {
    jest.spyOn(useBoulders, 'useBoulderById').mockReturnValue({
      data: mockBoulderNoPhoto,
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    } as unknown as ReturnType<typeof useBoulders.useBoulderById>);

    const { getByText, queryByTestId } = renderWithProviders(<BoulderDetailScreen />);

    expect(getByText('Aucune photo')).toBeTruthy();
    expect(queryByTestId('boulder-image')).toBeNull();
  });

  it('renders boulder without description', () => {
    jest.spyOn(useBoulders, 'useBoulderById').mockReturnValue({
      data: mockBoulderNoDescription,
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    } as unknown as ReturnType<typeof useBoulders.useBoulderById>);

    const { getByText } = renderWithProviders(<BoulderDetailScreen />);

    expect(getByText('Aucune description disponible')).toBeTruthy();
  });

  it('renders difficulty badge', () => {
    jest.spyOn(useBoulders, 'useBoulderById').mockReturnValue({
      data: mockBoulder,
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    } as unknown as ReturnType<typeof useBoulders.useBoulderById>);

    const { getByText } = renderWithProviders(<BoulderDetailScreen />);

    // DifficultyBadge displays the level
    expect(getByText('7')).toBeTruthy();
  });

  it('renders disabled action buttons', () => {
    jest.spyOn(useBoulders, 'useBoulderById').mockReturnValue({
      data: mockBoulder,
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    } as unknown as ReturnType<typeof useBoulders.useBoulderById>);

    const { getByText, getByTestId } = renderWithProviders(<BoulderDetailScreen />);

    expect(getByText('Actions')).toBeTruthy();
    expect(getByText('Connectez-vous pour interagir')).toBeTruthy();
    expect(getByTestId('validate-button')).toBeTruthy();
    expect(getByTestId('favorite-button-container')).toBeTruthy();
    expect(getByTestId('comments-button')).toBeTruthy();
    expect(getByText('Valider')).toBeTruthy();
    expect(getByText('Favori')).toBeTruthy();
    expect(getByText('Commentaires')).toBeTruthy();
  });

  it('navigates back when back button is pressed', () => {
    jest.spyOn(useBoulders, 'useBoulderById').mockReturnValue({
      data: mockBoulder,
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    } as unknown as ReturnType<typeof useBoulders.useBoulderById>);

    const { getByTestId } = renderWithProviders(<BoulderDetailScreen />);

    fireEvent.press(getByTestId('back-button'));

    expect(mockGoBack).toHaveBeenCalled();
  });

  it('displays boulder title in header', () => {
    jest.spyOn(useBoulders, 'useBoulderById').mockReturnValue({
      data: mockBoulder,
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    } as unknown as ReturnType<typeof useBoulders.useBoulderById>);

    const { getAllByText } = renderWithProviders(<BoulderDetailScreen />);

    // Title appears both in header and in info section
    const titleElements = getAllByText('Le Dévers Rouge');
    expect(titleElements.length).toBeGreaterThanOrEqual(2);
  });

  it('calls refetch when retry is pressed on error', () => {
    const mockRefetch = jest.fn();
    jest.spyOn(useBoulders, 'useBoulderById').mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error('Failed to fetch'),
      refetch: mockRefetch,
    } as unknown as ReturnType<typeof useBoulders.useBoulderById>);

    const { getByText } = renderWithProviders(<BoulderDetailScreen />);

    fireEvent.press(getByText('Réessayer'));

    expect(mockRefetch).toHaveBeenCalled();
  });
});

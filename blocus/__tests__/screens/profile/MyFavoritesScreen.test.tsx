import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { MyFavoritesScreen } from '@/screens/profile/MyFavoritesScreen';
import type { BoulderWithDetails } from '@/types/models/boulder';

// Mock navigation
const mockGoBack = jest.fn();
const mockDispatch = jest.fn();

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    goBack: mockGoBack,
    dispatch: mockDispatch,
  }),
  CommonActions: {
    navigate: (params: unknown) => params,
  },
}));

// Mock useFavorites hook
const mockUseFavorites = jest.fn();
jest.mock('@/hooks/useFavorites', () => ({
  useFavorites: () => mockUseFavorites(),
}));

const mockFavorites: BoulderWithDetails[] = [
  {
    id: 'boulder-1',
    wall_id: 'wall-1',
    title: 'Test Boulder 1',
    difficulty: 5,
    description: 'A test boulder',
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
    photos: [
      {
        id: 'photo-1',
        boulder_id: 'boulder-1',
        url: 'http://test1.jpg',
        order_index: 0,
        created_at: '2024-01-01',
      },
    ],
    validations_count: 0,
    comments_count: 0,
    is_favorited: true,
  },
  {
    id: 'boulder-2',
    wall_id: 'wall-1',
    title: 'Test Boulder 2',
    difficulty: 7,
    description: null,
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
    photos: [],
    validations_count: 3,
    comments_count: 1,
    is_favorited: true,
  },
];

describe('MyFavoritesScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseFavorites.mockReturnValue({
      data: mockFavorites,
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    });
  });

  it('renders favorites list', () => {
    render(<MyFavoritesScreen />);

    expect(screen.getByTestId('my-favorites-screen')).toBeTruthy();
    expect(screen.getByTestId('favorites-list')).toBeTruthy();
    expect(screen.getByText('Test Boulder 1')).toBeTruthy();
    expect(screen.getByText('Test Boulder 2')).toBeTruthy();
  });

  it('renders header with title', () => {
    render(<MyFavoritesScreen />);

    expect(screen.getByText('Mes Favoris')).toBeTruthy();
    expect(screen.getByTestId('back-button')).toBeTruthy();
  });

  it('navigates back on back button press', () => {
    render(<MyFavoritesScreen />);

    fireEvent.press(screen.getByTestId('back-button'));

    expect(mockGoBack).toHaveBeenCalled();
  });

  it('shows loading state', () => {
    mockUseFavorites.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
      refetch: jest.fn(),
    });

    render(<MyFavoritesScreen />);

    expect(screen.getByText('Chargement des favoris...')).toBeTruthy();
  });

  it('shows error state', () => {
    mockUseFavorites.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error('Load failed'),
      refetch: jest.fn(),
    });

    render(<MyFavoritesScreen />);

    expect(screen.getByText('Impossible de charger vos favoris')).toBeTruthy();
  });

  it('shows empty state when no favorites', () => {
    mockUseFavorites.mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    });

    render(<MyFavoritesScreen />);

    expect(screen.getByTestId('empty-favorites')).toBeTruthy();
    expect(screen.getByText('Aucun favori')).toBeTruthy();
    expect(screen.getByText('Explorez les boulders et ajoutez-les à vos favoris !')).toBeTruthy();
  });

  it('navigates to boulder detail on card press', () => {
    render(<MyFavoritesScreen />);

    fireEvent.press(screen.getByTestId('boulder-card-boulder-1'));

    expect(mockDispatch).toHaveBeenCalledWith({
      name: 'Explore',
      params: {
        screen: 'BoulderDetail',
        params: { boulderId: 'boulder-1' },
      },
    });
  });

  it('shows retry on error', () => {
    const mockRefetch = jest.fn();
    mockUseFavorites.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error('Load failed'),
      refetch: mockRefetch,
    });

    render(<MyFavoritesScreen />);

    // ErrorState component should have a retry button
    const retryButton = screen.getByText('Réessayer');
    fireEvent.press(retryButton);

    expect(mockRefetch).toHaveBeenCalled();
  });
});

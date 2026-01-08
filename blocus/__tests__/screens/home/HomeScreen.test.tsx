import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NavigationContainer } from '@react-navigation/native';
import { HomeScreen } from '@/screens/home/HomeScreen';
import * as useWallsModule from '@/hooks/useWalls';
import { useGymStore } from '@/stores/gymStore';
import type { Tables } from '@/types/database';

jest.mock('@/hooks/useWalls');

// Mock WallSection to avoid needing to mock nested useBouldersByWall hook
jest.mock('@/components/gym/WallSection', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return {
    WallSection: ({ wall }: { wall: { id: string; name: string } }) =>
      React.createElement(View, { testID: `wall-section-${wall.id}` }, React.createElement(Text, null, wall.name)),
  };
});

// Mock navigation
const mockReset = jest.fn();
jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({
      reset: mockReset,
    }),
  };
});

const mockGym: Tables<'gyms'> = {
  id: 'gym-1',
  name: 'Bloc Session Paris',
  address: '123 Rue de la Grimpe, 75011 Paris',
  latitude: 48.8566,
  longitude: 2.3522,
  description: null,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};

const mockWalls: Tables<'walls'>[] = [
  {
    id: 'wall-1',
    gym_id: 'gym-1',
    name: 'Dévers',
    description: null,
    order_index: 0,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'wall-2',
    gym_id: 'gym-1',
    name: 'Dalle',
    description: null,
    order_index: 1,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
];

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

describe('HomeScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useGymStore.setState({ selectedGym: mockGym, _hasHydrated: true });
  });

  it('renders selected gym name in header', () => {
    jest.spyOn(useWallsModule, 'useWallsByGym').mockReturnValue({
      data: mockWalls,
      isLoading: false,
      error: null,
      refetch: jest.fn(),
      isRefetching: false,
    } as unknown as ReturnType<typeof useWallsModule.useWallsByGym>);

    const { getByText } = renderWithProviders(<HomeScreen />);

    expect(getByText('Bloc Session Paris')).toBeTruthy();
  });

  it('renders home-screen testID', () => {
    jest.spyOn(useWallsModule, 'useWallsByGym').mockReturnValue({
      data: mockWalls,
      isLoading: false,
      error: null,
      refetch: jest.fn(),
      isRefetching: false,
    } as unknown as ReturnType<typeof useWallsModule.useWallsByGym>);

    const { getByTestId } = renderWithProviders(<HomeScreen />);

    expect(getByTestId('home-screen')).toBeTruthy();
  });

  it('shows loading spinner while fetching walls', () => {
    jest.spyOn(useWallsModule, 'useWallsByGym').mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
      refetch: jest.fn(),
      isRefetching: false,
    } as unknown as ReturnType<typeof useWallsModule.useWallsByGym>);

    const { getByText } = renderWithProviders(<HomeScreen />);

    expect(getByText('Chargement des murs...')).toBeTruthy();
  });

  it('shows error state when fetch fails', () => {
    jest.spyOn(useWallsModule, 'useWallsByGym').mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error('Fetch failed'),
      refetch: jest.fn(),
      isRefetching: false,
    } as unknown as ReturnType<typeof useWallsModule.useWallsByGym>);

    const { getByText } = renderWithProviders(<HomeScreen />);

    expect(getByText('Impossible de charger les murs')).toBeTruthy();
  });

  it('shows empty state when no walls exist', () => {
    jest.spyOn(useWallsModule, 'useWallsByGym').mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
      refetch: jest.fn(),
      isRefetching: false,
    } as unknown as ReturnType<typeof useWallsModule.useWallsByGym>);

    const { getByText } = renderWithProviders(<HomeScreen />);

    expect(getByText('Aucun mur')).toBeTruthy();
    expect(getByText("Cette salle n'a pas encore de murs configurés")).toBeTruthy();
  });

  it('renders wall sections when walls are loaded', () => {
    jest.spyOn(useWallsModule, 'useWallsByGym').mockReturnValue({
      data: mockWalls,
      isLoading: false,
      error: null,
      refetch: jest.fn(),
      isRefetching: false,
    } as unknown as ReturnType<typeof useWallsModule.useWallsByGym>);

    const { getByTestId } = renderWithProviders(<HomeScreen />);

    expect(getByTestId('wall-section-wall-1')).toBeTruthy();
    expect(getByTestId('wall-section-wall-2')).toBeTruthy();
  });

  it('clears gym and navigates to map when change button pressed', () => {
    jest.spyOn(useWallsModule, 'useWallsByGym').mockReturnValue({
      data: mockWalls,
      isLoading: false,
      error: null,
      refetch: jest.fn(),
      isRefetching: false,
    } as unknown as ReturnType<typeof useWallsModule.useWallsByGym>);

    const { getByTestId } = renderWithProviders(<HomeScreen />);

    fireEvent.press(getByTestId('change-gym-button'));

    expect(useGymStore.getState().selectedGym).toBeNull();
    expect(mockReset).toHaveBeenCalledWith({
      index: 0,
      routes: [{ name: 'GymMap' }],
    });
  });

  it('handles missing gym gracefully', () => {
    useGymStore.setState({ selectedGym: null, _hasHydrated: true });

    jest.spyOn(useWallsModule, 'useWallsByGym').mockReturnValue({
      data: undefined,
      isLoading: false,
      error: null,
      refetch: jest.fn(),
      isRefetching: false,
    } as unknown as ReturnType<typeof useWallsModule.useWallsByGym>);

    const { getByTestId } = renderWithProviders(<HomeScreen />);

    // GymHeader should handle null gracefully
    expect(getByTestId('home-screen')).toBeTruthy();
  });

  it('calls refetch when pull to refresh is triggered', () => {
    const mockRefetch = jest.fn();
    jest.spyOn(useWallsModule, 'useWallsByGym').mockReturnValue({
      data: mockWalls,
      isLoading: false,
      error: null,
      refetch: mockRefetch,
      isRefetching: false,
    } as unknown as ReturnType<typeof useWallsModule.useWallsByGym>);

    const { getByTestId } = renderWithProviders(<HomeScreen />);
    const scrollView = getByTestId('home-screen');

    // Simulate refresh control
    const refreshControl = scrollView.props.refreshControl;
    refreshControl.props.onRefresh();

    expect(mockRefetch).toHaveBeenCalled();
  });
});

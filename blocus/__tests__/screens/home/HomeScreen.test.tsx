import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { HomeScreen } from '@/screens/home/HomeScreen';
import { useGymStore } from '@/stores/gymStore';
import type { Tables } from '@/types/database';

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
  description: 'Une super salle',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};

const renderWithNavigation = (component: React.ReactElement) => {
  return render(<NavigationContainer>{component}</NavigationContainer>);
};

describe('HomeScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useGymStore.setState({ selectedGym: mockGym, _hasHydrated: true });
  });

  it('renders selected gym name', () => {
    const { getByText } = renderWithNavigation(<HomeScreen />);

    expect(getByText('Bloc Session Paris')).toBeTruthy();
  });

  it('displays welcome message with gym name', () => {
    const { getByText } = renderWithNavigation(<HomeScreen />);

    expect(getByText(/Les boulders de Bloc Session Paris arrivent bientôt/)).toBeTruthy();
  });

  it('displays change gym button', () => {
    const { getByText } = renderWithNavigation(<HomeScreen />);

    expect(getByText('Changer')).toBeTruthy();
  });

  it('shows Epic 3 coming soon badge', () => {
    const { getByText } = renderWithNavigation(<HomeScreen />);

    expect(getByText('Epic 3 - Boulder Exploration')).toBeTruthy();
  });

  it('clears gym and navigates to map when change button pressed', () => {
    const { getByTestId } = renderWithNavigation(<HomeScreen />);

    fireEvent.press(getByTestId('change-gym-button'));

    expect(useGymStore.getState().selectedGym).toBeNull();
    expect(mockReset).toHaveBeenCalledWith({
      index: 0,
      routes: [{ name: 'GymMap' }],
    });
  });

  it('handles missing gym gracefully', () => {
    useGymStore.setState({ selectedGym: null, _hasHydrated: true });

    const { getByText } = renderWithNavigation(<HomeScreen />);

    expect(getByText('Aucune salle')).toBeTruthy();
    expect(getByText(/Les boulders de cette salle arrivent bientôt/)).toBeTruthy();
  });
});

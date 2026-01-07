import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { ProfileScreen } from '@/screens/profile/ProfileScreen';
import { useGymStore } from '@/stores/gymStore';

// Mock navigation
const mockDispatch = jest.fn();
jest.mock('@react-navigation/native', () => {
  const actual = jest.requireActual('@react-navigation/native');
  return {
    ...actual,
    useNavigation: () => ({
      dispatch: mockDispatch,
    }),
  };
});

describe('ProfileScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useGymStore.setState({ selectedGym: null, _hasHydrated: true });
  });

  it('renders placeholder content', () => {
    const { getByText, getByTestId } = render(
      <NavigationContainer>
        <ProfileScreen />
      </NavigationContainer>
    );

    expect(getByTestId('profile-screen')).toBeTruthy();
    expect(getByText('Profil')).toBeTruthy();
    expect(getByText('Coming in Epic 4')).toBeTruthy();
  });

  it('renders current gym section', () => {
    const { getByText } = render(
      <NavigationContainer>
        <ProfileScreen />
      </NavigationContainer>
    );

    expect(getByText('Salle actuelle')).toBeTruthy();
    expect(getByText('Changer de salle')).toBeTruthy();
  });

  it('displays selected gym name when available', () => {
    useGymStore.setState({
      selectedGym: {
        id: '1',
        name: 'Bloc Shop',
        address: '123 Test St',
        latitude: 45.5,
        longitude: -73.5,
        description: null,
        created_at: '2024-01-01',
        updated_at: '2024-01-01',
      },
      _hasHydrated: true,
    });

    const { getByText } = render(
      <NavigationContainer>
        <ProfileScreen />
      </NavigationContainer>
    );

    expect(getByText('Bloc Shop')).toBeTruthy();
  });

  it('displays fallback text when no gym selected', () => {
    const { getByText } = render(
      <NavigationContainer>
        <ProfileScreen />
      </NavigationContainer>
    );

    expect(getByText('Aucune salle sélectionnée')).toBeTruthy();
  });

  it('navigates to gym map when change gym is pressed', () => {
    useGymStore.setState({
      selectedGym: {
        id: '1',
        name: 'Test Gym',
        address: '123 Test St',
        latitude: 45.5,
        longitude: -73.5,
        description: null,
        created_at: '2024-01-01',
        updated_at: '2024-01-01',
      },
      _hasHydrated: true,
    });

    const { getByTestId } = render(
      <NavigationContainer>
        <ProfileScreen />
      </NavigationContainer>
    );

    fireEvent.press(getByTestId('change-gym-button'));

    expect(mockDispatch).toHaveBeenCalledTimes(1);
    // Verify gym was cleared
    expect(useGymStore.getState().selectedGym).toBeNull();
  });
});

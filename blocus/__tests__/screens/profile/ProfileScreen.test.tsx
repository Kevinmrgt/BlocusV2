import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { ProfileScreen } from '@/screens/profile/ProfileScreen';
import { useGymStore } from '@/stores/gymStore';

// Mock navigation
const mockDispatch = jest.fn();
const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => {
  const actual = jest.requireActual('@react-navigation/native');
  return {
    ...actual,
    useNavigation: () => ({
      dispatch: mockDispatch,
      navigate: mockNavigate,
    }),
  };
});

// Mock auth provider
jest.mock('@/providers/AuthProvider', () => ({
  useAuth: () => ({
    isAuthenticated: true,
    user: { email: 'test@example.com' },
    session: {},
    isLoading: false,
    signIn: jest.fn(),
    signUp: jest.fn(),
    signOut: jest.fn(),
  }),
}));

// Mock Supabase
jest.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: jest.fn().mockResolvedValue({ data: { session: null } }),
      onAuthStateChange: jest.fn().mockReturnValue({
        data: { subscription: { unsubscribe: jest.fn() } },
      }),
    },
  },
}));

describe('ProfileScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useGymStore.setState({ selectedGym: null, _hasHydrated: true });
  });

  it('renders profile screen with title', () => {
    const { getByText, getByTestId } = render(
      <NavigationContainer>
        <ProfileScreen />
      </NavigationContainer>
    );

    expect(getByTestId('profile-screen')).toBeTruthy();
    expect(getByText('Profil')).toBeTruthy();
    expect(getByText('test@example.com')).toBeTruthy();
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

    expect(getByText('Aucune salle selectionnee')).toBeTruthy();
  });

  it('renders settings section', () => {
    const { getByTestId, getByText } = render(
      <NavigationContainer>
        <ProfileScreen />
      </NavigationContainer>
    );

    expect(getByTestId('settings-button')).toBeTruthy();
    expect(getByTestId('settings-card')).toBeTruthy();
    expect(getByText('Compte et preferences')).toBeTruthy();
  });

  it('navigates to settings when settings button is pressed', () => {
    const { getByTestId } = render(
      <NavigationContainer>
        <ProfileScreen />
      </NavigationContainer>
    );

    fireEvent.press(getByTestId('settings-button'));

    expect(mockNavigate).toHaveBeenCalledWith('Settings');
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

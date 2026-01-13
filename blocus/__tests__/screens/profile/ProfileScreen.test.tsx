import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
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
const mockAuthState = {
  isAuthenticated: true,
  user: { id: 'user-123', email: 'test@example.com' },
  session: {},
  isLoading: false,
  signIn: jest.fn(),
  signUp: jest.fn(),
  signOut: jest.fn(),
};

jest.mock('@/providers/AuthProvider', () => ({
  useAuth: () => mockAuthState,
}));

// Mock useUserProfile hook
const mockProfileData = {
  id: 'user-123',
  email: 'test@example.com',
  username: 'ClimbMaster42',
  bio: 'Grimpe et souris!',
  avatar_url: null,
  total_points: 1250,
  validations_count: 23,
  favorites_count: 8,
  rank: null,
  created_at: '2024-01-01',
  updated_at: '2024-01-01',
};

jest.mock('@/hooks/useUserProfile', () => ({
  useUserProfile: () => ({
    data: mockProfileData,
    isLoading: false,
    error: null,
  }),
  useUpdateProfile: () => ({
    mutateAsync: jest.fn(),
    isPending: false,
  }),
}));

// Mock useFavorites hook
jest.mock('@/hooks/useFavorites', () => ({
  useFavorites: () => ({
    data: [],
    isLoading: false,
    error: null,
  }),
  useIsFavorited: () => ({ data: false, isLoading: false }),
  useToggleFavorite: () => ({ mutate: jest.fn(), isPending: false }),
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

// Mock expo-image
jest.mock('expo-image', () => ({
  Image: 'Image',
}));

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

const renderWithProviders = (component: React.ReactElement) => {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>{component}</NavigationContainer>
    </QueryClientProvider>
  );
};

describe('ProfileScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useGymStore.setState({ selectedGym: null, _hasHydrated: true });
    mockAuthState.isAuthenticated = true;
  });

  it('renders profile screen', () => {
    const { getByTestId } = renderWithProviders(<ProfileScreen />);

    expect(getByTestId('profile-screen')).toBeTruthy();
  });

  it('renders ProfileHeader with user data', () => {
    const { getByTestId, getByText } = renderWithProviders(<ProfileScreen />);

    expect(getByTestId('profile-header')).toBeTruthy();
    expect(getByText('ClimbMaster42')).toBeTruthy();
    expect(getByText('Grimpe et souris!')).toBeTruthy();
  });

  it('renders UserStats with 4 stat cards', () => {
    const { getByTestId, getByText } = renderWithProviders(<ProfileScreen />);

    expect(getByTestId('user-stats')).toBeTruthy();
    expect(getByText('1250')).toBeTruthy();
    expect(getByText('23')).toBeTruthy();
    expect(getByText('8')).toBeTruthy();
    expect(getByText('--')).toBeTruthy(); // rank placeholder
  });

  it('renders History and Favorites tabs', () => {
    const { getByTestId, getByText } = renderWithProviders(<ProfileScreen />);

    expect(getByTestId('tab-history')).toBeTruthy();
    expect(getByTestId('tab-favorites')).toBeTruthy();
    expect(getByText('Historique')).toBeTruthy();
    expect(getByText('Favoris')).toBeTruthy();
  });

  it('switches between tabs', () => {
    const { getByTestId } = renderWithProviders(<ProfileScreen />);

    // Initially history is active
    expect(getByTestId('history-placeholder')).toBeTruthy();

    // Switch to favorites
    fireEvent.press(getByTestId('tab-favorites'));
    expect(getByTestId('favorites-empty')).toBeTruthy();

    // Switch back to history
    fireEvent.press(getByTestId('tab-history'));
    expect(getByTestId('history-placeholder')).toBeTruthy();
  });

  it('renders current gym section', () => {
    const { getByText, getByTestId } = renderWithProviders(<ProfileScreen />);

    expect(getByText('Salle actuelle')).toBeTruthy();
    expect(getByTestId('change-gym-button')).toBeTruthy();
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

    const { getByText } = renderWithProviders(<ProfileScreen />);

    expect(getByText('Bloc Shop')).toBeTruthy();
  });

  it('renders settings button', () => {
    const { getByTestId } = renderWithProviders(<ProfileScreen />);

    expect(getByTestId('settings-button')).toBeTruthy();
  });

  it('navigates to settings when settings button is pressed', () => {
    const { getByTestId } = renderWithProviders(<ProfileScreen />);

    fireEvent.press(getByTestId('settings-button'));

    expect(mockNavigate).toHaveBeenCalledWith('Settings');
  });

  it('navigates to EditProfile when edit button is pressed', () => {
    const { getByTestId } = renderWithProviders(<ProfileScreen />);

    fireEvent.press(getByTestId('edit-profile-button'));

    expect(mockNavigate).toHaveBeenCalledWith('EditProfile');
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

    const { getByTestId } = renderWithProviders(<ProfileScreen />);

    fireEvent.press(getByTestId('change-gym-button'));

    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(useGymStore.getState().selectedGym).toBeNull();
  });

  it('shows guest mode when not authenticated', () => {
    mockAuthState.isAuthenticated = false;

    const { getByText } = renderWithProviders(<ProfileScreen />);

    expect(getByText('Mode invité')).toBeTruthy();
    expect(getByText('Connectez-vous pour voir vos statistiques')).toBeTruthy();
  });
});

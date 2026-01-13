import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Alert } from 'react-native';
import { EditProfileScreen } from '@/screens/profile/EditProfileScreen';

// Mock navigation
const mockGoBack = jest.fn();
jest.mock('@react-navigation/native', () => {
  const actual = jest.requireActual('@react-navigation/native');
  return {
    ...actual,
    useNavigation: () => ({
      goBack: mockGoBack,
    }),
  };
});

// Mock useUserProfile hook
const mockMutateAsync = jest.fn();
const mockProfileData = {
  id: 'user-123',
  email: 'test@example.com',
  username: 'OldUsername',
  bio: 'Old bio',
  avatar_url: null,
  total_points: 100,
  validations_count: 5,
  favorites_count: 3,
  rank: null,
  created_at: '2024-01-01',
  updated_at: '2024-01-01',
};

jest.mock('@/hooks/useUserProfile', () => ({
  useUserProfile: () => ({
    data: mockProfileData,
    isLoading: false,
  }),
  useUpdateProfile: () => ({
    mutateAsync: mockMutateAsync,
    isPending: false,
  }),
}));

// Mock storage service
jest.mock('@/services/api/storage', () => ({
  uploadAvatar: jest.fn().mockResolvedValue('https://example.com/new-avatar.jpg'),
}));

// Mock expo-image-picker
jest.mock('expo-image-picker', () => ({
  launchCameraAsync: jest.fn(),
  launchImageLibraryAsync: jest.fn(),
}));

// Mock expo-image
jest.mock('expo-image', () => ({
  Image: 'Image',
}));

// Mock Alert
jest.spyOn(Alert, 'alert');

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

describe('EditProfileScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockMutateAsync.mockResolvedValue({});
  });

  it('renders form fields', () => {
    const { getByTestId, getByText } = renderWithProviders(<EditProfileScreen />);

    expect(getByTestId('username-input')).toBeTruthy();
    expect(getByTestId('bio-input')).toBeTruthy();
    expect(getByTestId('save-button')).toBeTruthy();
    expect(getByText("Nom d'utilisateur")).toBeTruthy();
    expect(getByText('Bio')).toBeTruthy();
  });

  it('renders avatar section with picker buttons', () => {
    const { getByTestId, getByText } = renderWithProviders(<EditProfileScreen />);

    expect(getByTestId('avatar-picker')).toBeTruthy();
    expect(getByTestId('camera-button')).toBeTruthy();
    expect(getByTestId('gallery-button')).toBeTruthy();
    expect(getByText('Photo')).toBeTruthy();
    expect(getByText('Galerie')).toBeTruthy();
  });

  it('pre-fills form with existing profile data', () => {
    const { getByTestId } = renderWithProviders(<EditProfileScreen />);

    const usernameInput = getByTestId('username-input');
    const bioInput = getByTestId('bio-input');

    expect(usernameInput.props.value).toBe('OldUsername');
    expect(bioInput.props.value).toBe('Old bio');
  });

  it('updates username field on change', () => {
    const { getByTestId } = renderWithProviders(<EditProfileScreen />);

    const usernameInput = getByTestId('username-input');
    fireEvent.changeText(usernameInput, 'NewUsername');

    expect(usernameInput.props.value).toBe('NewUsername');
  });

  it('updates bio field on change', () => {
    const { getByTestId } = renderWithProviders(<EditProfileScreen />);

    const bioInput = getByTestId('bio-input');
    fireEvent.changeText(bioInput, 'New bio text');

    expect(bioInput.props.value).toBe('New bio text');
  });

  it('shows validation error for username too short', async () => {
    const { getByTestId, findByTestId } = renderWithProviders(<EditProfileScreen />);

    const usernameInput = getByTestId('username-input');
    fireEvent.changeText(usernameInput, 'ab');

    fireEvent.press(getByTestId('save-button'));

    const error = await findByTestId('username-error');
    expect(error).toBeTruthy();
  });

  it('shows validation error for username with invalid characters', async () => {
    const { getByTestId, findByTestId } = renderWithProviders(<EditProfileScreen />);

    const usernameInput = getByTestId('username-input');
    fireEvent.changeText(usernameInput, 'user@name!');

    fireEvent.press(getByTestId('save-button'));

    const error = await findByTestId('username-error');
    expect(error).toBeTruthy();
  });

  it('shows validation error for bio too long', async () => {
    const { getByTestId, findByTestId } = renderWithProviders(<EditProfileScreen />);

    const bioInput = getByTestId('bio-input');
    const longBio = 'a'.repeat(201);
    fireEvent.changeText(bioInput, longBio);

    fireEvent.press(getByTestId('save-button'));

    const error = await findByTestId('bio-error');
    expect(error).toBeTruthy();
  });

  it('submits form with valid data', async () => {
    const { getByTestId } = renderWithProviders(<EditProfileScreen />);

    const usernameInput = getByTestId('username-input');
    const bioInput = getByTestId('bio-input');

    fireEvent.changeText(usernameInput, 'ValidUser');
    fireEvent.changeText(bioInput, 'Valid bio');

    fireEvent.press(getByTestId('save-button'));

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith({
        username: 'ValidUser',
        bio: 'Valid bio',
        avatar_url: undefined,
      });
    });
  });

  it('navigates back on successful save', async () => {
    const { getByTestId } = renderWithProviders(<EditProfileScreen />);

    fireEvent.press(getByTestId('save-button'));

    await waitFor(() => {
      expect(mockGoBack).toHaveBeenCalled();
    });
  });

  it('shows alert on save error', async () => {
    mockMutateAsync.mockRejectedValueOnce(new Error('Update failed'));

    const { getByTestId } = renderWithProviders(<EditProfileScreen />);

    fireEvent.press(getByTestId('save-button'));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Erreur', 'Impossible de mettre à jour le profil');
    });
  });

  it('displays character count for bio', () => {
    const { getByTestId, getByText } = renderWithProviders(<EditProfileScreen />);

    const bioInput = getByTestId('bio-input');
    fireEvent.changeText(bioInput, 'Test bio');

    expect(getByText('8/200 caractères')).toBeTruthy();
  });

  it('clears error when user types after validation error', async () => {
    const { getByTestId, findByTestId, queryByTestId } = renderWithProviders(<EditProfileScreen />);

    const usernameInput = getByTestId('username-input');
    fireEvent.changeText(usernameInput, 'ab');
    fireEvent.press(getByTestId('save-button'));

    await findByTestId('username-error');

    fireEvent.changeText(usernameInput, 'ValidUsername');

    expect(queryByTestId('username-error')).toBeNull();
  });
});
